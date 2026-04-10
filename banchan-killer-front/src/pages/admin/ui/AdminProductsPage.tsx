import { useEffect, useRef, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Camera, ClipboardList, LayoutTemplate, LoaderCircle, MessageSquare, PackageSearch, Tags, Upload, Users } from 'lucide-react';
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
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
    setIsFormOpen(false);
  };

  const handleChange = (field: keyof ProductFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    setIsUploadingImage(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiClient.post('/uploads/images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      handleChange('imageUrl', response.data.imageUrl);
    } catch (err: any) {
      setError(err.response?.data?.message || '이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleCreate = () => {
    setForm(initialFormState);
    setEditingId(null);
    setError('');
    setIsFormOpen(true);
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
    setError('');
    setIsFormOpen(true);
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

      await loadProducts();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || '상품 저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-[1840px] px-3 py-6 lg:px-4">
        <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)_440px]">
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

          <div className="space-y-5">
            <section className="rounded-3xl bg-white px-8 py-6 shadow-sm border border-slate-100">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-600">현재 메뉴</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">상품 관리</h2>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    반찬 상품을 등록하고, 가격과 재고를 수정하고, 불필요한 상품을 정리할 수 있습니다.
                  </p>
                </div>
                <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                  홈으로 돌아가기
                </Link>
              </div>
            </section>

            <section className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">등록된 상품</h3>
                  <p className="mt-1 text-sm text-slate-500">현재 등록된 반찬 상품을 확인하고 수정할 수 있습니다.</p>
                </div>
                <Button type="button" className="h-11 px-5 text-sm font-semibold" onClick={handleCreate}>
                  새 상품 등록
                </Button>
              </div>

              <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
                카드의 `수정` 버튼을 누르면 오른쪽 편집 패널에서 바로 수정할 수 있습니다.
              </div>

              <div className="mt-5">
                <div className="mb-6">
                </div>

                {isLoading ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="h-44 animate-pulse rounded-3xl bg-slate-100" />
                    ))}
                  </div>
                ) : products.length === 0 ? (
                  <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center text-slate-500">
                    아직 등록된 상품이 없습니다.
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className={`rounded-3xl border p-5 transition-all ${
                          editingId === product.id
                            ? 'border-orange-200 bg-orange-50/60 shadow-sm'
                            : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                                {categoryOptions.find((option) => option.value === product.category)?.label ?? product.category}
                              </span>
                              <span className="text-xs font-medium text-slate-400">재고 {product.stockQuantity}개</span>
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-slate-900">{product.name}</h3>
                              <p className="mt-2 text-sm leading-6 text-slate-500 line-clamp-3">{product.description}</p>
                            </div>
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

                        <div className="mt-5 flex items-end justify-between gap-4 border-t border-slate-100 pt-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-slate-400">판매가</p>
                            <p className="text-2xl font-extrabold text-slate-900">{product.price.toLocaleString()}원</p>
                          </div>
                          {editingId === product.id && (
                            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
                              현재 수정 중
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
          <aside className="rounded-3xl bg-white border border-slate-100 shadow-sm overflow-hidden h-fit xl:sticky xl:top-24">
            <div className="border-b border-slate-100 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-orange-600">{editingId ? '현재 선택 상품' : '새 상품'}</p>
                  <h3 className="mt-1 text-2xl font-bold text-slate-900">{editingId ? '상품 수정' : '새 상품 등록'}</h3>
                  <p className="mt-2 text-sm text-slate-500">오른쪽 패널에서 상품 정보를 수정하고 저장할 수 있습니다.</p>
                </div>
                {isFormOpen && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    닫기
                  </button>
                )}
              </div>
            </div>

            {isFormOpen ? (
              <>
                <div className="px-6 py-5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageUpload}
                  />

                  <div className="relative overflow-hidden rounded-3xl border border-slate-100 bg-slate-50">
                    {form.imageUrl ? (
                      <img
                        src={form.imageUrl}
                        alt={form.name || '상품 이미지 미리보기'}
                        className="h-56 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-56 items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
                        이미지 미리보기
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={openFilePicker}
                      disabled={isUploadingImage}
                      className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow-sm transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-70"
                      aria-label="이미지 업로드"
                    >
                      {isUploadingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                    </button>

                    <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-slate-900/70 to-transparent px-4 pb-4 pt-10">
                      <div className="text-sm font-medium text-white">
                        {isUploadingImage ? '이미지 업로드 중...' : '대표 이미지를 바로 변경할 수 있습니다'}
                      </div>
                      <button
                        type="button"
                        onClick={openFilePicker}
                        disabled={isUploadingImage}
                        className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isUploadingImage ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                        이미지 변경
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-6 pb-6">
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
                      <span className="text-sm font-medium text-slate-700">이미지 URL 직접 입력</span>
                      <input
                        value={form.imageUrl}
                        onChange={(e) => handleChange('imageUrl', e.target.value)}
                        className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-primary/20"
                        placeholder="https://..."
                      />
                      <p className="text-xs text-slate-400">
                        기본적으로는 이미지 영역의 업로드 버튼을 사용하고, URL 입력은 예외적인 경우에만 사용하세요.
                      </p>
                    </label>

                    {error && (
                      <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                        {error}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-2">
                      <Button type="submit" className="h-12 flex-1 text-base font-bold" disabled={isSubmitting}>
                        {isSubmitting ? '저장 중...' : editingId ? '상품 수정하기' : '상품 등록하기'}
                      </Button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900"
                      >
                        취소
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="px-6 py-10">
                <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-10 text-center">
                  <h4 className="text-xl font-bold text-slate-900">편집할 상품을 선택하세요</h4>
                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    상품 카드의 `수정` 버튼을 누르거나, `새 상품 등록`을 눌러 오른쪽 패널에서 작업을 시작할 수 있습니다.
                  </p>
                  <Button type="button" className="mt-5 h-11 px-5 text-sm font-semibold" onClick={handleCreate}>
                    새 상품 등록
                  </Button>
                </div>
              </div>
            )}
          </aside>
        </section>
      </main>
    </div>
  );
};
