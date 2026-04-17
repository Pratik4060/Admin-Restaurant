import { useEffect, useMemo, useState } from 'react';
import AdminShell from '../components/layout/AdminShell';
import {
  getActiveOffers,
  getDashboardSummary,
  getOrderStatusBreakdown,
  getPopularItems,
  getRevenueTrend,
  type DashboardSummary,
  type OrderStatusBreakdownItem,
  type RevenueTrendPoint,
  type PopularItem,
} from '../lib/api';
import { offers as mockOffers, popularItems as mockPopularItems, statCards as mockStatCards } from '../data/mockData';
import type { AppRoute } from '../types/ui';

interface DashboardPageProps {
  onNavigate: (route: Exclude<AppRoute, 'login'>) => void;
  onLogout: () => void;
}

function RevenueChart({ points, labels }: { points: RevenueTrendPoint[]; labels: string[] }) {
  const revenuePoints = points.map((point) => point.revenue);
  const rawMax = Math.max(...revenuePoints);
  const safeMax = rawMax > 0 ? rawMax : 1;
  const denom = Math.max(1, revenuePoints.length - 1);

  const maxIndex = revenuePoints.reduce((bestIdx, v, idx) => (v > revenuePoints[bestIdx] ? idx : bestIdx), 0);
  const maxValue = revenuePoints[maxIndex] ?? 0;

  const xFor = (index: number) => (revenuePoints.length <= 1 ? 0 : (index / denom) * 100);
  const yFor = (value: number) => 100 - (value / safeMax) * 100;

  const tick1 = Math.floor(((0.2 * safeMax) / 1000)) * 1000;
  const tick2 = Math.round(((0.4 * safeMax) / 1000)) * 1000;
  const tick3 = Math.round(((0.6 * safeMax) / 1000)) * 1000;
  const tick4 = Math.floor((safeMax / 1000)) * 1000;
  const ticks = [0, tick1, tick2, tick3, tick4];

  const formatTick = (value: number) => {
    if (value <= 0) return '0';
    return `${Math.round(value / 1000)}k`;
  };

  const polylinePoints =
    revenuePoints.length > 1
      ? revenuePoints
          .map((value, index) => {
            const x = xFor(index);
            const y = yFor(value);
            return `${x},${y}`;
          })
          .join(' ')
      : '';

  const svgHeightPx = 205;
  const xMax = xFor(maxIndex);
  const yMax = yFor(maxValue);
  const tooltipTopPx = Math.max(8, (yMax / 100) * svgHeightPx - 46);

  return (
    <div className="relative h-[238px]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-[205px] w-full rounded-md border border-neutral-200 bg-white">
        {ticks.map((t, idx) => {
          const y = yFor(t);
          return (
            <g key={`${t}-${idx}`}>
              <line x1="10" y1={y} x2="100" y2={y} stroke="#e5e7eb" strokeWidth="0.35" strokeDasharray="3 3" />
              <text x="2.5" y={y + 2} fontSize="4" fill="#9ca3af">
                {formatTick(t)}
              </text>
            </g>
          );
        })}

        <line x1={xMax} y1="0" x2={xMax} y2="100" stroke="#d1d5db" strokeWidth="0.3" strokeDasharray="4 4" />

        {polylinePoints ? <polyline points={polylinePoints} fill="none" stroke="#eb8947" strokeWidth="1.2" /> : null}
        {revenuePoints.map((value, index) => {
          const x = xFor(index);
          const y = yFor(value);
          return <circle key={value + index} cx={x} cy={y} r={index === maxIndex ? 1.7 : 1.4} fill="#eb8947" />;
        })}
      </svg>

      {/* Tooltip like reference */}
      <div
        className="absolute z-10 rounded border border-neutral-200 bg-white px-2 py-1 text-center shadow-sm"
        style={{
          left: `${xMax}%`,
          top: `${tooltipTopPx}px`,
          transform: 'translateX(-50%)',
          width: 118,
        }}
      >
        <div className="text-[10px] font-medium text-neutral-800">{labels[maxIndex] ?? ''}</div>
        <div className="mt-0.5 text-[10px] text-neutral-700">
          Revenue : <span className="text-[#eb8947]">₹{Math.round(maxValue).toLocaleString('en-IN')}</span>
        </div>
      </div>

      <div className="mt-1.5 grid grid-cols-7 text-[10px] text-neutral-400">
        {labels.map((label, idx) => (
          <span key={`${label}-${idx}`}>{label}</span>
        ))}
      </div>
    </div>
  );
}

