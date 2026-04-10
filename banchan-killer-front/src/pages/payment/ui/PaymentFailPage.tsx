import { Link, Navigate, useSearchParams } from 'react-router-dom';
import { Header } from '@/widgets/header/ui/Header';
import { useUserStore } from '@/entities/user/model/store';

export const PaymentFailPage = () => {
  const { isAuthenticated } = useUserStore();
  const [searchParams] = useSearchParams();

  const code = searchParams.get('code') || '';
  const message = searchParams.get('message') || '결제에 실패했습니다.';

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-slate-50">
      <Header />
      <main className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="text-6xl">😥</div>
        <h1 className="mt-6 text-2xl font-bold text-slate-900">결제에 실패했습니다</h1>
        <p className="mt-2 text-slate-500">{message}</p>
        {code && (
          <p className="mt-1 text-xs text-slate-400">에러코드: {code}</p>
        )}
        <div className="mt-8 flex gap-3 justify-center">
          <Link
            to="/orders"
            className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            주문 목록에서 재결제
          </Link>
          <Link
            to="/"
            className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </main>
    </div>
  );
};
