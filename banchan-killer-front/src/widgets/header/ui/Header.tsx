import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChevronDown, MapPin, Menu, Search, ShoppingCart, User } from 'lucide-react';
import { useCartStore } from '@/entities/cart/model/store';
import { useUserStore } from '@/entities/user/model/store';

export const Header = () => {
  const { isAuthenticated, user, logout } = useUserStore();
  const location = useLocation();
  const cartCount = useCartStore((state) => state.getItemCount());
  const fetchCart = useCartStore((state) => state.fetchCart);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchCart();
  }, [isAuthenticated, fetchCart]);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { label: '야채 반찬', href: '/category/vegetable' },
    { label: '고기 반찬', href: '/category/meat' },
    { label: '김치류', href: '/category/kimchi' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter text-primary">
              Banchan <span className="text-orange-500">Killer</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;

            return (
              <Link
                key={item.href}
                to={item.href}
                className={`transition-colors hover:text-primary ${isActive ? 'text-primary font-semibold' : 'text-slate-900'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Bar */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="오늘 뭐 먹지?"
              className="h-9 w-64 rounded-full bg-secondary pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <Link to="/cart" className="relative inline-flex">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </Button>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin/products"
                  className="inline-flex h-9 items-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  관리자
                </Link>
              )}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:text-slate-900"
                >
                  <span>{user?.nickname || user?.email}님</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen ? (
                  <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-2xl">
                    <div className="rounded-[1.25rem] bg-slate-50 px-4 py-3">
                      <p className="text-sm font-bold text-slate-900">{user?.nickname || user?.email}</p>
                      <p className="mt-1 text-xs text-slate-500">{user?.email}</p>
                    </div>

                    <div className="mt-3 space-y-1">
                      <Link
                        to="/mypage?tab=profile"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-4 w-4" />
                        프로필
                      </Link>
                      <Link
                        to="/mypage?tab=address"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <MapPin className="h-4 w-4" />
                        배송지 관리
                      </Link>
                      <Link
                        to="/orders"
                        className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center text-xs font-bold">≡</span>
                        주문 내역
                      </Link>
                      <button
                        type="button"
                        className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-slate-900"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                      >
                        <span className="inline-flex h-4 w-4 items-center justify-center text-xs font-bold">↗</span>
                        로그아웃
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <Link to="/login" className={buttonVariants({ variant: "default", size: "sm" })}>
              로그인
            </Link>
          )}

          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};
