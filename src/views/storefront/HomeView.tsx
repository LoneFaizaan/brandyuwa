import React, { useMemo } from 'react';
import { ArrowRight, Banknote, RotateCcw, Store, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { isStoreOpenNow, usePageTitle } from '../../lib/hooks';
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
  const { hero } = STORE_CONFIG;
  const open = isStoreOpenNow();

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
      {/* Phones: shop photo on top, text below. Larger screens: text panel beside the photo. */}
      <section className="page">
        <div className="relative grid overflow-hidden rounded-2xl bg-brand-navy-dark md:grid-cols-2">
          <div className="relative h-72 overflow-hidden sm:h-96 md:order-2 md:h-[34rem]">
            <img
              src={hero.image}
              srcSet={`${hero.imageSmall} 720w, ${hero.image} 1088w`}
              sizes="(min-width: 768px) 50vw, 100vw"
              width={1088}
              height={1445}
              alt={`Inside the ${STORE_CONFIG.name} shop in ${STORE_CONFIG.address.locality}`}
              fetchPriority="high"
              className="absolute inset-0 h-full w-full animate-hero-photo object-cover object-[center_45%] will-change-transform md:object-[center_38%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent via-40% to-transparent md:bg-gradient-to-r md:from-brand-navy-dark/50 md:via-transparent md:to-transparent"
            />
          </div>

          <div className="flex flex-col justify-center bg-gradient-to-br from-brand-navy to-brand-navy-dark p-5 pb-6 sm:p-8 md:p-12 lg:p-14">
            <p
              className="inline-flex w-fit animate-hero-rise items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[13px] font-medium text-white backdrop-blur-sm"
              style={{ animationDelay: '150ms' }}
            >
              <span className={`h-2 w-2 rounded-full ${open ? 'bg-emerald-400' : 'bg-white/50'}`} />
              {open ? 'Open now' : 'Closed now'} · {STORE_CONFIG.address.locality}, {STORE_CONFIG.address.city}
            </p>
            <p className="mt-4 animate-hero-rise font-script text-2xl text-brand-gold-light sm:text-3xl" style={{ animationDelay: '300ms' }}>
              {STORE_CONFIG.tagline}
            </p>
            <h1
              className="mt-1 max-w-lg animate-hero-rise text-[2rem] font-bold leading-[1.1] tracking-tight text-white sm:text-5xl"
              style={{ animationDelay: '420ms' }}
            >
              {hero.title}
            </h1>
            <p
              className="mt-3 max-w-md animate-hero-rise text-[15px] leading-relaxed text-white/85 sm:text-base"
              style={{ animationDelay: '540ms' }}
            >
              {hero.subtitle}
            </p>
            <div className="mt-6 flex animate-hero-rise flex-wrap gap-3" style={{ animationDelay: '660ms' }}>
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
