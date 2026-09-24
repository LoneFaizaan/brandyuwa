import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, isToday, timeAgo, totalStock } from '../../lib/format';
import { STORE_CONFIG, STORE_PHONE_DISPLAY } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';
import { ProductImage } from '../../components/common/ProductImage';
import { WhatsAppIcon } from '../../components/common/SocialIcons';

export const AdminDashboardView: React.FC = () => {
  usePageTitle('Staff dashboard');
  const { orders, products } = useStore();

  const newOrders = orders.filter((o) => o.status === 'new');
  const todaysOrders = orders.filter((o) => isToday(o.createdAt) && o.status !== 'cancelled');
  const salesToday = todaysOrders.reduce((sum, o) => sum + o.total, 0);
  const live = products.filter((p) => p.published);
  const needStock = products
    .filter((p) => totalStock(p) <= STORE_CONFIG.lowStockAt)
    .sort((a, b) => totalStock(a) - totalStock(b));

  const stats = [
    { label: 'New orders', value: String(newOrders.length), to: '/admin/orders', alert: newOrders.length > 0 },
    { label: 'Sales today', value: formatPrice(salesToday), to: '/admin/orders' },
    { label: 'Products in shop', value: String(live.length), to: '/admin/products' },
    { label: 'Need restock', value: String(needStock.length), to: '/admin/stock', alert: needStock.length > 0 },
  ];

  return (
    <AdminPage
      title="Dashboard"
      subtitle={new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
    >
      <Link to="/admin/products/new" className="flex items-center gap-4 rounded-2xl bg-ink p-5 text-white transition active:scale-[0.99]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
          <Plus size={26} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-lg font-semibold">Add a new product</span>
          <span className="block text-sm text-white/70">Photo, name, price and sizes</span>
        </span>
        <ChevronRight size={22} className="text-white/60" />
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} to={s.to} className="card p-4 transition-colors hover:border-line-strong">
            <p className="text-sm text-muted">{s.label}</p>
            <p className={`tabular mt-1 text-2xl font-bold ${s.alert ? 'text-sale' : ''}`}>{s.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-[15px] font-semibold">New orders</h2>
            <Link to="/admin/orders" className="text-sm font-semibold text-muted hover:text-ink">
              See all
            </Link>
          </div>
          {newOrders.length === 0 ? (
            <p className="px-4 py-6 text-[15px] text-muted">No new orders right now.</p>
          ) : (
            <ul className="divide-y divide-line">
              {newOrders.slice(0, 5).map((o) => (
                <li key={o.id}>
                  <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-soft">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-medium">{o.customer.name}</p>
                      <p className="text-sm text-muted">
                        {o.id} · {timeAgo(o.createdAt)}
                      </p>
                    </div>
                    <p className="tabular text-[15px] font-semibold">{formatPrice(o.total)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <h2 className="text-[15px] font-semibold">Running low</h2>
            <Link to="/admin/stock?show=low" className="text-sm font-semibold text-muted hover:text-ink">
              Update stock
            </Link>
          </div>
          {needStock.length === 0 ? (
            <p className="px-4 py-6 text-[15px] text-muted">Everything is well stocked.</p>
          ) : (
            <ul className="divide-y divide-line">
              {needStock.slice(0, 5).map((p) => {
                const t = totalStock(p);
                return (
                  <li key={p.id}>
                    <Link to="/admin/stock?show=low" className="flex items-center gap-3 px-4 py-2.5 hover:bg-soft">
                      <ProductImage src={p.images[0]} alt="" className="h-12 w-10 shrink-0 rounded-lg" />
                      <p className="min-w-0 flex-1 truncate text-[15px] font-medium">{p.name}</p>
                      <span className={`badge ${t === 0 ? 'bg-sale-soft text-sale' : 'bg-warn-soft text-warn'}`}>
                        {t === 0 ? 'Sold out' : `${t} left`}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-4 flex gap-3 rounded-2xl border border-whatsapp/25 bg-ok-soft p-4 text-[15px]">
        <WhatsAppIcon size={22} className="mt-0.5 shrink-0 text-whatsapp" />
        <p className="leading-relaxed">
          Customer orders are sent to your WhatsApp at <strong>{STORE_PHONE_DISPLAY}</strong>. Reply there to confirm each order.
        </p>
      </div>
    </AdminPage>
  );
};
