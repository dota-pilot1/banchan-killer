import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AdminProductsPage } from '@/pages/admin/ui/AdminProductsPage';
import { HomePage } from '@/pages/home/ui/HomePage';
import { CategoryPage } from '@/pages/category/ui/CategoryPage';
import { LoginPage } from '@/pages/login/ui/LoginPage';
import { SignupPage } from '@/pages/signup/ui/SignupPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          {/* Add more routes here as we build them */}
          <Route path="*" element={<div className="flex items-center justify-center min-h-screen">404 Not Found</div>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
