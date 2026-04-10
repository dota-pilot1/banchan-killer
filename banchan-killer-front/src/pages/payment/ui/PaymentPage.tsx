import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type OrderSummary = {
  id: number;
  orderNumber: string;
  totalAmount: number;
  items: Array<{ productName: string; quantity: number }>;
};

export const PaymentPage = () => {
  const { isAuthenticated } = useUserStore();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) return;
    void (async () => {
      try {
        const res = await apiClient.get(`/orders/${orderId}`);
        setOrder(res.data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-slate-50">
      <Header />
      <main className="mx-auto max-w-2xl px-4 py-12">
        {/* 타이틀 영역 */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
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
        ) : !order ? (
          <div className="mt-16 text-center text-slate-400">주문 정보를 찾을 수 없습니다.</div>
        ) : (
          <div className="mt-10 space-y-6">
            {/* 구현 예정 안내 */}
            <section className="rounded-3xl border-2 border-dashed border-slate-300 bg-white/80 backdrop-blur p-10 text-center">
              <div className="text-5xl">🏗️</div>
              <h2 className="mt-4 text-xl font-bold text-slate-800">결제 기능 구현 예정</h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                PG 결제 연동 (카드결제 · 계좌이체 · 간편결제)은<br />
                3차 구현 단계에서 진행됩니다.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2">
                {['카드결제', '계좌이체', '카카오페이', '네이버페이', '토스페이'].map((method) => (
                  <span key={method} className="px-3 py-1.5 rounded-full bg-slate-100 text-xs font-medium text-slate-500">
                    {method}
                  </span>
                ))}
              </div>
            </section>

            {/* 하단 네비게이션 */}
            <div className="flex gap-3">
              <Link
                to={`/orders/${order.id}`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                주문 상세 보기
              </Link>
              <Link
                to="/orders"
                className="flex-1 rounded-2xl bg-blue-600 py-4 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                주문 목록으로
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
