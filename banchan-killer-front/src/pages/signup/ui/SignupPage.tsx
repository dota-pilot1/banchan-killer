import { Link } from 'react-router-dom';
import { SignupForm } from '@/features/auth/ui/SignupForm';
import { ChefHat } from 'lucide-react';

export const SignupPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 p-8 bg-white rounded-3xl shadow-xl border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-lg mx-auto mb-2">
            <ChefHat className="h-6 w-6" />
          </Link>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">회원가입</h2>
          <p className="text-slate-500 text-sm">간단한 정보만 입력하고 반찬 킬러가 되세요!</p>
        </div>

        <SignupForm />

        <div className="text-center pt-2">
          <p className="text-sm text-slate-600">
            이미 계정이 있으신가요?{' '}
            <Link to="/login" className="font-bold text-primary hover:underline underline-offset-4">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
