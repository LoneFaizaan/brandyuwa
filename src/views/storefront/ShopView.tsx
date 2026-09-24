import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice } from '../../lib/format';
import { CATEGORY_NAMES } from '../../data/catalog';
import { PRODUCT_GRID, ProductCard } from '../../components/storefront/ProductCard';
import { FilterSheet } from '../../components/storefront/FilterSheet';
import { EmptyState } from '../../components/common/EmptyState';
import {
  applyFilters,
  extraFilterCount,
  filtersToQuery,
  readFilters,
  ShopFilters,
  SORT_LABELS,
} from '../../components/storefront/filters';

export const ShopView: React.FC = () => {
  const { liveProducts } = useStore();
  const { query, navigate } = useRouter();
  const [filterOpen, setFilterOpen] = useState(false);

  const filters = useMemo(() => readFilters(query), [query]);
  const results = useMemo(() => applyFilters(liveProducts, filters), [liveProducts, filters]);
  const categories = useMemo(() => CATEGORY_NAMES.filter((c) => liveProducts.some((p) => p.category === c)), [liveProducts]);

  const title = filters.q ? `Results for “${filters.q}”` : filters.category || 'All products';
  usePageTitle(filters.q ? `Search: ${filters.q}` : filters.category || 'Shop');

  const update = (patch: Partial<ShopFilters>) => navigate(filtersToQuery({ ...filters, ...patch }), { replace: true });
  const extra = extraFilterCount(filters);

  const activePills = [
    filters.q && { label: `“${filters.q}”`, clear: () => update({ q: '' }) },
    filters.size && { label: `Size ${filters.size}`, clear: () => update({ size: '' }) },
    filters.maxPrice && { label: `Under ${formatPrice(filters.maxPrice)}`, clear: () => update({ maxPrice: 0 }) },
    filters.inStock && { label: 'In stock', clear: () => update({ inStock: false }) },
    filters.sort !== 'featured' && { label: SORT_LABELS[filters.sort], clear: () => update({ sort: 'featured' }) },
  ].filter(Boolean) as { label: string; clear: () => void }[];

  return (
    <div className="animate-fade-in pb-6">
      {/* Category chips stay visible under the header while scrolling */}
      <div className="sticky top-14 z-30 border-b border-line bg-canvas/95 backdrop-blur-md">
        <div className="page no-scrollbar flex gap-2 overflow-x-auto py-3">
          <button
            type="button"
            onClick={() => update({ category: '', size: '' })}
            aria-pressed={!filters.category}
            className={`chip ${!filters.category ? 'chip-active' : ''}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => update({ category: c, size: '' })}
              aria-pressed={filters.category === c}
              className={`chip ${filters.category === c ? 'chip-active' : ''}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="page pt-5">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-sm text-muted">
              {results.length} {results.length === 1 ? 'item' : 'items'}
            </p>
          </div>
          <button type="button" onClick={() => setFilterOpen(true)} className="btn btn-secondary btn-sm shrink-0">
            <SlidersHorizontal size={17} />
            Filter
            {extra > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-ink px-1 text-xs text-white">{extra}</span>
            )}
          </button>
        </div>

        {activePills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activePills.map((pill) => (
              <button key={pill.label} type="button" onClick={pill.clear} className="chip h-9 bg-soft pr-3" aria-label={`Remove filter ${pill.label}`}>
                {pill.label}
                <X size={15} />
              </button>
            ))}
          </div>
        )}

        <div className="mt-6">
          {results.length === 0 ? (
            <EmptyState
              title="No matching products"
              description="Try another category or remove some filters."
              action={
                <button type="button" onClick={() => navigate('/shop', { replace: true })} className="btn btn-primary">
                  Show all products
                </button>
              }
            />
          ) : (
            <div className={PRODUCT_GRID}>
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} eager={i < 4} />
              ))}
            </div>
          )}
        </div>
      </div>

      <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} products={liveProducts} filters={filters} onApply={update} />
    </div>
  );
};
