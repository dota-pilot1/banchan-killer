import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/entities/cart/model/store';
import { PRODUCT_CATEGORY_LABELS } from '@/entities/product/model/types';
import { type DeliveryAddress, useProfileStore } from '@/entities/user/model/profileStore';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

const mapAddress = (value: Record<string, unknown>): DeliveryAddress => ({
  id: Number(value.id),
  recipientName: String(value.recipientName ?? ''),
  recipientPhone: String(value.recipientPhone ?? ''),
  zipCode: String(value.zipCode ?? ''),
  address1: String(value.address1 ?? ''),
  address2: String(value.address2 ?? ''),
  deliveryRequest: String(value.deliveryRequest ?? ''),
  isDefault: Boolean(value.isDefault),
});

const buildAddressLabel = (address: DeliveryAddress, index: number) => {
  if (address.isDefault) {
    return '기본 배송지';
  }

  return `배송지${index + 1}`;
};

export const OrderPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useUserStore();
  const items = useCartStore((state) => state.items);
  const selectedProductIds = useCartStore((state) => state.selectedProductIds);
  const clearSelection = useCartStore((state) => state.clearSelection);
  const storeDefaultAddress = useProfileStore((state) => state.defaultAddress);
  const setDefaultAddress = useProfileStore((state) => state.setDefaultAddress);
  const profilePhone = useProfileStore((state) => state.phone);
  const setProfile = useProfileStore((state) => state.setProfile);

  const selectedItems = useMemo(
    () => items.filter((item) => selectedProductIds.includes(item.productId)),
    [items, selectedProductIds]
  );
  const selectedTotalPrice = useMemo(
    () => selectedItems.reduce((total, item) => total + item.price * item.quantity, 0),
    [selectedItems]
  );

  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(storeDefaultAddress.id ?? null);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [form, setForm] = useState({
    ordererName: user?.nickname || '',
    ordererPhone: profilePhone || '',
    recipientName: '',
    recipientPhone: '',
    zipCode: '',
    address1: '',
    address2: '',
    deliveryRequest: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const selectedAddress = useMemo(
    () => savedAddresses.find((address) => address.id === selectedAddressId) ?? null,
    [savedAddresses, selectedAddressId]
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const loadAddresses = async () => {
      setIsLoadingAddresses(true);

      try {
        const [profileResponse, addressResponse] = await Promise.all([
          apiClient.get('/users/me'),
          apiClient.get('/users/me/addresses'),
        ]);

        setProfile(profileResponse.data);

        const addresses = (addressResponse.data as Array<Record<string, unknown>>).map(mapAddress);
        const defaultItem = addresses.find((address) => address.isDefault) ?? addresses[0] ?? null;

        setSavedAddresses(addresses);
        setSelectedAddressId(defaultItem?.id ?? null);

        if (defaultItem) {
          setDefaultAddress(defaultItem);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '배송지 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    void loadAddresses();
  }, [isAuthenticated, setDefaultAddress, setProfile]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      ordererName: prev.ordererName || user?.nickname || '',
      ordererPhone: prev.ordererPhone || profilePhone || '',
    }));
  }, [profilePhone, user?.nickname]);

  useEffect(() => {
    const addressSource = selectedAddress ?? storeDefaultAddress;

    setForm((prev) => ({
      ...prev,
      recipientName: addressSource.recipientName,
      recipientPhone: addressSource.recipientPhone,
      zipCode: addressSource.zipCode,
      address1: addressSource.address1,
      address2: addressSource.address2,
      deliveryRequest: addressSource.deliveryRequest,
    }));
  }, [selectedAddress, storeDefaultAddress]);

  const deliveryFee = useMemo(() => (selectedTotalPrice >= 40000 ? 0 : 3000), [selectedTotalPrice]);
  const finalAmount = selectedTotalPrice + deliveryFee;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (selectedItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const handleSubmitOrder = async () => {
    if (!form.ordererName.trim()) {
      setError('주문자 이름을 입력해 주세요.');
      return;
    }

    if (!form.ordererPhone.trim()) {
      setError('주문자 연락처를 입력해 주세요.');
      return;
    }

    if (!form.recipientName.trim()) {
      setError('수령인 이름을 입력해 주세요.');
      return;
    }

    if (!form.recipientPhone.trim()) {
      setError('수령인 연락처를 입력해 주세요.');
      return;
    }

    if (!form.address1.trim()) {
      setError('기본 주소를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await apiClient.post('/orders', {
        ordererName: form.ordererName,
        ordererPhone: form.ordererPhone,
        recipientName: form.recipientName,
        recipientPhone: form.recipientPhone,
        zipCode: form.zipCode,
        address1: form.address1,
        address2: form.address2,
        deliveryRequest: form.deliveryRequest,
        deliveryFee,
        discountAmount: 0,
        items: selectedItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      clearSelection();
      navigate(`/orders/${response.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.message || '주문 생성에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="space-y-2">
            <Link to="/cart" className="text-sm font-semibold text-orange-600">
              장바구니로
            </Link>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">주문서 작성</h1>
            <p className="text-sm leading-6 text-slate-600">
              저장된 배송지 중 하나를 선택하면 주문 정보가 바로 채워집니다. 기본 배송지는 먼저 선택된 상태로 보여줍니다.
            </p>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
        ) : null}

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">주문 상품</h2>
              <div className="mt-5 space-y-4">
                {selectedItems.map((item) => (
                  <div key={item.productId} className="flex gap-4 rounded-3xl bg-slate-50 p-4">
                    <img
                      src={item.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'}
                      alt={item.name}
                      className="h-24 w-24 rounded-2xl object-cover"
                    />
                    <div className="flex flex-1 items-center justify-between gap-4">
                      <div className="space-y-2">
                        <span className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                          {PRODUCT_CATEGORY_LABELS[item.category]}
                        </span>
                        <h3 className="text-lg font-bold text-slate-900">{item.name}</h3>
                        <p className="text-sm text-slate-500">수량 {item.quantity}개</p>
                      </div>
                      <span className="text-lg font-extrabold text-slate-900">
                        {(item.price * item.quantity).toLocaleString()}원
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">주문자 / 배송 정보</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    주문 전에 배송지를 고르고, 필요한 부분만 바로 수정해서 주문하면 됩니다.
                  </p>
                </div>
                <Link
                  to="/mypage?tab=address"
                  className="inline-flex h-11 items-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  배송지 관리로 이동
                </Link>
              </div>

              <div className="mt-5 rounded-[1.75rem] bg-slate-50 p-4">
                <div className="flex flex-wrap gap-3">
                  {isLoadingAddresses ? (
                    <div className="h-11 w-32 animate-pulse rounded-2xl bg-slate-200" />
                  ) : savedAddresses.length > 0 ? (
                    savedAddresses.map((address, index) => {
                      const isSelected = address.id === selectedAddressId;

                      return (
                        <button
                          key={address.id ?? `address-${index}`}
                          type="button"
                          onClick={() => setSelectedAddressId(address.id ?? null)}
                          className={`rounded-2xl border px-4 py-3 text-left transition ${
                            isSelected
                              ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          }`}
                        >
                          <p className="text-sm font-semibold">{buildAddressLabel(address, index)}</p>
                          <p className={`mt-1 text-xs ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                            {address.recipientName || '수령인 미입력'} · {address.address1 || '주소 미입력'}
                          </p>
                        </button>
                      );
                    })
                  ) : (
                    <div className="w-full rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-4 text-sm text-slate-500">
                      저장된 배송지가 없습니다. 마이페이지에서 기본 배송지를 먼저 추가하면 주문서가 더 빨라집니다.
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">주문자 이름</span>
                  <input
                    value={form.ordererName}
                    onChange={(e) => setForm((prev) => ({ ...prev, ordererName: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">주문자 연락처</span>
                  <input
                    value={form.ordererPhone}
                    onChange={(e) => setForm((prev) => ({ ...prev, ordererPhone: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">수령인 이름</span>
                  <input
                    value={form.recipientName}
                    onChange={(e) => setForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">수령인 연락처</span>
                  <input
                    value={form.recipientPhone}
                    onChange={(e) => setForm((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-sm font-semibold text-slate-700">우편번호</span>
                  <input
                    value={form.zipCode}
                    onChange={(e) => setForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                  선택한 배송지 내용을 기준으로 채웠습니다. 주문서에서 바로 덮어써도 됩니다.
                </div>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">기본 주소</span>
                  <input
                    value={form.address1}
                    onChange={(e) => setForm((prev) => ({ ...prev, address1: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">상세 주소</span>
                  <input
                    value={form.address2}
                    onChange={(e) => setForm((prev) => ({ ...prev, address2: e.target.value }))}
                    className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
                <label className="space-y-2 sm:col-span-2">
                  <span className="text-sm font-semibold text-slate-700">배송 요청사항</span>
                  <textarea
                    value={form.deliveryRequest}
                    onChange={(e) => setForm((prev) => ({ ...prev, deliveryRequest: e.target.value }))}
                    className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                  />
                </label>
              </div>
            </article>
          </div>

          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">최종 확인</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>선택 상품 금액</span>
                <span className="font-semibold text-slate-900">{selectedTotalPrice.toLocaleString()}원</span>
              </div>
              <div className="flex items-center justify-between">
                <span>배송비</span>
                <span className="font-semibold text-slate-900">{deliveryFee.toLocaleString()}원</span>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-700">총 결제 예상 금액</span>
                <span className="text-3xl font-extrabold text-slate-900">{finalAmount.toLocaleString()}원</span>
              </div>
            </div>

            <Button className="mt-6 h-12 w-full text-base font-semibold" onClick={handleSubmitOrder} disabled={isSubmitting}>
              {isSubmitting ? '주문 생성 중...' : '주문 생성 후 결제 단계로 이동'}
            </Button>
          </aside>
        </section>
      </main>
    </div>
  );
};
