import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useCartStore } from '@/entities/cart/model/store';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

export const PaymentSuccessPage = () => {
  const { isAuthenticated } = useUserStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState<number | null>(null);
  const confirmedRef = useRef(false);

  const paymentKey = searchParams.get('paymentKey');
  const orderNumber = searchParams.get('orderId');
  const amount = searchParams.get('amount');

  useEffect(() => {
    if (!paymentKey || !orderNumber || !amount) {
      setStatus('error');
      setErrorMessage('결제 정보가 올바르지 않습니다.');
      return;
    }

    // StrictMode 중복 호출 방지
    if (confirmedRef.current) return;
    confirmedRef.current = true;

    void (async () => {
      try {
        const res = await apiClient.post('/payments/confirm', {
          paymentKey,
          orderId: orderNumber,
          amount: Number(amount),
        });
        setOrderId(res.data.orderId);
        setStatus('success');
        // 장바구니 갱신 (백엔드에서 삭제됨)
        fetchCart();
      } catch (err: any) {
        const msg = err.response?.data?.message || '';
        // 이미 처리된 결제면 성공으로 처리
        if (msg.includes('이미 결제') || msg.includes('이미 처리')) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(msg || '결제 승인에 실패했습니다.');
        }
      }
    })();
  }, [paymentKey, orderNumber, amount, fetchCart]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        {status === 'loading' && (
          <>
            <div className="text-4xl animate-spin inline-block">⏳</div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">결제 승인 중...</h1>
            <p className="mt-2 text-slate-500">잠시만 기다려 주세요.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl">✅</div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">결제가 완료되었습니다</h1>
            <p className="mt-2 text-slate-500">
              주문번호 <span className="font-mono font-semibold">{orderNumber}</span>
            </p>
            <div className="mt-8 flex gap-3 justify-center">
              {orderId && (
                <Link
                  to={`/orders/${orderId}`}
                  className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
                >
                  주문 상세 보기
                </Link>
              )}
              <Link
                to="/"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl">❌</div>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">결제 승인 실패</h1>
            <p className="mt-2 text-red-500">{errorMessage}</p>
            <div className="mt-8">
              <Link
                to="/orders"
                className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                주문 목록으로
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
};
