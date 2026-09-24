import React, { useMemo } from 'react';
import { ArrowRight, Banknote, RotateCcw, Store, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, totalStock } from '../../lib/format';
import { STORE_CONFIG } from '../../data/storeConfig';
import { CATEGORY_NAMES } from '../../data/catalog';
import { PRODUCT_GRID, ProductCard, ProductRail } from '../../components/storefront/ProductCard';
import { StoreInfoCard } from '../../components/storefront/StoreInfoCard';
import { ProductImage } from '../../components/common/ProductImage';
import { EmptyState } from '../../components/common/EmptyState';

export const HomeView: React.FC = () => {
  usePageTitle();
  const { liveProducts } = useStore();

  const categories = useMemo(
    () =>
      CATEGORY_NAMES.map((name) => ({ name, cover: liveProducts.find((p) => p.category === name && p.images[0])?.images[0] })).filter(
        (c) => liveProducts.some((p) => p.category === c.name),
      ),
    [liveProducts],
  );

  const inStock = liveProducts.filter((p) => totalStock(p) > 0);
  const newArrivals = [...inStock]
    .filter((p) => p.isNew)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 8);
  const popular = inStock.filter((p) => p.isFeatured).slice(0, 8);
  const popularOrAll = popular.length > 0 ? popular : inStock.slice(0, 8);

  const promises = [
    { icon: Truck, title: 'Free delivery', text: `On orders above ${formatPrice(STORE_CONFIG.delivery.freeAbove)}` },
    STORE_CONFIG.payments.cashOnDelivery && { icon: Banknote, title: 'Cash on delivery', text: 'Pay when it arrives' },
    { icon: RotateCcw, title: `${STORE_CONFIG.exchangeDays}-day exchange`, text: 'Wrong size? Swap it' },
    STORE_CONFIG.delivery.pickup && { icon: Store, title: 'Free pickup', text: `From our shop in ${STORE_CONFIG.address.city}` },
  ].filter(Boolean) as { icon: typeof Truck; title: string; text: string }[];

  return (
    <div className="animate-fade-in space-y-10 pb-4 pt-4 sm:space-y-14 sm:pt-6">
      {/* Hero */}
      <section className="page">
        <div className="relative overflow-hidden rounded-2xl bg-ink">
          <img
            src={STORE_CONFIG.hero.image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_30%] opacity-80"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />
          <div className="relative flex min-h-[26rem] flex-col justify-end p-5 sm:min-h-[30rem] sm:p-10">
            <p className="text-sm font-medium text-white/80">
              {STORE_CONFIG.address.locality}, {STORE_CONFIG.address.city}
            </p>
            <h1 className="mt-2 max-w-lg text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl">
              {STORE_CONFIG.hero.title}
            </h1>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/85 sm:text-base">{STORE_CONFIG.hero.subtitle}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/shop" className="btn bg-white text-ink hover:bg-white/90">
                Shop now
                <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="btn border border-white/40 text-white hover:bg-white/10">
                Visit the shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {liveProducts.length === 0 ? (
        <EmptyState title="New stock is on its way" description="Check back soon, or visit our shop to see what's in store." />
      ) : (
        <>
          {/* Categories */}
          {categories.length > 1 && (
            <section className="page">
              <SectionHeader title="Shop by category" to="/shop" />
              <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 sm:-mx-6 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible sm:px-6 lg:grid-cols-8">
                {categories.map((c) => (
                  <Link key={c.name} to={`/shop?cat=${encodeURIComponent(c.name)}`} className="group w-[5.5rem] shrink-0 text-center sm:w-auto">
                    <ProductImage
                      src={c.cover}
                      alt=""
                      className="aspect-square w-full rounded-2xl transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span className="mt-2 block text-sm font-medium">{c.name}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* New arrivals */}
          {newArrivals.length > 0 && (
            <section className="page">
              <SectionHeader title="New arrivals" to="/shop?sort=new" />
              <ProductRail products={newArrivals} />
            </section>
          )}

          {/* Why buy here */}
          <section className="page">
            <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              {promises.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex flex-col gap-2 rounded-2xl bg-soft p-4 sm:flex-row sm:items-center sm:gap-3">
                  <Icon size={22} strokeWidth={1.8} className="shrink-0" />
                  <div>
                    <p className="text-[15px] font-semibold leading-tight">{title}</p>
                    <p className="mt-0.5 text-sm text-muted">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Popular */}
          {popularOrAll.length > 0 && (
            <section className="page">
              <SectionHeader title="Popular right now" to="/shop" />
              <div className={PRODUCT_GRID}>
                {popularOrAll.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link to="/shop" className="btn btn-secondary">
                  See all {liveProducts.length} products
                  <ArrowRight size={18} />
                </Link>
              </div>
            </section>
          )}
        </>
      )}

      {/* Visit the shop */}
      <section className="page">
        <div className="mx-auto max-w-xl">
          <StoreInfoCard />
        </div>
      </section>
    </div>
  );
};

const SectionHeader: React.FC<{ title: string; to: string }> = ({ title, to }) => (
  <div className="mb-4 flex items-end justify-between gap-4">
    <h2 className="section-title">{title}</h2>
    <Link to={to} className="-mr-2 inline-flex shrink-0 items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-semibold text-ink hover:bg-soft">
      See all
      <ArrowRight size={16} />
    </Link>
  </div>
);