const STATUS_VIEW: Array<{
  status: OrderStatusBreakdownItem['status'];
  label: string;
  color: string;
  position: string;
}> = [
  { status: 'PREPARING', label: 'Preparing', color: '#7aa7e9', position: 'left-0 top-0' },
  { status: 'PENDING', label: 'Pending', color: '#f19d95', position: 'right-0 top-0' },
  { status: 'READY', label: 'Ready', color: '#95e09d', position: 'left-0 bottom-0' },
  { status: 'COMPLETED', label: 'Completed', color: '#be98eb', position: 'right-0 bottom-0' },
];

function OrdersByStatusCard({ breakdown }: { breakdown: OrderStatusBreakdownItem[] }) {
  const byStatus = new Map(breakdown.map((row) => [row.status, row.count]));
  const slices = STATUS_VIEW.map((s) => ({ ...s, count: byStatus.get(s.status) ?? 0 }));
  const total = slices.reduce((sum, s) => sum + s.count, 0);

  // Build conic-gradient stops from live counts. When total == 0 we fall back
  // to four equal slices so the card still shows the reference design.
  const stops: string[] = [];
  if (total > 0) {
    let cursor = 0;
    slices.forEach((s, idx) => {
      const next = idx === slices.length - 1 ? 100 : cursor + (s.count / total) * 100;
      if (next > cursor) {
        stops.push(`${s.color} ${cursor.toFixed(4)}% ${next.toFixed(4)}%`);
      }
      cursor = next;
    });
  } else {
    slices.forEach((s, idx) => {
      const start = idx * 25;
      const end = (idx + 1) * 25;
      stops.push(`${s.color} ${start}% ${end}%`);
    });
  }

  return (
    <article className="rounded-lg border border-neutral-300 bg-white p-3.5">
      <h3 className="m-0 text-xs font-semibold">Orders by Status</h3>

      <div className="relative mx-auto mt-4 mb-2 h-[210px] w-full max-w-[300px]">
        <div
          className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: `conic-gradient(${stops.join(', ')})` }}
          aria-label="Orders by status"
        />

        {slices.map((s) => (
          <span
            key={s.status}
            className={`absolute ${s.position} text-[10px] font-medium text-neutral-600`}
          >
            {s.label} : {s.count}
          </span>
        ))}
      </div>
    </article>
  );
}

function formatRevenueLabel(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric' });
}

function bucketizeRevenue(points: RevenueTrendPoint[], bucketCount: number): RevenueTrendPoint[] {
  if (points.length === 0) return [];
  if (points.length <= bucketCount) return points;

  const len = points.length;
  const result: RevenueTrendPoint[] = [];

  for (let i = 0; i < bucketCount; i += 1) {
    const start = Math.floor((i * len) / bucketCount);
    const end = Math.floor(((i + 1) * len) / bucketCount);
    const slice = points.slice(start, end);

    const revenue = slice.reduce((sum, p) => sum + p.revenue, 0);
    const lastDate = slice[slice.length - 1]?.date ?? points[len - 1]!.date;
    result.push({ date: lastDate, revenue });
  }

  return result;
}

