import { Link } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/entities/cart/model/store';
import { PRODUCT_CATEGORY_LABELS } from '@/entities/product/model/types';

export const CartPage = () => {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="mb-8 space-y-2">
          <Link to="/" className="text-sm font-semibold text-orange-600">
            홈으로
          </Link>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">장바구니</h1>
          <p className="text-slate-600">오늘 먹을 반찬을 먼저 담아두고 한 번에 주문해보세요.</p>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">장바구니가 비어 있습니다</h2>
            <p className="mt-3 text-slate-500">야채 반찬, 고기 반찬, 김치류를 둘러보고 담아보세요.</p>
            <Link to="/category/vegetable" className="mt-6 inline-flex">
              <Button size="lg">상품 보러가기</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr]">
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.productId}
                  className="flex flex-col gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row"
                >
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                    alt={item.name}
                    className="h-36 w-full rounded-2xl object-cover sm:w-40"
                  />

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                        {PRODUCT_CATEGORY_LABELS[item.category]}
                      </span>
                      <h2 className="text-xl font-bold text-slate-900">{item.name}</h2>
                      <p className="line-clamp-2 text-sm text-slate-500">{item.description}</p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        >
                          -
                        </Button>
                        <span className="min-w-8 text-center text-sm font-semibold text-slate-800">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="icon-sm"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        >
                          +
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-lg font-extrabold text-slate-900">
                          {(item.price * item.quantity).toLocaleString()}원
                        </span>
                        <Button
                          variant="ghost"
                          className="text-slate-500 hover:text-red-600"
                          onClick={() => removeItem(item.productId)}
                        >
                          삭제
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">주문 예상 금액</h2>
              <div className="mt-6 space-y-4 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>상품 금액</span>
                  <span className="font-semibold text-slate-900">{totalPrice.toLocaleString()}원</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>배송비</span>
                  <span className="font-semibold text-slate-900">추후 계산</span>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-slate-700">합계</span>
                  <span className="text-2xl font-extrabold text-slate-900">{totalPrice.toLocaleString()}원</span>
                </div>
              </div>

              <Button className="mt-6 h-12 w-full text-base font-semibold" disabled>
                주문 기능은 다음 단계에서 연결
              </Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
};
