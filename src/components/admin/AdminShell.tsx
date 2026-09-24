import React from 'react';
import { Boxes, ClipboardList, ExternalLink, LayoutDashboard, Settings, Shirt } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { useStore } from '../../context/StoreContext';
import { Logo } from '../common/Logo';

export const AdminShell: React.FC<{ children: React.ReactNode; hideTabs?: boolean }> = ({ children, hideTabs }) => {
  const { path } = useRouter();
  const { orders } = useStore();
  const newOrders = orders.filter((o) => o.status === 'new').length;

  const tabs = [
    { label: 'Home', to: '/admin', icon: LayoutDashboard, active: path === '/admin' },
    { label: 'Products', to: '/admin/products', icon: Shirt, active: path.startsWith('/admin/products') },
    { label: 'Orders', to: '/admin/orders', icon: ClipboardList, active: path.startsWith('/admin/orders'), badge: newOrders },
    { label: 'Stock', to: '/admin/stock', icon: Boxes, active: path.startsWith('/admin/stock') },
    { label: 'Settings', to: '/admin/settings', icon: Settings, active: path.startsWith('/admin/settings') },
  ];

  return (
    <div className="min-h-screen bg-soft">
      <header className="sticky top-0 z-40 bg-ink text-white">
        <div className="page flex h-14 items-center justify-between gap-3">
          <Link to="/admin" className="rounded-lg">
            <Logo light suffix="Staff" />
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Staff">
            {tabs.map((t) => (
              <Link
                key={t.to}
                to={t.to}
                aria-current={t.active ? 'page' : undefined}
                className={`relative rounded-lg px-3 py-2 text-[15px] font-medium ${t.active ? 'bg-white/15 text-white' : 'text-white/70 hover:text-white'}`}
              >
                {t.label}
                {!!t.badge && <span className="ml-1.5 rounded-full bg-white px-1.5 text-xs font-bold text-ink">{t.badge}</span>}
              </Link>
            ))}
          </nav>
          <Link to="/" className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-white/10 px-3 text-sm font-semibold text-white hover:bg-white/20">
            View shop
            <ExternalLink size={15} />
          </Link>
        </div>
      </header>

      <main className={hideTabs ? '' : 'pb-bar md:pb-10'}>{children}</main>

      {!hideTabs && (
        <nav aria-label="Staff" className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas md:hidden">
          <div className="grid h-16 grid-cols-5">
            {tabs.map(({ label, to, icon: Icon, active, badge }) => (
              <Link
                key={to}
                to={to}
                aria-current={active ? 'page' : undefined}
                className={`flex flex-col items-center justify-center gap-1 text-[11px] font-medium ${active ? 'text-ink' : 'text-muted'}`}
              >
                <span className="relative">
                  <Icon size={22} strokeWidth={active ? 2.3 : 1.8} />
                  {!!badge && (
                    <span className="absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-sale px-1 text-[10px] font-bold text-white">
                      {badge}
                    </span>
                  )}
                </span>
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

/** Page wrapper used by every staff screen */
export const AdminPage: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  narrow?: boolean;
}> = ({ title, subtitle, action, children, narrow }) => (
  <div className={`page animate-fade-in py-5 md:py-8 ${narrow ? 'max-w-2xl' : 'max-w-4xl'}`}>
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-0.5 text-[15px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
    {children}
  </div>
);
