import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const AdminProductsView: React.FC = () => {
  const { products, setIsQuickAddOpen, setSelectedProductId, setViewMode, setStorefrontPage } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [catFilter, setCatFilter] = useState('All');

  const filtered = products.filter(p => {
    const matchCat = catFilter === 'All' || p.category === catFilter;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 gap-3">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">
            Product Catalog ({products.length})
          </h2>
          <p className="text-xs text-secondary mt-0.5">
            Manage menswear garments, pricing tiers, and active publish states
          </p>
        </div>
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="bg-primary text-surface px-4 py-2 rounded-xs text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-neutral-800 transition"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-2 text-text-muted text-[17px]">
            search
          </span>
          <input
            type="text"
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-surface-container-lowest border border-border rounded-xs text-xs focus:outline-none focus:border-primary"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <span className="text-text-muted">Category:</span>
          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            className="h-9 px-2 bg-surface-container-lowest border border-border rounded-xs focus:outline-none focus:border-primary"
          >
            <option value="All">All Categories</option>
            <option value="Shirts">Shirts</option>
            <option value="T-Shirts">T-Shirts</option>
            <option value="Jeans">Jeans</option>
            <option value="Trousers">Trousers</option>
            <option value="Jackets">Jackets</option>
            <option value="Overshirts">Overshirts</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-border rounded-xs overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="bg-surface-container-low text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <th className="py-2.5 px-3">Product</th>
              <th className="py-2.5 px-3">SKU</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3 text-right">Price</th>
              <th className="py-2.5 px-3 text-center">Total Stock</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-surface/60 transition">
                <td className="py-3 px-3 flex items-center space-x-3 min-w-[200px]">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-10 h-13 object-cover rounded-xs bg-surface-container shrink-0"
                  />
                  <div>
                    <span className="font-bold text-text-primary block line-clamp-1">{p.name}</span>
                    <span className="text-[10px] text-text-muted">{p.colors.map(c => c.name).join(', ')}</span>
                  </div>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-text-muted">{p.sku}</td>
                <td className="py-3 px-3 font-medium">{p.category}</td>
                <td className="py-3 px-3 text-right font-bold tabular-nums">
                  ₹{p.price.toLocaleString('en-IN')}
                </td>
                <td className="py-3 px-3 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    p.totalStock === 0 
                      ? 'bg-red-100 text-red-800' 
                      : p.totalStock < 15 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {p.totalStock} units
                  </span>
                </td>
                <td className="py-3 px-3 text-center">
                  <span className="bg-neutral-100 text-neutral-800 text-[10px] font-bold px-2 py-0.5 rounded-xs border border-neutral-200">
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-3 text-right">
                  <button
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setViewMode('storefront');
                      setStorefrontPage('product');
                    }}
                    className="p-1 text-secondary hover:text-text-primary"
                    title="View on Live Storefront"
                  >
                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
