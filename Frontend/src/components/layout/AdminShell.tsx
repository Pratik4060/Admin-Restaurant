import type { ReactNode } from 'react';
import { brandAssets, sidebarItems } from '../../data/mockData';
import type { AppRoute } from '../../types/ui';

interface AdminShellProps {
  activeRoute: Exclude<AppRoute, 'login'>;
  onNavigate: (route: Exclude<AppRoute, 'login'>) => void;
  onLogout: () => void;
  title: string;
  subtitle: string;
  action?: ReactNode;
  children: ReactNode;
}

export default function AdminShell({
  activeRoute,
  onNavigate,
  onLogout,
  title,
  subtitle,
  action,
  children,
}: AdminShellProps) {
  return (
    <div className="grid  grid-cols-1   lg:grid-cols-[245px_1fr]">
      <aside className="border-b border-neutral-300 bg-neutral-100 p-3 lg:border-b-0 lg:border-r">
        <div className="flex items-center gap-2 px-2 py-1">
          <img src={brandAssets.logo} alt="Restaurant Management" className="h-10 w-10" />
          <div>
            <p className="m-0 text-[10px] text-neutral-800">Restaurant</p>
            <p className="m-0 text-[9px] text-neutral-500">Management System</p>
          </div>
        </div>

        <nav className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-1">
          {sidebarItems.map((item) => {
            const isSupported = item.id === 'dashboard' || item.id === 'orders';
            const isActive = item.id === activeRoute;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (isSupported) onNavigate(item.id as Exclude<AppRoute, 'login'>);
                }}
                className={`flex h-10 items-center gap-2 rounded-md px-3 text-left text-xs transition ${
                  isActive ? 'bg-brand-100 text-neutral-900' : 'bg-transparent text-neutral-700 hover:bg-neutral-200'
                } ${isSupported ? 'cursor-pointer' : 'cursor-not-allowed opacity-65'}`}
              >
                <img src={item.icon} alt="" className="h-3.5 w-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="p-3 sm:p-4">
        <header className="flex h-12 items-center justify-between border-b border-neutral-300">
          <div />
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              className="grid h-7 w-7 place-items-center rounded-full border border-neutral-300 bg-white text-neutral-500"
              aria-label="Notifications"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M12 3a4 4 0 0 0-4 4v2.1c0 .8-.3 1.6-.9 2.1L6 12.3V14h12v-1.7l-1.1-1.1a3 3 0 0 1-.9-2.1V7a4 4 0 0 0-4-4Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="M10 16.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <div className="text-right leading-none">
                <strong className="text-[10px] font-semibold">Admin User</strong>
                <small className="block text-[9px] text-neutral-500">Admin</small>
              </div>
              <span className="grid h-6 w-6 place-items-center rounded-full bg-gradient-to-r from-[#c3a06f] to-[#7f5a27] text-[11px] text-white">
                A
              </span>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="grid h-7 w-7 place-items-center rounded-full border border-rose-200 bg-white text-rose-400"
              aria-label="Logout"
            >
              <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" aria-hidden="true">
                <path d="M9 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M13 8l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 12h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <section className="flex items-center justify-between px-1 py-4">
          <div>
            <h1 className="m-0 text-2xl font-medium text-neutral-900 sm:text-3xl">{title}</h1>
            <p className="mt-1 text-xs text-neutral-500">{subtitle}</p>
          </div>
          {action}
        </section>

        {children}
      </main>
    </div>
  );
}
