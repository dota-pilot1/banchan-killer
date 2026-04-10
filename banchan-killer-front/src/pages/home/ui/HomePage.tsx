import { Link } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Clock, Truck } from 'lucide-react';
import { useProducts } from '@/entities/product/api/useProducts';
import { ProductCard } from '@/entities/product/ui/ProductCard';

export const HomePage = () => {
  const { data, isLoading, isError } = useProducts({ size: 8 });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-white py-20 lg:py-32">
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-left duration-1000">
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
                매일 먹기 좋은 <br />
                <span className="text-primary italic">기본 반찬</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-lg">
                부담 없이 사고, 자주 꺼내 먹는 반찬만 담았습니다.
                야채 반찬, 고기 반찬, 김치류까지 매일 손이 가는 메뉴를 만나보세요.
              </p>
              <div className="flex items-center gap-4">
                <Link to="/category/vegetable">
                  <Button size="lg" className="rounded-full px-8 h-14 text-lg">
                    지금 쇼핑하기 <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute top-0 right-0 -mr-20 hidden lg:block">
            <div className="h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          </div>
        </section>

        <section className="py-16 bg-white border-y">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">매일 먹기 좋은 구성</h3>
                  <p className="text-slate-600 text-sm mt-1">식탁에 자주 오르는 기본 반찬 위주로 골라 담기 쉽게 구성했습니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">바로 꺼내 먹는 반찬</h3>
                  <p className="text-slate-600 text-sm mt-1">복잡한 준비 없이 오늘 밥상에 바로 올릴 수 있는 메뉴 위주입니다.</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 transition-all hover:shadow-lg">
                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Truck className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900">부담 없는 가격</h3>
                  <p className="text-slate-600 text-sm mt-1">비싸게 아껴 먹는 반찬보다 자주 주문해도 부담 없는 가격에 맞췄습니다.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-16">
              <div className="space-y-2">
                <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">
                  지금 많이 찾는 매일 반찬
                </h2>
                <p className="text-slate-500 text-lg font-medium">꽈리고추 볶음, 메추리알 볶음, 파김치처럼 자주 꺼내 먹는 기본 반찬을 모았습니다.</p>
              </div>
              <Link to="/category/vegetable" className="text-indigo-600 font-bold text-lg group inline-flex items-center">
                카테고리 보러가기 <ArrowRight className="ml-1 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[4/3] rounded-2xl bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-8 w-1/3 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="py-20 text-center">
                <p className="text-slate-500 text-lg italic">상품 정보를 불러오는 중 문제가 발생했습니다. (API 서버가 켜져 있나요?)</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data?.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2026 Banchan Killer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
