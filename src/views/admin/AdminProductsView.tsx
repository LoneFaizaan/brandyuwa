import React, { useMemo, useState } from 'react';
import { ChevronRight, Plus, Search, Shirt } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, totalStock } from '../../lib/format';
import { STORE_CONFIG } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';
import { ProductImage } from '../../components/common/ProductImage';
import { EmptyState } from '../../components/common/EmptyState';

type Show = 'all' | 'live' | 'hidden' | 'soldout';

export const AdminProductsView: React.FC = () => {
  usePageTitle('Products');
  const { products } = useStore();
  const [q, setQ] = useState('');
  const [show, setShow] = useState<Show>('all');

  const counts = useMemo(
    () => ({
      all: products.length,
      live: products.filter((p) => p.published).length,
      hidden: products.filter((p) => !p.published).length,
      soldout: products.filter((p) => totalStock(p) === 0).length,
    }),
    [products],
  );

  const list = products.filter((p) => {
    const matchesShow =
      show === 'all' || (show === 'live' && p.published) || (show === 'hidden' && !p.published) || (show === 'soldout' && totalStock(p) === 0);
    const term = q.trim().toLowerCase();
    return matchesShow && (!term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
  });

  const tabs: { key: Show; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'live', label: 'In shop' },
    { key: 'hidden', label: 'Hidden' },
    { key: 'soldout', label: 'Sold out' },
  ];

  return (
    <AdminPage
      title="Products"
      subtitle={`${counts.live} in shop`}
      action={
        <Link to="/admin/products/new" className="btn btn-primary btn-sm shrink-0">
          <Plus size={18} />
          Add
        </Link>
      }
    >
      <div className="relative">
        <Search size={19} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search products"
          className="field pl-11"
          aria-label="Search products"
        />
      </div>

      <div className="no-scrollbar -mx-4 mt-3 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setShow(t.key)} aria-pressed={show === t.key} className={`chip ${show === t.key ? 'chip-active' : ''}`}>
            {t.label} <span className={show === t.key ? 'text-white/70' : 'text-muted'}>{counts[t.key]}</span>
          </button>
        ))}
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon={<Shirt size={26} />}
          title="No products yet"
          description="Add your first product. It only takes a photo, a name, a price and sizes."
          action={
            <Link to="/admin/products/new" className="btn btn-primary">
              <Plus size={18} />
              Add a product
            </Link>
          }
        />
      ) : list.length === 0 ? (
        <p className="py-10 text-center text-[15px] text-muted">No products match.</p>
      ) : (
        <ul className="card mt-4 divide-y divide-line overflow-hidden">
          {list.map((p) => {
            const stock = totalStock(p);
            return (
              <li key={p.id}>
                <Link to={`/admin/products/${p.id}`} className="flex items-center gap-3 p-3 hover:bg-soft">
                  <ProductImage src={p.images[0]} alt="" className="h-[4.5rem] w-14 shrink-0 rounded-lg" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] font-medium">{p.name}</p>
                    <p className="text-sm text-muted">
                      {p.category} · <span className="tabular">{formatPrice(p.price)}</span>
                    </p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {!p.published && <span className="badge bg-soft text-muted">Hidden</span>}
                      {stock === 0 ? (
                        <span className="badge bg-sale-soft text-sale">Sold out</span>
                      ) : stock <= STORE_CONFIG.lowStockAt ? (
                        <span className="badge bg-warn-soft text-warn">{stock} left</span>
                      ) : (
                        <span className="text-sm text-muted">{stock} in stock</span>
                      )}
                    </div>
                  </div>
                  <ChevronRight size={20} className="shrink-0 text-faint" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </AdminPage>
  );
};
