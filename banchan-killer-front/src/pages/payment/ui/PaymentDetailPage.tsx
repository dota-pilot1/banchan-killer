import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type PaymentDetail = {
  id: number;
  paymentKey: string;
  method: string;
  totalAmount: number;
  status: string;
  requestedAt: string;
  approvedAt: string;
  receiptUrl: string;
  orderId: number;
  orderNumber: string;
  orderStatus: string;
  ordererName: string;
  items: Array<{
    productName: string;
    unitPrice: number;
    quantity: number;
    lineTotalAmount: number;
  }>;
};

export const PaymentDetailPage = () => {
  const { isAuthenticated } = useUserStore();
  const { paymentId } = useParams<{ paymentId: string }>();
  const [payment, setPayment] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paymentId) return;
    void (async () => {
      try {
        const { data } = await apiClient.get(`/payments/${paymentId}`);
        setPayment(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, [paymentId]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <Link to="/payments" className="text-sm font-semibold text-orange-600">← 결제 내역</Link>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">결제 상세</h1>

        {loading ? (
          <div className="mt-8 space-y-4">
            <div className="h-40 animate-pulse rounded-2xl bg-white" />
          </div>
        ) : !payment ? (
          <div className="mt-8 text-center text-slate-400">결제 정보를 찾을 수 없습니다.</div>
        ) : (
          <div className="mt-8 space-y-6">
            {/* 결제 정보 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">결제 정보</h2>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  {payment.status === 'DONE' ? '결제완료' : payment.status}
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">결제 금액</span>
                  <span className="text-xl font-extrabold text-slate-900">{payment.totalAmount.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">결제 수단</span>
                  <span className="font-semibold text-slate-700">{payment.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">승인 일시</span>
                  <span className="text-slate-700">
                    {payment.approvedAt ? new Date(payment.approvedAt).toLocaleString('ko-KR') : '-'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">주문번호</span>
                  <span className="font-mono text-slate-700">{payment.orderNumber}</span>
                </div>
                {payment.receiptUrl && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">영수증</span>
                    <a href={payment.receiptUrl} target="_blank" rel="noopener noreferrer"
                       className="text-blue-600 hover:underline">영수증 보기</a>
                  </div>
                )}
              </div>
            </section>

            {/* 결제 상품 */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">결제 상품</h2>
              <div className="mt-4 divide-y divide-slate-100">
                {payment.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-3 text-sm">
                    <div>
                      <span className="font-semibold text-slate-800">{item.productName}</span>
                      <span className="ml-2 text-slate-500">× {item.quantity}</span>
                    </div>
                    <span className="font-semibold text-slate-900">{item.lineTotalAmount.toLocaleString()}원</span>
                  </div>
                ))}
              </div>
            </section>

            {/* 하단 링크 */}
            <div className="flex gap-3">
              <Link
                to={`/orders/${payment.orderId}`}
                className="flex-1 rounded-2xl border border-slate-200 bg-white py-4 text-center text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                주문 상세 보기
              </Link>
              <Link
                to="/payments"
                className="flex-1 rounded-2xl bg-slate-900 py-4 text-center text-sm font-semibold text-white hover:bg-slate-800 transition-colors"
              >
                결제 내역으로
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
