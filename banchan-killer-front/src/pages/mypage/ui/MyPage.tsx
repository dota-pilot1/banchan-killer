import { useEffect, useState } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/entities/user/model/store';
import { useProfileStore } from '@/entities/user/model/profileStore';

type MyPageTab = 'profile' | 'address';

const tabItems: Array<{ id: MyPageTab; label: string; description: string }> = [
  { id: 'profile', label: '기본 정보', description: '닉네임, 연락처, 프로필 이미지를 관리합니다.' },
  { id: 'address', label: '배송지 관리', description: '주문서에 자동 반영할 기본 배송지를 관리합니다.' },
];

export const MyPage = () => {
  const { isAuthenticated, user, updateUser } = useUserStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = (searchParams.get('tab') as MyPageTab) || 'profile';

  const {
    profileImageUrl,
    nickname,
    email,
    phone,
    defaultAddress,
    hydrateFromAuth,
    updateProfile,
    updateDefaultAddress,
  } = useProfileStore();

  const [profileForm, setProfileForm] = useState({
    profileImageUrl,
    nickname,
    email,
    phone,
  });
  const [addressForm, setAddressForm] = useState(defaultAddress);
  const [profileSaved, setProfileSaved] = useState(false);
  const [addressSaved, setAddressSaved] = useState(false);

  useEffect(() => {
    if (user) {
      hydrateFromAuth({ email: user.email, nickname: user.nickname });
    }
  }, [hydrateFromAuth, user]);

  useEffect(() => {
    setProfileForm({
      profileImageUrl,
      nickname,
      email,
      phone,
    });
  }, [email, nickname, phone, profileImageUrl]);

  useEffect(() => {
    setAddressForm(defaultAddress);
  }, [defaultAddress]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const initials = (profileForm.nickname || user?.email || 'U').slice(0, 1).toUpperCase();

  const handleProfileSave = () => {
    updateProfile(profileForm);
    updateUser({ nickname: profileForm.nickname || user?.nickname });
    setProfileSaved(true);
    window.setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleAddressSave = () => {
    updateDefaultAddress(addressForm);
    setAddressSaved(true);
    window.setTimeout(() => setAddressSaved(false), 2200);
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
                개인 정보와 기본 배송지를 미리 관리해두면 주문서에서 다시 길게 입력하지 않아도 됩니다.
              </p>
            </div>
          </div>
        </section>

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
            {activeTab === 'profile' ? (
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
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-600">배송지 관리</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">기본 배송지</h2>
                  <p className="text-sm leading-6 text-slate-600">주문서에 자동으로 채워질 배송 정보를 관리합니다.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">수령인 이름</span>
                    <input
                      value={addressForm.recipientName}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientName: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                      placeholder="홍길동"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">수령인 연락처</span>
                    <input
                      value={addressForm.recipientPhone}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                      placeholder="010-0000-0000"
                    />
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm font-semibold text-slate-700">우편번호</span>
                    <input
                      value={addressForm.zipCode}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, zipCode: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                      placeholder="00000"
                    />
                  </label>
                  <div className="rounded-[1.5rem] bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
                    주문서에서는 이 기본 배송지를 먼저 보여주고, 필요하면 그 자리에서 바로 수정하게 하면 됩니다.
                  </div>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">기본 주소</span>
                    <input
                      value={addressForm.address1}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, address1: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                      placeholder="서울시 ..."
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">상세 주소</span>
                    <input
                      value={addressForm.address2}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, address2: e.target.value }))}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none transition focus:border-slate-400"
                      placeholder="상세 주소"
                    />
                  </label>
                  <label className="space-y-2 sm:col-span-2">
                    <span className="text-sm font-semibold text-slate-700">기본 배송 요청사항</span>
                    <textarea
                      value={addressForm.deliveryRequest}
                      onChange={(e) => setAddressForm((prev) => ({ ...prev, deliveryRequest: e.target.value }))}
                      className="min-h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-slate-400"
                      placeholder="문 앞에 놓아주세요"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3">
                  {addressSaved ? <span className="text-sm font-semibold text-emerald-600">기본 배송지를 저장했습니다.</span> : null}
                  <Button size="lg" onClick={handleAddressSave}>배송지 저장</Button>
                </div>
              </section>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
