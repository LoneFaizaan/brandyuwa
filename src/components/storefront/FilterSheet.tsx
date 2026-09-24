import React, { useEffect, useMemo, useState } from 'react';
import type { Product } from '../../types';
import { formatPrice } from '../../lib/format';
import { Modal } from '../common/Modal';
import { Switch } from '../common/Switch';
import { applyFilters, PRICE_LIMITS, ShopFilters, SORT_LABELS, SortOption, sizesIn } from './filters';

interface FilterSheetProps {
  open: boolean;
  onClose: () => void;
  products: Product[];
  filters: ShopFilters;
  onApply: (filters: ShopFilters) => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({ open, onClose, products, filters, onApply }) => {
  const [draft, setDraft] = useState(filters);

  // Start from the current filters each time the sheet opens
  useEffect(() => {
    if (open) setDraft(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const sizes = useMemo(
    () => sizesIn(draft.category ? products.filter((p) => p.category === draft.category) : products),
    [products, draft.category],
  );
  const count = useMemo(() => applyFilters(products, draft).length, [products, draft]);
  const set = (patch: Partial<ShopFilters>) => setDraft((d) => ({ ...d, ...patch }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Filter & sort"
      footer={
        <div className="flex gap-3">
          <button
            type="button"
            className="btn btn-secondary flex-1"
            onClick={() => set({ sort: 'featured', size: '', maxPrice: 0, inStock: false })}
          >
            Clear
          </button>
          <button
            type="button"
            className="btn btn-primary flex-[2]"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            {count === 0 ? 'No matches' : `Show ${count} ${count === 1 ? 'item' : 'items'}`}
          </button>
        </div>
      }
    >
      <div className="space-y-7 p-5">
        <FilterGroup title="Sort by">
          {(Object.keys(SORT_LABELS) as SortOption[]).map((s) => (
            <button key={s} type="button" onClick={() => set({ sort: s })} aria-pressed={draft.sort === s} className={`chip ${draft.sort === s ? 'chip-active' : ''}`}>
              {SORT_LABELS[s]}
            </button>
          ))}
        </FilterGroup>

        {sizes.length > 1 && (
          <FilterGroup title="Size">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => set({ size: draft.size === s ? '' : s })}
                aria-pressed={draft.size === s}
                className={`chip min-w-[3.25rem] justify-center ${draft.size === s ? 'chip-active' : ''}`}
              >
                {s}
              </button>
            ))}
          </FilterGroup>
        )}

        <FilterGroup title="Price">
          <button type="button" onClick={() => set({ maxPrice: 0 })} aria-pressed={!draft.maxPrice} className={`chip ${!draft.maxPrice ? 'chip-active' : ''}`}>
            Any price
          </button>
          {PRICE_LIMITS.map((limit) => (
            <button
              key={limit}
              type="button"
              onClick={() => set({ maxPrice: limit })}
              aria-pressed={draft.maxPrice === limit}
              className={`chip ${draft.maxPrice === limit ? 'chip-active' : ''}`}
            >
              Under {formatPrice(limit)}
            </button>
          ))}
        </FilterGroup>

        <div className="border-t border-line pt-2">
          <Switch checked={draft.inStock} onChange={(v) => set({ inStock: v })} label="Only show items in stock" />
        </div>
      </div>
    </Modal>
  );
};

const FilterGroup: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <fieldset>
    <legend className="mb-3 text-[15px] font-semibold">{title}</legend>
    <div className="flex flex-wrap gap-2">{children}</div>
  </fieldset>
);
