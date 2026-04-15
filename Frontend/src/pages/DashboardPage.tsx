import AdminShell from '../components/layout/AdminShell';
import { offers, popularItems, revenuePoints, statCards } from '../data/mockData';
import type { AppRoute } from '../types/ui';

const revenueLabels = ['Apr 5', 'Apr 6', 'Apr 7', 'Apr 8', 'Apr 9', 'Apr 10', 'Apr 11'];

interface DashboardPageProps {
  onNavigate: (route: Exclude<AppRoute, 'login'>) => void;
  onLogout: () => void;
}

function RevenueChart() {
  const max = Math.max(...revenuePoints);

  const points = revenuePoints
    .map((value, index) => {
      const x = (index / (revenuePoints.length - 1)) * 100;
      const y = 100 - (value / max) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="h-[238px]">
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="h-[205px] w-full rounded-md border border-neutral-200 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_top,#f0f0f0_1px,transparent_1px)] bg-[length:calc(100%/6)_100%,100%_calc(100%/5)] bg-white"
      >
        <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e5e5" strokeWidth="0.5" />
        <line x1="0" y1="0" x2="0" y2="100" stroke="#e5e5e5" strokeWidth="0.5" />
        <polyline points={points} fill="none" stroke="#eb8947" strokeWidth="1.2" />
        {revenuePoints.map((value, index) => {
          const x = (index / (revenuePoints.length - 1)) * 100;
          const y = 100 - (value / max) * 100;
          return <circle key={value + index} cx={x} cy={y} r="1.4" fill="#eb8947" />;
        })}
      </svg>

      <div className="mt-1.5 grid grid-cols-7 text-[10px] text-neutral-400">
        {revenueLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage({ onNavigate, onLogout }: DashboardPageProps) {
  return (
    <AdminShell
      activeRoute="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Dashboard"
      subtitle="Welcome back, Admin User"
    >
      <section className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <article key={card.title} className="flex items-start justify-between rounded-lg border border-neutral-300 bg-white p-3">
            <div>
              <p className="m-0 text-[11px] text-neutral-500">{card.title}</p>
              <strong className="mt-1.5 block text-xl">{card.value}</strong>
              <small
                className={`mt-1 block text-[11px] ${
                  card.tone === 'success'
                    ? 'text-green-500'
                    : card.tone === 'danger'
                      ? 'text-rose-500'
                      : 'text-indigo-500'
                }`}
              >
                {card.note}
              </small>
            </div>
            <img src={card.icon} alt="" className="h-5 w-5" />
          </article>
        ))}
      </section>

      <section className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-lg border border-neutral-300 bg-white p-3.5">
          <div className="mb-2.5 flex items-center justify-between gap-2">
            <h3 className="m-0 text-xs font-semibold">Revenue (Last 7 Days)</h3>
            <button className="h-7 rounded border border-neutral-300 bg-white px-2.5 text-[11px] text-neutral-600">
              Weekly 
            </button>
          </div>
          <RevenueChart />
        </article>

        <article className="rounded-lg border border-neutral-300 bg-white p-3.5">
          <h3 className="m-0 text-xs font-semibold">Orders by Status</h3>
          <div
            className="mx-auto my-3.5 h-44 w-44 rounded-full"
            style={{ background: 'conic-gradient(#f19d95 0 25%, #be98eb 25% 50%, #95e09d 50% 75%, #9cbef1 75% 100%)' }}
            aria-label="Orders by status"
          />
          <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-600">
            <span>Preparing: 1</span>
            <span>Pending: 1</span>
            <span>Ready: 1</span>
            <span>Completed: 1</span>
          </div>
        </article>
      </section>

      <section className="mt-3 rounded-lg border border-neutral-300 bg-white p-3.5">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="m-0 text-xs font-semibold">Active Offers</h3>
          <button className="text-[11px] text-amber-700">View all</button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {offers.map((offer) => (
            <article key={offer.title} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
              <img src={offer.image} alt={offer.title} className="h-[86px] w-full object-cover" />
              <div className="p-2">
                <h4 className="m-0 text-[11px] font-semibold">{offer.title}</h4>
                <p className="mb-1.5 mt-1 text-[9px] text-neutral-500">{offer.subtitle}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded border border-amber-200 px-1.5 py-0.5 text-[8px] text-amber-700">
                    {offer.discount}
                  </span>
                  <small className="text-[8px] text-neutral-400">15/04/2026</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-lg border border-neutral-300 bg-white p-3.5">
        <div className="mb-2.5 flex flex-wrap items-center justify-between gap-2">
          <h3 className="m-0 text-xs font-semibold">Popular Items</h3>
          <div className="flex items-center gap-2 text-[10px] text-neutral-600">
            <span className="h-2 w-2 rounded-full bg-green-500" /> Veg
            <span className="h-2 w-2 rounded-full bg-neutral-300" /> Non Veg
            <span className="h-2 w-2 rounded-full bg-neutral-400" /> Beverages
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {popularItems.map((item) => (
            <div key={item.name} className="text-center">
              <div className="flex h-36 items-end justify-center border-x border-t border-neutral-100 pb-2.5">
                <div className="w-7 rounded-t-md bg-green-500" style={{ height: `${item.score}%` }} />
              </div>
              <p className="mb-0 mt-2 text-[9px] text-neutral-500">{item.name}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminShell>
  );
}
