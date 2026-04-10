import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { emptyDeliveryAddress, type DeliveryAddress, useProfileStore } from '@/entities/user/model/profileStore';
import { useUserStore } from '@/entities/user/model/store';
import { apiClient } from '@/shared/api/base';

type MyPageTab = 'profile' | 'address';

const tabItems: Array<{ id: MyPageTab; label: string; description: string }> = [
  { id: 'profile', label: '기본 정보', description: '닉네임, 연락처, 프로필 이미지를 관리합니다.' },
  { id: 'address', label: '배송지 관리', description: '여러 배송지를 저장하고 기본 배송지를 지정합니다.' },
];

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

export const MyPage = () => {
  const { isAuthenticated, user, updateUser } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as MyPageTab) || 'profile';

  const {
    profileImageUrl,
    nickname,
    email,
    phone,
    setProfile,
    setDefaultAddress,
    hydrateFromAuth,
  } = useProfileStore();

  const [profileForm, setProfileForm] = useState({
    profileImageUrl,
    nickname,
    email,
    phone,
  });
  const [savedAddresses, setSavedAddresses] = useState<DeliveryAddress[]>([]);
  const [addressForm, setAddressForm] = useState<DeliveryAddress>({ ...emptyDeliveryAddress, isDefault: false });
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddressSaving, setIsAddressSaving] = useState(false);
  const [error, setError] = useState('');

  const selectedAddress = useMemo(
    () => savedAddresses.find((address) => address.id === selectedAddressId) ?? null,
    [savedAddresses, selectedAddressId]
  );

  useEffect(() => {
    if (user) {
      hydrateFromAuth({ email: user.email, nickname: user.nickname });
    }
  }, [hydrateFromAuth, user]);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    const loadMyPageData = async () => {
      setIsLoading(true);
      setError('');

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
        setAddressForm(defaultItem ? { ...defaultItem } : { ...emptyDeliveryAddress, isDefault: true });

        if (defaultItem) {
          setDefaultAddress(defaultItem);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '프로필 정보를 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadMyPageData();
  }, [isAuthenticated, setDefaultAddress, setProfile]);

  useEffect(() => {
    setProfileForm({
      profileImageUrl,
      nickname,
      email,
      phone,
    });
  }, [email, nickname, phone, profileImageUrl]);

  useEffect(() => {
    if (!selectedAddress) {
      return;
    }

    setAddressForm({ ...selectedAddress });
  }, [selectedAddress]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const initials = (profileForm.nickname || user?.email || 'U').slice(0, 1).toUpperCase();

  const handleProfileSave = () => {
    void (async () => {
      try {
        const response = await apiClient.patch('/users/me', {
          nickname: profileForm.nickname,
          phone: profileForm.phone,
          profileImageUrl: profileForm.profileImageUrl,
        });
        setProfile(response.data);
        updateUser({ nickname: response.data.nickname || user?.nickname });
        setProfileSaved(true);
        window.setTimeout(() => setProfileSaved(false), 2200);
      } catch (err: any) {
        setError(err.response?.data?.message || '기본 정보 저장에 실패했습니다.');
      }
    })();
  };

  const handleCreateNewAddress = () => {
    setSelectedAddressId(null);
    setAddressForm({
      ...emptyDeliveryAddress,
      isDefault: savedAddresses.length === 0,
    });
  };

  const handleAddressSave = () => {
    void (async () => {
      setIsAddressSaving(true);
      setError('');

      try {
        const payload = {
          recipientName: addressForm.recipientName,
          recipientPhone: addressForm.recipientPhone,
          zipCode: addressForm.zipCode,
          address1: addressForm.address1,
          address2: addressForm.address2,
          deliveryRequest: addressForm.deliveryRequest,
          isDefault: Boolean(addressForm.isDefault),
        };

        const response = addressForm.id
          ? await apiClient.patch(`/users/me/addresses/${addressForm.id}`, payload)
          : await apiClient.post('/users/me/addresses', payload);

        const savedAddress = mapAddress(response.data as Record<string, unknown>);
        const nextAddresses = addressForm.id
          ? savedAddresses.map((address) =>
              address.id === savedAddress.id
                ? savedAddress
                : addressForm.isDefault
                  ? { ...address, isDefault: false }
                  : address
            )
          : [
              ...savedAddresses.map((address) =>
                savedAddress.isDefault ? { ...address, isDefault: false } : address
              ),
              savedAddress,
            ];

        setSavedAddresses(nextAddresses);
        setSelectedAddressId(savedAddress.id ?? null);
        setAddressForm(savedAddress);

        if (savedAddress.isDefault) {
          setDefaultAddress(savedAddress);
        }

        setAddressSaved(true);
        window.setTimeout(() => setAddressSaved(false), 2200);
      } catch (err: any) {
        setError(err.response?.data?.message || '배송지 저장에 실패했습니다.');
      } finally {
        setIsAddressSaving(false);
      }
    })();
  };

  const handleSetDefaultAddress = (address: DeliveryAddress) => {
    if (!address.id) {
      return;
    }

    void (async () => {
      try {
        const response = await apiClient.patch(`/users/me/addresses/${address.id}/default`);
        const nextDefault = mapAddress(response.data as Record<string, unknown>);
        const nextAddresses = savedAddresses.map((item) => ({
          ...item,
          isDefault: item.id === nextDefault.id,
        }));

        setSavedAddresses(nextAddresses);
        setSelectedAddressId(nextDefault.id ?? null);
        setAddressForm(nextDefault);
        setDefaultAddress(nextDefault);
      } catch (err: any) {
        setError(err.response?.data?.message || '기본 배송지 지정에 실패했습니다.');
      }
    })();
  };

  const handleDeleteAddress = (address: DeliveryAddress) => {
    if (!address.id) {
      return;
    }

    void (async () => {
      try {
        await apiClient.delete(`/users/me/addresses/${address.id}`);

        const remainingAddresses = savedAddresses.filter((item) => item.id !== address.id);
        const nextDefault = remainingAddresses.find((item) => item.isDefault) ?? remainingAddresses[0] ?? null;

        setSavedAddresses(remainingAddresses);
        setSelectedAddressId(nextDefault?.id ?? null);
        setAddressForm(nextDefault ? { ...nextDefault } : { ...emptyDeliveryAddress, isDefault: remainingAddresses.length === 0 });

        if (nextDefault) {
          setDefaultAddress(nextDefault);
        } else {
          setDefaultAddress(emptyDeliveryAddress);
        }
      } catch (err: any) {
        setError(err.response?.data?.message || '배송지 삭제에 실패했습니다.');
      }
    })();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <section className="mb-8 rounded-[2rem] border border-slate-200 bg-white px-8 py-8 shadow-sm">
          <div className="flex items-start justify-between gap-6">
            <div className="space-y-2">
              <Link to="/" className="text-sm font-semibold text-orange-600">
                홈으로
              </Link>
              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">마이페이지</h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600">
                개인 정보와 배송지를 미리 관리해두면 주문서 입력이 훨씬 짧아집니다.
              </p>
            </div>
          </div>
        </section>

        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">{error}</div>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="h-fit rounded-[2rem] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-5 rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex items-center gap-4">
                {profileForm.profileImageUrl ? (
                  <img
                    src={profileForm.profileImageUrl}
                    alt="프로필 이미지"
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-2xl font-extrabold text-white">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="text-lg font-bold text-slate-900">{profileForm.nickname || user?.email}</p>
                  <p className="text-sm text-slate-500">{profileForm.email}</p>
                </div>
              </div>
            </div>

            <nav className="space-y-2">
              {tabItems.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSearchParams({ tab: tab.id })}
                  className={`w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-slate-100 bg-slate-50/80 hover:bg-slate-100'
                  }`}
                >
                  <p className={`font-semibold ${activeTab === tab.id ? 'text-slate-900' : 'text-slate-700'}`}>{tab.label}</p>
                  <p className="mt-1 text-sm leading-5 text-slate-500">{tab.description}</p>
                </button>
              ))}
            </nav>
          </aside>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
                <div className="h-28 animate-pulse rounded-3xl bg-slate-100" />
              </div>
            ) : activeTab === 'profile' ? (
              <section className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-600">기본 정보</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">내 프로필</h2>
                  <p className="text-sm leading-6 text-slate-600">주문과 배송에 필요한 기본 정보를 미리 정리해두세요.</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-700">프로필 미리보기</p>
                    <div className="mt-4 flex flex-col items-center text-center">
                      {profileForm.profileImageUrl ? (
                        <img
                          src={profileForm.profileImageUrl}
                          alt="프로필 미리보기"
                          className="h-28 w-28 rounded-3xl object-cover"
                        />
                      ) : (
                        <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-slate-900 text-4xl font-extrabold text-white">
                          {initials}
                        </div>
                      )}
                      <p className="mt-4 text-lg font-bold text-slate-900">{profileForm.nickname || '닉네임을 입력하세요'}</p>
                      <p className="mt-1 text-sm text-slate-500">{profileForm.email}</p>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">프로필 이미지 URL</span>
                      <input
                        value={profileForm.profileImageUrl}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, profileImageUrl: e.target.value }))}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                        placeholder="https://..."
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-slate-700">닉네임</span>
                      <input
                        value={profileForm.nickname}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, nickname: e.target.value }))}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                        placeholder="자주 쓰는 이름"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-sm font-semibold text-slate-700">연락처</span>
                      <input
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, phone: e.target.value }))}
                        className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                        placeholder="010-0000-0000"
                      />
                    </label>
                    <label className="space-y-2 sm:col-span-2">
                      <span className="text-sm font-semibold text-slate-700">이메일</span>
                      <input
                        value={profileForm.email}
                        onChange={(e) => setProfileForm((prev) => ({ ...prev, email: e.target.value }))}
                        className="h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-500 outline-none"
                        readOnly
                      />
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  {profileSaved ? <span className="text-sm font-semibold text-emerald-600">기본 정보를 저장했습니다.</span> : null}
                  <Button size="lg" onClick={handleProfileSave}>기본 정보 저장</Button>
                </div>
              </section>
            ) : (
              <section className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-orange-600">배송지 관리</p>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">내 배송지</h2>
                    <p className="text-sm leading-6 text-slate-600">
                      여러 배송지를 저장하고, 주문서에서 먼저 보일 기본 배송지를 직접 선택할 수 있습니다.
                    </p>
                  </div>
                  <Button variant="outline" size="lg" onClick={handleCreateNewAddress}>새 배송지 추가</Button>
                </div>

                <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                  <div className="space-y-3">
                    {savedAddresses.length > 0 ? (
                      savedAddresses.map((address, index) => {
                        const isSelected = address.id === selectedAddressId;

                        return (
                          <div
                            key={address.id ?? `address-${index}`}
                            className={`rounded-[1.75rem] border p-4 transition ${
                              isSelected ? 'border-slate-900 bg-slate-900 text-white shadow-sm' : 'border-slate-200 bg-slate-50'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setSelectedAddressId(address.id ?? null)}
                              className="w-full text-left"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div>
                                  <p className="text-base font-bold">{buildAddressLabel(address, index)}</p>
                                  <p className={`mt-1 text-sm ${isSelected ? 'text-slate-200' : 'text-slate-500'}`}>
                                    {address.recipientName} · {address.recipientPhone}
                                  </p>
                                </div>
                                {address.isDefault ? (
                                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isSelected ? 'bg-white/15 text-white' : 'bg-orange-100 text-orange-700'}`}>
                                    기본
                                  </span>
                                ) : null}
                              </div>
                              <p className={`mt-3 text-sm leading-6 ${isSelected ? 'text-slate-200' : 'text-slate-600'}`}>
                                {address.zipCode} {address.address1} {address.address2}
                              </p>
                              {address.deliveryRequest ? (
                                <p className={`mt-2 text-xs ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                                  요청사항: {address.deliveryRequest}
                                </p>
                              ) : null}
                            </button>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {!address.isDefault ? (
                                <button
                                  type="button"
                                  onClick={() => handleSetDefaultAddress(address)}
                                  className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                                    isSelected ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                                  }`}
                                >
                                  기본 배송지로 지정
                                </button>
                              ) : null}
                              <button
                                type="button"
                                onClick={() => setSelectedAddressId(address.id ?? null)}
                                className={`rounded-xl border px-3 py-2 text-sm font-semibold ${
                                  isSelected
                                    ? 'border-white/20 text-white'
                                    : 'border-slate-200 bg-white text-slate-700'
                                }`}
                              >
                                수정
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteAddress(address)}
                                className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                                  isSelected ? 'bg-red-500/20 text-red-100' : 'bg-red-50 text-red-600'
                                }`}
                              >
                                삭제
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="rounded-[1.75rem] border border-dashed border-slate-200 bg-slate-50 px-5 py-6 text-sm leading-6 text-slate-500">
                        아직 저장된 배송지가 없습니다. 첫 배송지를 등록하면 주문서에서 자동으로 불러옵니다.
                      </div>
                    )}
                  </div>

                  <div className="rounded-[1.75rem] bg-slate-50 p-5">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-orange-600">{addressForm.id ? '배송지 수정' : '새 배송지 추가'}</p>
                        <h3 className="mt-1 text-2xl font-bold text-slate-900">
                          {addressForm.id ? '선택한 배송지 편집' : '새 배송지 입력'}
                        </h3>
                      </div>
                      <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700">
                        <input
                          type="checkbox"
                          checked={Boolean(addressForm.isDefault)}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, isDefault: e.target.checked }))}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        기본 배송지로 사용
                      </label>
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">수령인 이름</span>
                        <input
                          value={addressForm.recipientName}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                          placeholder="홍길동"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">수령인 연락처</span>
                        <input
                          value={addressForm.recipientPhone}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                          placeholder="010-0000-0000"
                        />
                      </label>
                      <label className="space-y-2">
                        <span className="text-sm font-semibold text-slate-700">우편번호</span>
                        <input
                          value={addressForm.zipCode}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                          placeholder="00000"
                        />
                      </label>
                      <div className="rounded-[1.5rem] bg-white px-4 py-3 text-sm leading-6 text-slate-600">
                        주문서에서는 이 목록을 그대로 불러오고, 기본 배송지를 먼저 선택해 보여줍니다.
                      </div>
                      <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-slate-700">기본 주소</span>
                        <input
                          value={addressForm.address1}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, address1: e.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                          placeholder="서울시 ..."
                        />
                      </label>
                      <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-slate-700">상세 주소</span>
                        <input
                          value={addressForm.address2}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, address2: e.target.value }))}
                          className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm outline-none transition focus:border-slate-400"
                          placeholder="상세 주소"
                        />
                      </label>
                      <label className="space-y-2 sm:col-span-2">
                        <span className="text-sm font-semibold text-slate-700">기본 배송 요청사항</span>
                        <textarea
                          value={addressForm.deliveryRequest}
                          onChange={(e) => setAddressForm((prev) => ({ ...prev, deliveryRequest: e.target.value }))}
                          className="min-h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                          placeholder="문 앞에 놓아주세요"
                        />
                      </label>
                    </div>

                    <div className="mt-6 flex items-center justify-end gap-3">
                      {addressSaved ? <span className="text-sm font-semibold text-emerald-600">배송지를 저장했습니다.</span> : null}
                      <Button variant="outline" size="lg" onClick={handleCreateNewAddress}>새로 입력</Button>
                      <Button size="lg" onClick={handleAddressSave} disabled={isAddressSaving}>
                        {isAddressSaving ? '저장 중...' : '배송지 저장'}
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
