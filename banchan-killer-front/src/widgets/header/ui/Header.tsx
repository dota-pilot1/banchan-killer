import { Link, useLocation } from 'react-router-dom';
import { Button, buttonVariants } from '@/components/ui/button';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { useUserStore } from '@/entities/user/model/store';

export const Header = () => {
  const { isAuthenticated, user, logout } = useUserStore();
  const location = useLocation();

  const navItems = [
    { label: '야채 반찬', href: '/category/vegetable' },
    { label: '고기 반찬', href: '/category/meat' },
    { label: '김치류', href: '/category/kimchi' },
  ];

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
          
          <Button variant="ghost" size="icon" className="relative">
            <ShoppingCart className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center">
              0
            </span>
          </Button>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{user?.nickname || user?.email}님</span>
              <Button variant="outline" size="sm" onClick={logout}>로그아웃</Button>
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
