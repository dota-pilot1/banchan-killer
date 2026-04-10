import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ClipboardList, LayoutTemplate, MessageSquare, PackageSearch, Tags, Users, type LucideIcon } from 'lucide-react';
import { Header } from '@/widgets/header/ui/Header';
import { apiClient } from '@/shared/api/base';
import { useUserStore } from '@/entities/user/model/store';
import type { UserSummary } from '@/entities/user/model/types';

type AdminMenuItem = {
  title: string;
  description: string;
  active: boolean;
  icon: LucideIcon;
  href?: string;
};

const adminMenuItems: AdminMenuItem[] = [
  {
    title: '상품 관리',
    description: '상품 등록, 수정, 삭제',
    href: '/admin/products',
    active: false,
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
    href: '/admin/users',
    active: true,
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

const roleLabel: Record<UserSummary['role'], string> = {
  USER: '일반 회원',
  ADMIN: '관리자',
};

const formatJoinDate = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return '-';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const AdminUsersPage = () => {
  const { isAuthenticated, user } = useUserStore();
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      return;
    }

    const loadUsers = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.get<UserSummary[]>('/admin/users');
        setUsers(response.data);
      } catch (err: any) {
        setError(err.response?.data?.message || '회원 목록을 불러오지 못했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadUsers();
  }, [isAdmin, isAuthenticated]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto w-full max-w-[1600px] px-3 py-6 lg:px-4">
        <section className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="h-fit rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
            <div className="mb-6 px-2">
              <p className="text-sm font-semibold text-orange-600">Admin Console</p>
              <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">운영 관리</h1>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                회원 목록을 먼저 확인할 수 있게 구성했습니다. 권한 변경은 다음 단계에서 이어서 붙이면 됩니다.
              </p>
            </div>

            <nav className="space-y-2">
              {adminMenuItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <div
                    className={`rounded-2xl border px-4 py-4 transition-colors ${
                      item.active ? 'border-orange-200 bg-orange-50' : 'border-slate-100 bg-slate-50/80'
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
                      {!item.active && !item.href && (
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-slate-400">
                          구현 예정
                        </span>
                      )}
                    </div>
                  </div>
                );

                if (item.href) {
                  return (
                    <Link key={item.title} to={item.href} className="block">
                      {content}
                    </Link>
                  );
                }

                return <div key={item.title}>{content}</div>;
              })}
            </nav>
          </aside>

          <div className="space-y-5">
            <section className="rounded-3xl border border-slate-100 bg-white px-8 py-6 shadow-sm">
              <div className="flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-orange-600">현재 메뉴</p>
                  <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">회원 관리</h2>
                  <p className="max-w-3xl text-sm leading-6 text-slate-600">
                    현재 가입한 회원 목록과 권한 상태를 먼저 확인합니다. 이 화면에서 운영 대상과 관리자 계정을 구분할 수 있습니다.
                  </p>
                </div>
                <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-900">
                  홈으로 돌아가기
                </Link>
              </div>
            </section>

            <section className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-end justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">가입 회원 목록</h3>
                  <p className="mt-1 text-sm text-slate-500">현재 시스템에 등록된 회원과 관리자 계정을 확인할 수 있습니다.</p>
                </div>
                <div className="rounded-full bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                  총 {users.length}명
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(6)].map((_, index) => (
                    <div key={index} className="h-16 animate-pulse rounded-2xl bg-slate-100" />
                  ))}
                </div>
              ) : users.length === 0 ? (
                <div className="rounded-2xl bg-slate-50 px-6 py-10 text-center text-slate-500">
                  조회된 회원이 없습니다.
                </div>
              ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-100">
                  <div className="grid grid-cols-[96px_minmax(220px,1.4fr)_minmax(180px,1fr)_140px_140px_140px] gap-4 bg-slate-50 px-5 py-4 text-sm font-semibold text-slate-600">
                    <span>회원 ID</span>
                    <span>이메일</span>
                    <span>닉네임</span>
                    <span>권한</span>
                    <span>상태</span>
                    <span>가입일</span>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {users.map((member) => (
                      <div
                        key={member.id}
                        className="grid grid-cols-[96px_minmax(220px,1.4fr)_minmax(180px,1fr)_140px_140px_140px] items-center gap-4 px-5 py-4 text-sm text-slate-700"
                      >
                        <span className="font-semibold text-slate-900">{member.id}</span>
                        <span className="truncate font-medium text-slate-900">{member.email}</span>
                        <span className="truncate text-slate-500">{member.nickname || '-'}</span>
                        <span>
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                              member.role === 'ADMIN'
                                ? 'bg-orange-50 text-orange-600'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {roleLabel[member.role]}
                          </span>
                        </span>
                        <span className={member.enabled ? 'text-emerald-600' : 'text-slate-400'}>
                          {member.enabled ? '사용 가능' : '비활성'}
                        </span>
                        <span className="text-slate-500">{formatJoinDate(member.createdAt)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};
