import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/shared/api/base';
import { useUserStore } from '@/entities/user/model/store';

export const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const setAuth = useUserStore((state) => state.setAuth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. 회원가입 요청
      await apiClient.post('/auth/signup', {
        email: formData.email,
        password: formData.password,
        nickname: formData.nickname,
      });

      // 2. 가입 완료 후 자동 로그인 처리
      const loginResponse = await apiClient.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });
      
      const { accessToken, ...user } = loginResponse.data;
      setAuth(user, accessToken);
      
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">이메일 <span className="text-red-500">*</span></label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="로그인 전용 이메일"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">닉네임</label>
        <input
          type="text"
          name="nickname"
          value={formData.nickname}
          onChange={handleChange}
          maxLength={50}
          className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="리뷰/커뮤니티 활동 시 사용할 이름"
        />
      </div>
      
      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">비밀번호 <span className="text-red-500">*</span></label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          minLength={8}
          className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="8자 이상 입력"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700">비밀번호 확인 <span className="text-red-500">*</span></label>
        <input
          type="password"
          name="passwordConfirm"
          value={formData.passwordConfirm}
          onChange={handleChange}
          required
          className="w-full h-11 px-4 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          placeholder="비밀번호 다시 입력"
        />
      </div>

      {error && (
        <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-12 text-lg font-bold mt-2" disabled={isLoading}>
        {isLoading ? '처리 중...' : '회원가입 시작하기'}
      </Button>
    </form>
  );
};
