import { useMemo, useState } from 'react';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import OrdersPage from './pages/OrdersPage';
import type { AppRoute } from './types/ui';

const AUTH_KEY = 'restaurant-admin-auth';

function resolvePage(pathname: string, search: string, hash: string): Exclude<AppRoute, 'login'> {
  const page = new URLSearchParams(search).get('page')?.toLowerCase();
  if (page === 'orders') return 'orders';
  if (hash.includes('orders')) return 'orders';
  if (pathname.includes('orders')) return 'orders';
  return 'dashboard';
}

export default function App() {
  const initialPage = useMemo(
    () =>
      resolvePage(
        window.location.pathname.toLowerCase(),
        window.location.search.toLowerCase(),
        window.location.hash.toLowerCase(),
      ),
    [],
  );

  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem(AUTH_KEY) === '1');
  const [activePage, setActivePage] = useState<Exclude<AppRoute, 'login'>>(initialPage);

  const handleNavigate = (page: Exclude<AppRoute, 'login'>) => {
    setActivePage(page);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.set('page', page);
    window.history.replaceState({}, '', nextUrl.toString());
  };

  const handleLoginSuccess = () => {
    localStorage.setItem(AUTH_KEY, '1');
    setIsAuthenticated(true);
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
    const nextUrl = new URL(window.location.href);
    nextUrl.searchParams.delete('page');
    window.history.replaceState({}, '', nextUrl.toString());
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  if (activePage === 'orders') {
    return <OrdersPage onNavigate={handleNavigate} onLogout={handleLogout} />;
  }

  return <DashboardPage onNavigate={handleNavigate} onLogout={handleLogout} />;
}
