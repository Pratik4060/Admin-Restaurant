import { useMemo, useState } from 'react';
import AdminShell from '../components/layout/AdminShell';
import { orders } from '../data/mockData';
import type { AppRoute } from '../types/ui';

interface OrdersPageProps {
  onNavigate: (route: Exclude<AppRoute, 'login'>) => void;
  onLogout: () => void;
}

function statusColors(status: string) {
  if (status === 'Completed') return 'text-green-600 bg-green-100';
  if (status === 'Ready') return 'text-cyan-600 bg-cyan-100';
  return 'text-yellow-700 bg-yellow-100';
}

export default function OrdersPage({ onNavigate, onLogout }: OrdersPageProps) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'latest' | 'status'>('latest');
  const [showModal, setShowModal] = useState(true);

  const visibleOrders = useMemo(() => {
    const filtered = orders.filter((order) => {
      const needle = search.trim().toLowerCase();
      if (!needle) return true;
      return order.id.toLowerCase().includes(needle) || order.customer.toLowerCase().includes(needle);
    });

    if (sortBy === 'status') {
      return [...filtered].sort((a, b) => a.status.localeCompare(b.status));
    }

    return filtered;
  }, [search, sortBy]);

  return (
    <AdminShell
      activeRoute="orders"
      onNavigate={onNavigate}
      onLogout={onLogout}
      title="Orders"
      subtitle="Manage and track all orders"
      action={
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="h-8 rounded-md bg-brand-500 px-3.5 text-[11px] text-white"
        >
          + New Order
        </button>
      }
    >
      <section className="flex flex-col items-stretch justify-between gap-2 rounded-lg border border-neutral-300 bg-white p-2.5 md:flex-row md:items-center">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by order ID or customer"
          className="h-8 w-full rounded border border-neutral-200 px-2 text-[11px] text-neutral-600 outline-none focus:ring-2 focus:ring-brand-100 md:w-[290px]"
        />

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value as 'latest' | 'status')}
          className="h-8 rounded border border-neutral-300 bg-white px-2 text-[11px] text-neutral-600 outline-none"
        >
          <option value="latest">Sort by latest</option>
          <option value="status">Sort by status</option>
        </select>
      </section>

      <section className="mt-2.5 grid grid-cols-1 gap-2.5 xl:grid-cols-2">
        {visibleOrders.map((order) => (
          <article key={order.id} className="rounded-lg border border-neutral-300 bg-white p-2.5">
            <div className="mb-2 flex items-center justify-between">
              <strong className="text-[10px]">{order.id}</strong>
              <span className={`rounded-full px-2 py-0.5 text-[8px] ${statusColors(order.status)}`}>{order.status}</span>
            </div>

            <p className="m-0 text-[9px] text-neutral-600">{order.customer}</p>
            <p className="m-0 text-[9px] text-neutral-600">{order.table}</p>

            <div className="mt-2 border-t border-neutral-100 pt-1.5">
              {order.items.map((item) => (
                <div key={item.name} className="mt-1 flex justify-between text-[9px] text-neutral-600">
                  <span>{item.name}</span>
                  <span>{item.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex justify-between border-t border-neutral-100 pt-1.5">
              <span className="text-[9px] text-neutral-500">Total</span>
              <strong className="text-[11px] text-green-500">{order.total}</strong>
            </div>

            <div className="mt-2 flex flex-col gap-0.5 text-[8px] text-neutral-400">
              <small>Created: {order.createdAt}</small>
              <small>Updated: {order.updatedAt}</small>
            </div>

            <div className="mt-2 grid grid-cols-[1fr_auto] gap-1.5">
              {order.status === 'Preparing' && (
                <button type="button" className="h-6 rounded border border-yellow-400 bg-yellow-400 text-[9px] text-white">
                  Start Preparing
                </button>
              )}
              {order.status === 'Ready' && (
                <button type="button" className="h-6 rounded border border-blue-400 bg-blue-400 text-[9px] text-white">
                  Mark Ready
                </button>
              )}
              {order.status !== 'Preparing' && (
                <button type="button" className="h-6 rounded border border-green-400 bg-green-400 text-[9px] text-white">
                  Complete Order
                </button>
              )}
              <button type="button" className="h-6 rounded border border-rose-200 px-3 text-[9px] text-rose-400">
                Cancel
              </button>
            </div>
          </article>
        ))}
      </section>

      {showModal && (
        <div className="fixed inset-0 grid place-items-center bg-neutral-200/60 px-4">
          <div className="w-full max-w-[520px] rounded-lg border border-neutral-300 bg-white p-3 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="m-0 text-xs font-semibold">Create New Order</h3>
              <button type="button" className="text-sm text-neutral-500" onClick={() => setShowModal(false)}>
                x
              </button>
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[9px] text-neutral-500">Customer Name</label>
                <input className="h-7 w-full rounded border border-neutral-200 px-2 text-[10px]" placeholder="Enter Customer Name" />
              </div>
              <div>
                <label className="mb-1 block text-[9px] text-neutral-500">Table Number</label>
                <input className="h-7 w-full rounded border border-neutral-200 px-2 text-[10px]" placeholder="eg:T1" />
              </div>
            </div>

            <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[9px] text-neutral-500">Order Item</label>
                <input className="h-7 w-full rounded border border-neutral-200 px-2 text-[10px]" placeholder="Search by order" />
              </div>
              <div>
                <label className="mb-1 block text-[9px] text-neutral-500">Order Items</label>
                <div className="flex h-7 items-center justify-center gap-2 rounded border border-neutral-200 text-[11px]">
                  <button type="button" className="h-5 w-5 rounded border border-neutral-300">
                    -
                  </button>
                  <span>1</span>
                  <button type="button" className="h-5 w-5 rounded border border-neutral-300">
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <button
                type="button"
                className="h-7 rounded border border-neutral-200 bg-white text-[10px] text-neutral-500"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="h-7 rounded border border-brand-700 bg-gradient-to-r from-[#c5a16e] to-[#7f5a27] text-[10px] text-white"
                onClick={() => setShowModal(false)}
              >
                Create Order
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminShell>
  );
}
