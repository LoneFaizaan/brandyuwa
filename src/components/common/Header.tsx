import React from 'react';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import { Link, useRouter } from '../../lib/router';
import { useStore } from '../../context/StoreContext';
import { STORE_CONFIG } from '../../data/storeConfig';
import { formatPrice } from '../../lib/format';
import { Logo } from './Logo';

const NAV = [
  { label: 'Home', to: '/' },
  { label: 'Shop', to: '/shop' },
  { label: 'My orders', to: '/orders' },
  { label: 'Visit store', to: '/contact' },
];

const CountBadge: React.FC<{ count: number }> = ({ count }) =>
  count > 0 ? (
    <span className="tabular absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-ink px-1 text-[11px] font-semibold leading-none text-white">
      {count > 99 ? '99+' : count}
    </span>
  ) : null;

export const Header: React.FC = () => {
  const { path } = useRouter();
  const { cartCount, saved, setSearchOpen } = useStore();

  const isActive = (to: string) => (to === '/' ? path === '/' : path.startsWith(to));

  return (
    <>
      <div className="bg-ink px-4 py-2 text-center text-[13px] font-medium text-white">
        Free delivery above {formatPrice(STORE_CONFIG.delivery.freeAbove)}
        {STORE_CONFIG.payments.cashOnDelivery && ' · Cash on delivery'}
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="page flex h-14 items-center justify-between gap-3">
          <Link to="/" aria-label={`${STORE_CONFIG.name} home`} className="rounded-lg shrink-0">
            <Logo />
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-lg px-3 py-2 text-[15px] font-medium transition-colors ${
                  isActive(item.to) ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
                aria-current={isActive(item.to) ? 'page' : undefined}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="-mr-2 flex items-center">
            <button type="button" onClick={() => setSearchOpen(true)} className="icon-btn" aria-label="Search">
              <Search size={22} strokeWidth={1.9} />
            </button>
            <Link to="/saved" className="icon-btn relative hidden md:inline-flex" aria-label={`Saved items (${saved.length})`}>
              <Heart size={22} strokeWidth={1.9} />
              <CountBadge count={saved.length} />
            </Link>
            <Link to="/cart" className="icon-btn relative" aria-label={`Bag (${cartCount} items)`}>
              <ShoppingBag size={22} strokeWidth={1.9} />
              <CountBadge count={cartCount} />
            </Link>
          </div>
        </div>
      </header>
    </>
  );
};
