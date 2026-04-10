import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClipboardList, LayoutTemplate, MessageSquare, PackageSearch, Tags, Users } from 'lucide-react';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/shared/api/base';
import { useUserStore } from '@/entities/user/model/store';
import type { Product, ProductCategory } from '@/entities/product/model/types';

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  stockQuantity: string;
  category: ProductCategory;
  imageUrl: string;
};

const initialFormState: ProductFormState = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  category: 'SIDE_DISH',
  imageUrl: '',
};

const categoryOptions: Array<{ value: ProductCategory; label: string }> = [
  { value: 'SIDE_DISH', label: '야채 반찬' },
  { value: 'MAIN_COURSE', label: '고기 반찬' },
  { value: 'KIMCHI', label: '김치류' },
];

const adminMenuItems = [
  {
    title: '상품 관리',
    description: '상품 등록, 수정, 삭제',
    active: true,
    icon: PackageSearch,
  },
  {
    title: '주문 관리',
    description: '주문 상태와 배송 확인',
    active: false,
    icon: ClipboardList,
  },
  {
    title: '회원 관리',
    description: '회원 목록과 상태 관리',
    active: false,
    icon: Users,
  },
  {
    title: '카테고리 관리',
    description: '메뉴 분류와 노출 구조',
    active: false,
    icon: Tags,
  },
  {
    title: '배너 관리',
    description: '홈 배너와 프로모션 관리',
    active: false,
    icon: LayoutTemplate,
  },
  {
    title: '리뷰 관리',
    description: '리뷰 확인과 노출 관리',
    active: false,
    icon: MessageSquare,
  },
] as const;

export const AdminProductsPage = () => {
  const { isAuthenticated } = useUserStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>(initialFormState);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadProducts = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.get('/products', { params: { size: 100 } });
      setProducts(response.data.content ?? []);
    } catch (err: any) {
      setError(err.response?.data?.message || '상품 목록을 불러오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    void loadProducts();
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const resetForm = () => {
    setForm(initialFormState);
    setEditingId(null);
  };

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stockQuantity: String(product.stockQuantity),
      category: product.category,
      imageUrl: product.imageUrl ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('이 상품을 삭제할까요?');
    if (!confirmed) {
      return;
    }

    try {
      await apiClient.delete(`/products/${id}`);
      if (editingId === id) {
        resetForm();
      }
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || '상품 삭제에 실패했습니다.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const payload = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      stockQuantity: Number(form.stockQuantity),
      category: form.category,
      imageUrl: form.imageUrl,
    };

    try {
      if (editingId) {
        await apiClient.put(`/products/${editingId}`, payload);
      } else {
        await apiClient.post('/products', payload);
      }

      resetForm();
      await loadProducts();
    } catch (err: any) {
      setError(err.response?.data?.message || '상품 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="rounded-3xl bg-white p-5 shadow-sm border border-slate-100 h-fit">
            <div className="mb-6 px-2">
              <p className="text-sm font-semibold text-orange-600">Admin Console</p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">운영 관리</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                쇼핑몰 운영 메뉴를 한곳에서 관리합니다. 지금은 상품 관리만 먼저 사용할 수 있습니다.
              </p>
            </div>

            <nav className="space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className={`rounded-2xl border px-4 py-4 transition-colors ${
                      item.active
                        ? 'border-orange-200 bg-orange-50'
                        : 'border-slate-100 bg-slate-50/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div
                          className={`mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl ${
                            item.active ? 'bg-white text-orange-600' : 'bg-white text-slate-400'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className={`font-semibold ${item.active ? 'text-slate-900' : 'text-slate-700'}`}>{item.title}</p>
                          <p className="mt-1 text-sm text-slate-500">{item.description}</p>
                        </div>
                      </div>
                      {!item.active && (
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-400">
                          구현 예정
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          </aside>

          <div className="space-y-8">
            <section className="rounded-3xl bg-white p-8 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-600">현재 메뉴</p>
                  <h2 className="text-4xl font-extrabold tracking-tight text-slate-900">상품 관리</h2>
                  <p className="text-slate-600">
                    반찬 상품을 등록하고, 가격과 재고를 수정하고, 불필요한 상품을 정리할 수 있습니다.
                  </p>
                </div>
                <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                  홈으로 돌아가기
                </Link>
              </div>
            </section>

            <section className="grid gap-8 xl:grid-cols-[420px_minmax(0,1fr)]">
              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">{editingId ? '상품 수정' : '새 상품 등록'}</h3>
                    <p className="mt-1 text-sm text-slate-500">기본 정보만 입력해도 바로 목록에 반영됩니다.</p>
                  </div>
                  {editingId && (
                    <button type="button" onClick={resetForm} className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                      새로 입력
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">상품명</span>
                    <input
                      value={form.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="예: 꽈리고추 볶음"
                    />
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">설명</span>
                    <textarea
                      value={form.description}
                      onChange={(e) => handleChange('description', e.target.value)}
                      required
                      rows={4}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="상품 설명을 입력하세요"
                    />
                  </label>

                  <div className="grid grid-cols-2 gap-4">
                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">가격</span>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="text-sm font-medium text-slate-700">재고</span>
                      <input
                        type="number"
                        min="0"
                        value={form.stockQuantity}
                        onChange={(e) => handleChange('stockQuantity', e.target.value)}
                        required
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </label>
                  </div>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">카테고리</span>
                    <select
                      value={form.category}
                      onChange={(e) => handleChange('category', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      {categoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="block space-y-2">
                    <span className="text-sm font-medium text-slate-700">이미지 URL</span>
                    <input
                      value={form.imageUrl}
                      onChange={(e) => handleChange('imageUrl', e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="https://..."
                    />
                  </label>

                  {error && (
                    <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                      {error}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 text-base font-bold" disabled={isSubmitting}>
                    {isSubmitting ? '저장 중...' : editingId ? '상품 수정하기' : '상품 등록하기'}
                  </Button>
                </form>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">등록된 상품</h3>
                  <p className="mt-1 text-sm text-slate-500">현재 등록된 반찬 상품을 확인하고 수정할 수 있습니다.</p>
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center text-slate-500">
                    아직 등록된 상품이 없습니다.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-start justify-between gap-4 rounded-2xl border border-slate-100 p-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                              {categoryOptions.find((option) => option.value === product.category)?.label ?? product.category}
                            </span>
                            <span className="text-xs text-slate-400">재고 {product.stockQuantity}개</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900">{product.name}</h3>
                          <p className="text-sm text-slate-500 line-clamp-2">{product.description}</p>
                          <p className="text-sm font-semibold text-slate-700">{product.price.toLocaleString()}원</p>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(product)}
                            className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(product.id)}
                            className="rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};
