import React, { useMemo, useState } from 'react';
import { Pencil, Search } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link, useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { totalStock } from '../../lib/format';
import { compareSizes } from '../../data/catalog';
import { STORE_CONFIG } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';
import { ProductImage } from '../../components/common/ProductImage';
import { QuantityStepper } from '../../components/common/QuantityStepper';

type Show = 'all' | 'low' | 'soldout';

const isLow = (t: number) => t > 0 && t <= STORE_CONFIG.lowStockAt;

export const AdminStockView: React.FC = () => {
  usePageTitle('Stock');
  const { products, setStock } = useStore();
  const { query } = useRouter();
  const [show, setShow] = useState<Show>(() => (query.get('show') === 'low' ? 'low' : 'all'));
  const [q, setQ] = useState('');

  // Decide which products to list only when the filter changes, so a product
  // doesn't jump out of "Running low" while you are tapping + on it.
  const visibleIds = useMemo(
    () =>
      new Set(
        products
          .filter((p) => {
            const t = totalStock(p);
            const matchesShow = show === 'all' || (show === 'low' && (isLow(t) || t === 0)) || (show === 'soldout' && t === 0);
            const term = q.trim().toLowerCase();
            return matchesShow && (!term || p.name.toLowerCase().includes(term));
          })
          .map((p) => p.id),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show, q],
  );
  const list = products.filter((p) => visibleIds.has(p.id));

  const tabs: { key: Show; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'low', label: 'Running low' },
    { key: 'soldout', label: 'Sold out' },
  ];

  return (
    <AdminPage title="Stock" subtitle="Tap + when new stock arrives and − when you sell in the shop.">
      <div className="relative">
        <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="field pl-11" aria-label="Search products" />
      </div>
      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setShow(t.key)} aria-pressed={show === t.key} className={`chip ${show === t.key ? 'chip-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-10 text-center text-[15px] text-muted">{show === 'all' ? 'No products found.' : 'Nothing to restock right now.'}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((p) => {
            const t = totalStock(p);
            const sizes = [...p.sizes].sort((a, b) => compareSizes(a.size, b.size));
            return (
              <li key={p.id} className="card p-4">
                <div className="flex items-center gap-3">
                  <ProductImage src={p.images[0]} alt="" className="h-16 w-12 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-semibold">{p.name}</p>
                    <p className={`text-sm ${t === 0 ? 'font-medium text-sale' : isLow(t) ? 'font-medium text-warn' : 'text-muted'}`}>
                      {t === 0 ? 'Sold out' : `${t} in stock`}
                    </p>
                  </div>
                  <Link to={`/admin/products/${p.id}`} className="icon-btn" aria-label={`Edit ${p.name}`}>
                    <Pencil size={18} />
                  </Link>
                </div>
                {sizes.length === 0 ? (
                  <p className="mt-3 text-sm text-muted">
                    No sizes yet.{' '}
                    <Link to={`/admin/products/${p.id}`} className="link">
                      Add sizes
                    </Link>
                  </p>
                ) : (
                  <ul className="mt-3 grid gap-x-6 sm:grid-cols-2">
                    {sizes.map((s) => (
                      <li key={s.size} className="flex items-center justify-between gap-3 border-t border-line py-2">
                        <span className={`text-[15px] font-semibold ${s.stock === 0 ? 'text-sale' : ''}`}>{s.size}</span>
                        <QuantityStepper
                          value={s.stock}
                          onChange={(v) => setStock(p.id, s.size, v)}
                          label={`${p.name} size ${s.size} stock`}
                          max={9999}
                          editable
                          size="lg"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </AdminPage>
  );
};
