import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type OrderItem = {
  id: number;
  productId: number;
  productName: string;
  productImageUrl: string;
  productCategory: string;
  unitPrice: number;
  quantity: number;
  lineTotalAmount: number;
};

type OrderDetail = {
  id: number;
  orderNumber: string;
  status: string;
  ordererName: string;
  ordererPhone: string;
  recipientName: string;
  recipientPhone: string;
  zipCode: string;
  address1: string;
  address2: string;
  deliveryRequest: string;
  itemsAmount: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  items: OrderItem[];
};

export const OrderDetailPage = () => {
  const { isAuthenticated } = useUserStore();
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      return;
    }

    const loadOrder = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.get<OrderDetail>(`/orders/${orderId}`);
        setOrder(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '주문 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrder();
  }, [orderId]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="space-y-2">
            <Link to="/orders" className="text-sm font-semibold text-orange-600">
              주문 목록으로
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">주문 상세</h1>
            <p className="text-sm leading-6 text-slate-600">생성된 주문과 배송 정보를 바로 확인할 수 있습니다.</p>
          </div>
        </section>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-3xl bg-white" />
            <div className="h-56 animate-pulse rounded-3xl bg-white" />
          </div>
        ) : error ? (
          <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
        ) : order ? (
          <div className="space-y-6">
            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-orange-600">주문번호</p>
                  <h2 className="mt-1 text-3xl font-extrabold tracking-tight text-slate-900">{order.orderNumber}</h2>
                </div>
                <span className="inline-flex rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600">
                  {order.status}
                </span>
              </div>
            </section>

            <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-2xl font-bold text-slate-900">주문 상품</h3>
              <div className="mt-5 space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4 rounded-3xl bg-slate-50 p-4">
                    <img
                      src={item.productImageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                      alt={item.productName}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-slate-900">{item.productName}</p>
                        <p className="mt-1 text-sm text-slate-500">수량 {item.quantity}개</p>
                      </div>
                      <span className="text-lg font-extrabold text-slate-900">{item.lineTotalAmount.toLocaleString()}원</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="grid gap-6 xl:grid-cols-2">
              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">배송 정보</h3>
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <p><span className="font-semibold text-slate-800">수령인</span> {order.recipientName}</p>
                  <p><span className="font-semibold text-slate-800">연락처</span> {order.recipientPhone}</p>
                  <p><span className="font-semibold text-slate-800">주소</span> [{order.zipCode}] {order.address1} {order.address2}</p>
                  <p><span className="font-semibold text-slate-800">요청사항</span> {order.deliveryRequest || '-'}</p>
                </div>
              </article>

              <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-slate-900">결제 예정 금액</h3>
                <div className="mt-5 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>상품 금액</span>
                    <span className="font-semibold text-slate-900">{order.itemsAmount.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>배송비</span>
                    <span className="font-semibold text-slate-900">{order.deliveryFee.toLocaleString()}원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>할인</span>
                    <span className="font-semibold text-slate-900">{order.discountAmount.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-200 pt-6">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-slate-700">총 금액</span>
                    <span className="text-3xl font-extrabold text-slate-900">{order.totalAmount.toLocaleString()}원</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-slate-900 text-base font-semibold text-white transition hover:bg-slate-800"
                >
                  결제 연동은 다음 단계에서 연결
                </button>
              </article>
            </section>
          </div>
        ) : null}
      </main>
    </div>
  );
};
