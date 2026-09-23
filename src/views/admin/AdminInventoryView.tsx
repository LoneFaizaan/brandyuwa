import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductSize } from '../../types';

export const AdminInventoryView: React.FC = () => {
  const { products, updateStock, lowStockCount } = useStore();
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<string>('All');

  const totalUnits = products.reduce((acc, p) => acc + p.totalStock, 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.price * p.totalStock), 0);
  const outOfStockCount = products.filter(p => p.sizes.some(s => s.stock === 0)).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary">
          Warehouse Inventory Management
        </h2>
        <p className="text-xs text-secondary mt-0.5">
          Real-time stock tracking by variant, inward adjustments, and reorder levels
        </p>
      </div>

      {/* Inventory KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] uppercase font-bold text-text-muted">Total Stock Units</span>
          <p className="text-xl font-bold text-text-primary tabular-nums mt-1">{totalUnits} units</p>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] uppercase font-bold text-text-muted">Inventory Valuation</span>
          <p className="text-xl font-bold text-text-primary tabular-nums mt-1">₹{totalValuation.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] uppercase font-bold text-amber-700">Low Stock Variants</span>
          <p className="text-xl font-bold text-amber-700 tabular-nums mt-1">{lowStockCount} items</p>
        </div>
        <div className="bg-surface-container-lowest border border-border p-4 rounded-xs">
          <span className="text-[10px] uppercase font-bold text-red-700">Stockout Risk</span>
          <p className="text-xl font-bold text-red-700 tabular-nums mt-1">{outOfStockCount} styles</p>
        </div>
      </div>

      {/* Real-time Inventory Table */}
      <div className="bg-surface-container-lowest border border-border rounded-xs overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-border bg-surface flex justify-between items-center text-xs">
          <span className="font-bold uppercase tracking-wider text-text-primary">
            Variant Stock Matrix
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-text-muted">Size Filter:</span>
            <select
              value={selectedSizeFilter}
              onChange={(e) => setSelectedSizeFilter(e.target.value)}
              className="bg-surface-container-low border border-border px-2 py-1 rounded-xs"
            >
              <option value="All">All Sizes</option>
              <option value="S">Size S</option>
              <option value="M">Size M</option>
              <option value="L">Size L</option>
              <option value="XL">Size XL</option>
              <option value="XXL">Size XXL</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-border">
          {products.map((p) => (
            <div key={p.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Product Info */}
              <div className="flex items-center space-x-3 min-w-[240px]">
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-12 h-16 object-cover rounded-xs bg-surface-container shrink-0"
                />
                <div>
                  <h4 className="font-bold text-xs text-text-primary">{p.name}</h4>
                  <p className="text-[11px] font-mono text-text-muted">{p.sku} • {p.category}</p>
                  <p className="text-[10px] text-secondary mt-0.5">
                    Total: <strong>{p.totalStock}</strong> in warehouse
                  </p>
                </div>
              </div>

              {/* Size Stocks Adjusters */}
              <div className="flex-1 flex flex-wrap items-center gap-2">
                {p.sizes
                  .filter(s => selectedSizeFilter === 'All' || s.size === selectedSizeFilter)
                  .map((s) => (
                    <div 
                      key={s.size} 
                      className={`flex items-center border rounded-xs p-1.5 text-xs ${
                        s.stock === 0 
                          ? 'border-red-300 bg-red-50 text-red-900' 
                          : s.stock <= 4 
                          ? 'border-amber-300 bg-amber-50 text-amber-900' 
                          : 'border-border bg-surface'
                      }`}
                    >
                      <span className="w-6 font-bold text-center text-[11px]">{s.size}</span>
                      <div className="flex items-center space-x-1 pl-1 border-l border-border/60">
                        <button
                          onClick={() => updateStock(p.id, s.size, s.stock - 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white border border-border rounded-xs hover:bg-neutral-100 font-bold"
                          title="Reduce stock (-1)"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-bold tabular-nums text-xs">
                          {s.stock}
                        </span>
                        <button
                          onClick={() => updateStock(p.id, s.size, s.stock + 1)}
                          className="w-5 h-5 flex items-center justify-center bg-white border border-border rounded-xs hover:bg-neutral-100 font-bold"
                          title="Inward stock (+1)"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Status Indicator */}
              <div className="text-right shrink-0">
                <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider ${
                  p.totalStock === 0
                    ? 'bg-red-100 text-red-800'
                    : p.totalStock < 10
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {p.totalStock === 0 ? 'Out of Stock' : p.totalStock < 10 ? 'Low Stock' : 'Healthy'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
