import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type PaymentSummary = {
  id: number;
  orderNumber: string;
  method: string;
  totalAmount: number;
  status: string;
  approvedAt: string;
  items: Array<{ productName: string; quantity: number }>;
};

export const PaymentsPage = () => {
  const { isAuthenticated } = useUserStore();
  const [payments, setPayments] = useState<PaymentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      try {
        const { data } = await apiClient.get('/payments');
        setPayments(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <div className="mb-8">
          <Link to="/" className="text-sm font-semibold text-orange-600">홈으로</Link>
          <h1 className="mt-2 text-4xl font-extrabold text-slate-900">결제 내역</h1>
          <p className="mt-1 text-slate-500">결제 완료된 내역을 확인할 수 있습니다.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : payments.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">결제 내역이 없습니다</h2>
            <p className="mt-3 text-slate-500">상품을 주문하고 결제해 보세요.</p>
            <Link to="/category/vegetable" className="mt-6 inline-flex rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800">
              상품 보러가기
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => {
              const firstItem = payment.items[0]?.productName || '상품';
              const orderName = payment.items.length > 1
                ? `${firstItem} 외 ${payment.items.length - 1}건`
                : firstItem;

              return (
                <Link
                  key={payment.id}
                  to={`/payments/${payment.id}`}
                  className="block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-bold text-slate-900">{orderName}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {payment.orderNumber} · {payment.method}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        {payment.approvedAt ? new Date(payment.approvedAt).toLocaleString('ko-KR') : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-extrabold text-slate-900">
                        {payment.totalAmount.toLocaleString()}원
                      </p>
                      <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
                        {payment.status === 'DONE' ? '결제완료' : payment.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
