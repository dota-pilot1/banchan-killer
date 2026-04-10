import { Link } from 'react-router-dom';
import { LoginForm } from '@/features/auth/ui/LoginForm';
import { ChefHat } from 'lucide-react';

export const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-4">
          <Link to="/" className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
            <ChefHat className="h-10 w-10" />
          </Link>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">반찬 킬러 로그인</h2>
          <p className="text-slate-500">맛있는 일상이 다시 시작되는 곳</p>
        </div>

        <LoginForm />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-200" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-slate-400">처음이신가요?</span>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-600">
            아직 계정이 없으신가요?{' '}
            <Link to="/signup" className="font-bold text-primary hover:underline underline-offset-4">
              무료 회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
