import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';
import { Header } from '@/widgets/header/ui/Header';
import { useCartStore } from '@/entities/cart/model/store';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY;

type OrderSummary = {
  id: number;
  orderNumber: string;
  ordererName: string;
  totalAmount: number;
  items: Array<{ productName: string; quantity: number; lineTotalAmount: number }>;
};

export const PaymentPage = () => {
  const { isAuthenticated, user } = useUserStore();
  const removeSelectedItems = useCartStore((state) => state.removeSelectedItems);
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [toss, setToss] = useState<any>(null);

  // 결제 페이지 진입 시 장바구니 선택 해제
  useEffect(() => {
    removeSelectedItems();
  }, []);

  // 주문 정보 로드
  useEffect(() => {
    if (!orderId) return;
    void (async () => {
      try {
        const res = await apiClient.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch {
        setError('주문 정보를 불러올 수 없습니다.');
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  // 토스 SDK 초기화
  useEffect(() => {
    if (!order) return;
    void (async () => {
      try {
        const tossPayments = await loadTossPayments(CLIENT_KEY);
        setToss(tossPayments);
      } catch (e) {
        console.error('토스 SDK 초기화 실패:', e);
        setError('결제 모듈을 불러올 수 없습니다.');
      }
    })();
  }, [order]);

  // 결제 요청 (API 개별 연동 방식)
  const handlePayment = async () => {
    if (!toss || !order) return;
    setPaying(true);
    setError('');

    try {
      const firstItem = order.items[0]?.productName || '상품';
      const orderName = order.items.length > 1
        ? `${firstItem} 외 ${order.items.length - 1}건`
        : firstItem;

      const payment = toss.payment({ customerKey: `customer_${user?.id || 'anon'}` });

      await payment.requestPayment({
        method: 'CARD',
        amount: { currency: 'KRW', value: order.totalAmount },
        orderId: order.orderNumber,
        orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: user?.email,
        customerName: order.ordererName,
        card: {
          useEscrow: false,
          flowMode: 'DEFAULT',
          useCardPoint: false,
          useAppCardOnly: false,
        },
      });
    } catch (e: any) {
      if (e.code === 'USER_CANCEL') {
        setError('');
      } else {
        setError(e.message || '결제 요청에 실패했습니다.');
      }
    } finally {
      setPaying(false);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* 타이틀 */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900">결제</h1>
          {order && (
            <p className="mt-2 text-slate-500">
              주문번호 <span className="font-mono font-semibold text-slate-700">{order.orderNumber}</span>
              {' · '}
              <span className="font-bold text-blue-600">{order.totalAmount.toLocaleString()}원</span>
            </p>
          )}
        </div>

        {loading ? (
          <div className="mt-16 text-center text-slate-400">불러오는 중...</div>
        ) : error && !order ? (
          <div className="mt-16 text-center text-red-500">{error}</div>
        ) : order ? (
          <div className="mt-8 space-y-6">
            {/* 주문 요약 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">주문 요약</h2>
              <div className="mt-3 divide-y divide-slate-100">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-2.5 text-sm">
                    <span className="text-slate-700">{item.productName} × {item.quantity}</span>
                    <span className="font-semibold">{item.lineTotalAmount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between">
                <span className="font-bold text-slate-900">총 결제 금액</span>
                <span className="text-xl font-bold text-blue-600">{order.totalAmount.toLocaleString()}원</span>
              </div>
            </section>

            {/* 결제 수단 안내 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">결제 수단</h2>
              <p className="mt-2 text-sm text-slate-500">결제하기 버튼을 누르면 토스페이먼츠 결제창이 열립니다.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {['신용/체크카드', '계좌이체', '토스페이', '카카오페이', '네이버페이'].map((m) => (
                  <span key={m} className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600">{m}</span>
                ))}
              </div>
            </section>

            {/* 에러 메시지 */}
            {error && <p className="text-center text-sm text-red-500">{error}</p>}

            {/* 결제 버튼 */}
            <button
              onClick={handlePayment}
              disabled={paying || !toss}
              className="w-full rounded-2xl bg-blue-600 py-4 text-base font-bold text-white hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
            >
              {paying ? '결제 처리 중...' : `${order.totalAmount.toLocaleString()}원 결제하기`}
            </button>

            {/* 하단 링크 */}
            <Link
              to={`/orders/${order.id}`}
              className="block text-center text-sm text-slate-400 hover:text-slate-600 transition-colors"
            >
              나중에 결제할게요
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
};
