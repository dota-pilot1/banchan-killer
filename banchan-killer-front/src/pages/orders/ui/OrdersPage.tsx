import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type OrderSummary = {
  id: number;
  orderNumber: string;
  status: string;
  totalAmount: number;
  items: Array<{ productName: string }>;
};

export const OrdersPage = () => {
  const { isAuthenticated } = useUserStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.get<OrderSummary[]>('/orders');
        setOrders(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '주문 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      void loadOrders();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="space-y-2">
            <Link to="/mypage?tab=profile" className="text-sm font-semibold text-orange-600">
              마이페이지로
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">주문 내역</h1>
            <p className="text-sm leading-6 text-slate-600">생성한 주문을 한 곳에서 확인하고 결제 단계로 이어갈 수 있습니다.</p>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="h-24 animate-pulse rounded-3xl bg-white" />
            <div className="h-24 animate-pulse rounded-3xl bg-white" />
          </div>
        ) : orders.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">아직 생성된 주문이 없습니다</h2>
            <p className="mt-3 text-slate-500">장바구니에서 상품을 고른 뒤 주문서를 작성해보세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-orange-600">{order.orderNumber}</p>
                    <h2 className="mt-2 text-2xl font-bold text-slate-900">
                      {order.items[0]?.productName || '주문 상품'}{order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''}
                    </h2>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-500">{order.status}</p>
                    <p className="mt-2 text-2xl font-extrabold text-slate-900">{order.totalAmount.toLocaleString()}원</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
