import React, { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Clock, Search, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useRouter } from '../../lib/router';
import { KEYS, load, remove, save } from '../../lib/storage';
import { formatPrice } from '../../lib/format';
import { CATEGORY_NAMES } from '../../data/catalog';
import type { Product } from '../../types';
import { Modal } from './Modal';
import { ProductImage } from './ProductImage';

/** Every word typed must appear in the name, category, colour or description. */
export function searchProducts(products: Product[], term: string) {
  const words = term.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  return products.filter((p) => {
    const haystack = [p.name, p.category, p.description, p.fabric ?? '', ...p.colors.map((c) => c.name)].join(' ').toLowerCase();
    return words.every((w) => haystack.includes(w));
  });
}

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setSearchOpen, liveProducts } = useStore();
  const { navigate } = useRouter();
  const [term, setTerm] = useState('');
  const [recent, setRecent] = useState<string[]>(() => load<string[]>(KEYS.recentSearches) ?? []);

  const results = useMemo(() => searchProducts(liveProducts, term), [liveProducts, term]);
  const categories = useMemo(
    () => CATEGORY_NAMES.filter((c) => liveProducts.some((p) => p.category === c)),
    [liveProducts],
  );

  useEffect(() => {
    if (isSearchOpen) setTerm('');
  }, [isSearchOpen]);

  const close = () => setSearchOpen(false);

  const remember = (value: string) => {
    const v = value.trim();
    if (!v) return;
    const next = [v, ...recent.filter((r) => r.toLowerCase() !== v.toLowerCase())].slice(0, 6);
    setRecent(next);
    save(KEYS.recentSearches, next);
  };

  const go = (to: string) => {
    close();
    navigate(to);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!term.trim()) return;
    remember(term);
    go(`/shop?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <Modal open={isSearchOpen} onClose={close} title="Search" tall wide>
      <div className="sticky top-0 z-10 border-b border-line bg-canvas p-4">
        <form onSubmit={submit} role="search" className="relative">
          <Search size={20} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            autoFocus
            enterKeyHint="search"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Shirts, jeans, black t-shirt…"
            className="field pl-12 pr-12 [&::-webkit-search-cancel-button]:hidden"
            aria-label="Search products"
          />
          {term && (
            <button
              type="button"
              onClick={() => setTerm('')}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-ink"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </form>
      </div>

      <div className="p-4">
        {!term.trim() ? (
          <div className="space-y-6">
            {recent.length > 0 && (
              <section>
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-muted">Recent searches</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setRecent([]);
                      remove(KEYS.recentSearches);
                    }}
                    className="rounded-lg px-2 py-1 text-sm font-medium text-muted hover:text-ink"
                  >
                    Clear
                  </button>
                </div>
                <ul>
                  {recent.map((r) => (
                    <li key={r}>
                      <button
                        type="button"
                        onClick={() => setTerm(r)}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-3 text-left text-[15px] hover:bg-soft"
                      >
                        <Clock size={18} className="text-faint" />
                        {r}
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {categories.length > 0 && (
              <section>
                <h3 className="mb-3 text-sm font-semibold text-muted">Browse categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <button key={c} type="button" onClick={() => go(`/shop?cat=${encodeURIComponent(c)}`)} className="chip">
                      {c}
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : results.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-[15px] font-medium">Nothing found for “{term.trim()}”</p>
            <p className="mt-1 text-sm text-muted">Try a simpler word like “shirt” or “jeans”.</p>
          </div>
        ) : (
          <>
            <p className="mb-2 text-sm text-muted">
              {results.length} {results.length === 1 ? 'result' : 'results'}
            </p>
            <ul className="divide-y divide-line">
              {results.slice(0, 12).map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => {
                      remember(term);
                      go(`/product/${p.id}`);
                    }}
                    className="flex w-full items-center gap-3 py-3 text-left"
                  >
                    <ProductImage src={p.images[0]} alt="" className="h-16 w-12 shrink-0 rounded-lg" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[15px] font-medium">{p.name}</span>
                      <span className="text-sm text-muted">{p.category}</span>
                    </span>
                    <span className="tabular shrink-0 text-[15px] font-semibold">{formatPrice(p.price)}</span>
                  </button>
                </li>
              ))}
            </ul>
            {results.length > 12 && (
              <button type="button" onClick={submit} className="btn btn-secondary mt-4 w-full">
                See all {results.length} results
                <ArrowRight size={18} />
              </button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