export default function DashboardPage({ onNavigate, onLogout }: DashboardPageProps) {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [revenueChartPoints, setRevenueChartPoints] = useState<RevenueTrendPoint[]>([]);
  const [revenueChartLabels, setRevenueChartLabels] = useState<string[]>([]);
  const [offers, setOffers] = useState<
    Array<{ id: string; title: string; description: string | null; discountValue: number; imageUrl: string }>
  >([]);
  const [popularFoodType, setPopularFoodType] = useState<'veg' | 'nonveg' | 'beverages'>('veg');
  const [popularItems, setPopularItemsState] = useState<Array<{ id: string; name: string; likes: number }>>([]);
  const [revenuePeriod, setRevenuePeriod] = useState<'weekly' | 'monthly' | 'yearly'>('weekly');
  const [orderStatus, setOrderStatus] = useState<OrderStatusBreakdownItem[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setError('');
        const [summaryData, offersData, popularData, orderStatusData] = await Promise.all([
          getDashboardSummary(),
          getActiveOffers(),
          // Popular items are fetched again per tab; this is just to avoid empty chart on first paint.
          getPopularItems('veg', 12),
          getOrderStatusBreakdown(),
        ]);
        setSummary(summaryData);
        setOrderStatus(orderStatusData);
        setOffers(
          offersData.map((offer) => {
            const mock = mockOffers.find((o) => o.title === offer.title);
            return {
              id: offer.id,
              title: offer.title,
              description: mock?.subtitle ?? offer.description,
              discountValue: offer.discountValue,
              imageUrl: mock?.image ?? offer.imageUrl,
            };
          }),
        );

        // Initial paint: show Veg chart (excluding beverages)
        const filtered = (popularData as PopularItem[]).filter((i) => i.category !== 'Beverages').slice(0, 5);
        const order = mockPopularItems.map((i) => i.name);
        filtered.sort((a, b) => {
          const ai = order.indexOf(a.name);
          const bi = order.indexOf(b.name);
          return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
        });
        setPopularItemsState(filtered.map((i) => ({ id: i.id, name: i.name, likes: i.likes })));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load dashboard');
      }
    };

    loadDashboard();
  }, []);

  useEffect(() => {
    const loadRevenue = async () => {
      try {
        setError('');
        const days = revenuePeriod === 'weekly' ? 7 : revenuePeriod === 'monthly' ? 30 : 365;
        const raw = await getRevenueTrend(days);

        const bucketed = bucketizeRevenue(raw, 7);
        setRevenueChartPoints(bucketed);
        setRevenueChartLabels(bucketed.map((p) => formatRevenueLabel(p.date)));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load revenue chart');
      }
    };

    loadRevenue();
  }, [revenuePeriod]);

  useEffect(() => {
    const loadPopular = async () => {
      try {
        setError('');
        const getTop = async (foodType: 'all' | 'veg' | 'nonveg', filter: (i: PopularItem) => boolean) => {
          const items = await getPopularItems(foodType, 20);
          return items.filter(filter).slice(0, 5);
        };

        if (popularFoodType === 'veg') {
          const items = await getTop('veg', (i) => i.category !== 'Beverages');
          const order = mockPopularItems.map((i) => i.name);
          items.sort((a, b) => {
            const ai = order.indexOf(a.name);
            const bi = order.indexOf(b.name);
            return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
          });
          setPopularItemsState(items.map((i) => ({ id: i.id, name: i.name, likes: i.likes })));
          return;
        }

        if (popularFoodType === 'nonveg') {
          const items = await getTop('nonveg', (i) => i.category !== 'Beverages');
          setPopularItemsState(items.map((i) => ({ id: i.id, name: i.name, likes: i.likes })));
          return;
        }

        // beverages (mostly VEG in this dataset)
        const items = await getTop('all', (i) => i.category === 'Beverages');
        setPopularItemsState(items.map((i) => ({ id: i.id, name: i.name, likes: i.likes })));
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load popular items');
      }
    };

    loadPopular();
  }, [popularFoodType]);

  const statCards = useMemo(
    () =>
      mockStatCards.map((card) => {
        if (!summary) return card;

        switch (card.title) {
          case "Today's Orders":
            return { ...card, value: String(summary.todayOrders) };
          case "Today's Revenue":
            return {
              ...card,
              value: `₹ ${Math.round(summary.todayRevenue).toLocaleString('en-IN')}`,
            };
          case 'Pending Orders':
            return { ...card, value: String(summary.pendingOrders) };
          case 'Total Customers':
            return { ...card, value: String(summary.totalCustomers), note: card.note };
          default:
            return card;
        }
      }),
    [summary],
  );

  const popularChart = useMemo(() => {
    const gridTicks = [0, 25, 50, 75, 100] as const;
    const labelTicks = [0, 50, 100] as const;
    const isVeg = popularFoodType === 'veg';
    const isNonVeg = popularFoodType === 'nonveg';

    const barClass = isVeg ? 'bg-green-500' : isNonVeg ? 'bg-red-500' : 'bg-blue-500';

    const chartHeightPx = 140;
    const clamp = (n: number) => Math.max(0, Math.min(1, n / 100));

    return { gridTicks, labelTicks, barClass, chartHeightPx, clamp };
  }, [popularFoodType]);

  return (
    <AdminShell
      activeRoute="dashboard"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Dashboard"
      subtitle="Welcome back, Admin User"
    >
      {error && <p className="rounded border border-rose-200 bg-rose-50 p-2 text-xs text-rose-600">{error}</p>}

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
            <h3 className="m-0 text-xs font-semibold">
              Revenue (
              {revenuePeriod === 'weekly' ? 'Last 7 Days' : revenuePeriod === 'monthly' ? 'Last 30 Days' : 'Last 365 Days'})
            </h3>
            <div className="relative">
              <select
                value={revenuePeriod}
                onChange={(e) => setRevenuePeriod(e.target.value as 'weekly' | 'monthly' | 'yearly')}
                className="h-7 appearance-none rounded border border-neutral-300 bg-white px-2.5 pr-7 text-[11px] text-neutral-600 outline-none"
                aria-label="Revenue range"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="pointer-events-none absolute right-2 top-1/2 h-3 w-3 -translate-y-1/2 text-neutral-600"
              >
                <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {revenueChartPoints.length > 0 ? (
            <RevenueChart points={revenueChartPoints} labels={revenueChartLabels} />
          ) : (
            <p className="text-xs text-neutral-500">No trend data</p>
          )}
        </article>

        <OrdersByStatusCard breakdown={orderStatus} />
      </section>

      <section className="mt-3 rounded-lg border border-neutral-300 bg-white p-3.5">
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <h3 className="m-0 text-xs font-semibold">Active Offers</h3>
          <button className="text-[11px] text-amber-700">View all</button>
        </div>

        <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-4">
          {offers.map((offer) => (
            <article key={offer.id} className="overflow-hidden rounded-md border border-neutral-200 bg-white">
              <img src={offer.imageUrl} alt={offer.title} className="h-[86px] w-full object-cover" />
              <div className="p-2">
                <h4 className="m-0 text-[11px] font-semibold">{offer.title}</h4>
                <p className="mb-1.5 mt-1 text-[9px] text-neutral-500">{offer.description ?? 'Offer available now'}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded border border-amber-200 px-1.5 py-0.5 text-[8px] text-amber-700">
                    {offer.discountValue}% OFF
                  </span>
                  <small className="text-[8px] text-neutral-400">Until 4/15/2026</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-3 rounded-lg border border-neutral-300 bg-white p-3.5">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <h3 className="m-0 text-[15px] font-semibold text-neutral-800">Popular Items</h3>
          <div className="flex items-center gap-5 text-xs font-medium text-neutral-800">
            <label className="flex cursor-pointer items-center gap-2">
              <input 
                 type="radio" 
                 name="foodType"
                 className="hidden" 
                 checked={popularFoodType === 'veg'} 
                 onChange={() => setPopularFoodType('veg')} 
              />
              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${popularFoodType === 'veg' ? 'border-green-500' : 'border-neutral-300'}`}>
                {popularFoodType === 'veg' && <span className="h-[10px] w-[10px] rounded-full bg-green-500"></span>}
              </span>
              Veg
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input 
                 type="radio" 
                 name="foodType"
                 className="hidden" 
                 checked={popularFoodType === 'nonveg'} 
                 onChange={() => setPopularFoodType('nonveg')} 
              />
              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${popularFoodType === 'nonveg' ? 'border-red-500' : 'border-neutral-300'}`}>
                {popularFoodType === 'nonveg' && <span className="h-[10px] w-[10px] rounded-full bg-red-500"></span>}
              </span>
              Non Veg
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input 
                 type="radio" 
                 name="foodType"
                 className="hidden" 
                 checked={popularFoodType === 'beverages'} 
                 onChange={() => setPopularFoodType('beverages')} 
              />
              <span className={`flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 ${popularFoodType === 'beverages' ? 'border-blue-500' : 'border-neutral-300'}`}>
                {popularFoodType === 'beverages' && <span className="h-[10px] w-[10px] rounded-full bg-blue-500"></span>}
              </span>
              Beverages
            </label>
            <button aria-label="Download" className="ml-2 text-neutral-500 hover:text-neutral-800">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="relative mt-1">
          {/* Y axis + grid */}
          <div className="pointer-events-none absolute left-0 top-0 h-[140px] w-8">
            {popularChart.labelTicks.map((t) => {
              const top = (1 - t / 100) * popularChart.chartHeightPx;
              const styleTop = Math.max(0, top - 6);
              return (
                <div key={t} className="absolute left-0 text-[9px] text-neutral-500" style={{ top: styleTop }}>
                  {t}
                </div>
              );
            })}
          </div>

          <div className="pointer-events-none absolute left-8 top-0 h-[140px] right-0">
            {popularChart.gridTicks.map((t) => {
              const top = (1 - t / 100) * popularChart.chartHeightPx;
              return (
                <div
                  key={t}
                  className="absolute left-0 right-0 border-t border-dashed border-neutral-300"
                  style={{ top }}
                />
              );
            })}
          </div>

          {/* Bars */}
          <div className="relative pl-8">
            <div className="flex items-end justify-between h-[140px]">
              {popularItems.map((item, index) => {
                const likes01 = popularChart.clamp(item.likes);
                const barHeight = likes01 * popularChart.chartHeightPx;
                
                const barRounded = popularChart.barClass;
                const textColorClass = popularFoodType === 'veg' ? 'text-green-500' : popularFoodType === 'nonveg' ? 'text-red-500' : 'text-blue-500';

                return (
                  <div key={item.id} className="relative flex w-[44px] flex-col items-center">
                    <div
                      className={`w-full rounded-t-sm ${barRounded}`}
                      style={{
                        height: `${barHeight}px`,
                      }}
                    />

                    {index === 0 && barHeight > 8 && (
                      <div
                        className="absolute z-10 flex cursor-default items-center justify-center rounded-[8px] border border-neutral-200 bg-white px-2.5 py-1 shadow-[0_2px_8px_rgb(0,0,0,0.06)]"
                        style={{
                          top: `${Math.min(10, barHeight / 2)}px`,
                          left: '52px',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <div className="absolute -left-[5px] top-[calc(50%-5px)] h-[10px] w-[10px] rotate-45 border-b border-l border-neutral-200 bg-white" />
                        <span className="relative z-10 text-[10px] font-medium text-neutral-500">
                          Like : <span className={textColorClass}>{item.likes}</span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* X labels */}
            <div className="mt-3 flex items-start justify-between">
              {popularItems.map((item) => (
                <div key={item.id} className="w-[44px] text-center">
                  <p className="text-[10px] font-medium leading-tight text-neutral-500">{item.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
