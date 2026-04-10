import { Link, Navigate, useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Header } from '@/widgets/header/ui/Header';
import { useProducts } from '@/entities/product/api/useProducts';
import { ProductCard } from '@/entities/product/ui/ProductCard';
import { CATEGORY_PAGE_CONFIG, type CategoryPageSlug } from '@/entities/product/model/types';

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: CategoryPageSlug }>();

  if (!slug || !(slug in CATEGORY_PAGE_CONFIG)) {
    return <Navigate to="/" replace />;
  }

  const config = CATEGORY_PAGE_CONFIG[slug];
  const primaryCategory = config.categories[0];
  const { data, isLoading, isError } = useProducts({ size: 20, category: primaryCategory });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      <main className="flex-1">
        <section className="border-b bg-white/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-3">
              <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
                <Link to="/" className="hover:text-orange-500 transition-colors">홈</Link>
                <ArrowRight className="h-3 w-3" />
                <span className="text-slate-900">{config.label}</span>
              </nav>
              
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                    {config.label}
                  </h1>
                  <p className="text-slate-500 max-w-2xl">
                    {config.description}
                  </p>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  실속 있는 자취생 식탁을 위한 추천 메뉴
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="aspect-[4/3] rounded-2xl bg-slate-200" />
                    <div className="h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                    <div className="h-8 w-1/3 rounded bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : isError ? (
              <div className="rounded-3xl bg-white px-6 py-16 text-center text-slate-500 shadow-sm">
                상품 정보를 불러오는 중 문제가 발생했습니다. API 서버 상태를 확인해주세요.
              </div>
            ) : data?.content.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.content.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
                <h2 className="text-2xl font-bold text-slate-900">아직 등록된 상품이 없습니다</h2>
                <p className="mt-3 text-slate-500">곧 {config.label} 상품을 추가할 예정입니다.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
