import React from 'react';
import { Heart, House, LayoutGrid, Package, Phone } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { useStore } from '../../context/StoreContext';

/** Phone-only tab bar, within thumb reach. */
export const BottomNav: React.FC = () => {
  const { path } = useRouter();
  const { saved } = useStore();

  const items = [
    { label: 'Home', to: '/', icon: House, active: path === '/' },
    { label: 'Shop', to: '/shop', icon: LayoutGrid, active: path.startsWith('/shop') },
    { label: 'Saved', to: '/saved', icon: Heart, active: path === '/saved', badge: saved.length },
    { label: 'Orders', to: '/orders', icon: Package, active: path.startsWith('/orders') || path.startsWith('/order-placed') },
    { label: 'Contact', to: '/contact', icon: Phone, active: path === '/contact' },
  ];

  return (
    <nav
      aria-label="Main"
      className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas/95 backdrop-blur-md md:hidden"
    >
      <div className="grid h-16 grid-cols-5">
        {items.map(({ label, to, icon: Icon, active, badge }) => (
          <Link
            key={to}
            to={to}
            aria-current={active ? 'page' : undefined}
            className={`relative flex flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors ${
              active ? 'text-ink' : 'text-muted'
            }`}
          >
            <span className="relative">
              <Icon size={22} strokeWidth={active ? 2.3 : 1.8} className={active && label === 'Saved' ? 'fill-ink' : ''} />
              {!!badge && (
                <span className="tabular absolute -right-2.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10px] font-semibold leading-none text-white">
                  {badge > 99 ? '99+' : badge}
                </span>
              )}
            </span>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
};
