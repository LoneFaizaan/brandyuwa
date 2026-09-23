import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductSize, SizeStock } from '../../types';

export const QuickAddProductModal: React.FC = () => {
  const { isQuickAddOpen, setIsQuickAddOpen, addProduct } = useStore();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<'Shirts' | 'T-Shirts' | 'Jeans' | 'Trousers' | 'Jackets' | 'Overshirts'>('Shirts');
  const [sku, setSku] = useState(`AT-${Math.floor(100 + Math.random() * 900)}`);
  const [price, setPrice] = useState(2499);
  const [originalPrice, setOriginalPrice] = useState(3499);
  const [description, setDescription] = useState('Cut from tightly woven Japanese cotton. Designed for versatile seasonal wear.');
  const [fabric, setFabric] = useState('100% Ring-spun Compact Cotton.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80');

  // Stock per size
  const [stocks, setStocks] = useState<Record<ProductSize, number>>({
    XS: 4,
    S: 8,
    M: 12,
    L: 10,
    XL: 6,
    XXL: 2,
    '3XL': 0
  });

  if (!isQuickAddOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const sizeStocks: SizeStock[] = (Object.keys(stocks) as ProductSize[])
      .filter(s => stocks[s] > 0)
      .map(s => ({ size: s, stock: stocks[s] }));

    const totalStock = sizeStocks.reduce((sum, s) => sum + s.stock, 0);
    const discountPercent = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    addProduct({
      name,
      category,
      sku,
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercent,
      image,
      gallery: [image],
      description,
      fabric,
      fit: 'Relaxed modern architectural cut.',
      care: 'Machine wash cold. Line dry in shade.',
      colors: [
        { name: 'Matte Black', hex: '#1A1A1A' },
        { name: 'Natural Sand', hex: '#D6D2CA' }
      ],
      sizes: sizeStocks,
      totalStock,
      isNew: true,
      status: 'Published'
    });

    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm p-4 sm:p-6 flex justify-center items-center">
      <div className="w-full max-w-lg bg-surface border border-border rounded-xs shadow-2xl overflow-hidden my-auto flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border bg-surface-container-lowest flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-[20px] text-text-primary">add_circle</span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-text-primary">
              Quick Add Menswear Piece
            </h3>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            className="text-text-muted hover:text-text-primary p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 text-xs overflow-y-auto max-h-[80vh]">
          {/* Title & Category */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted">Product Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Minimalist Linen Overshirt"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full h-9 px-2 bg-surface-container-lowest border border-border rounded-xs focus:outline-none focus:border-primary"
              >
                <option value="Shirts">Shirts</option>
                <option value="T-Shirts">T-Shirts</option>
                <option value="Jeans">Jeans</option>
                <option value="Trousers">Trousers</option>
                <option value="Jackets">Jackets</option>
                <option value="Overshirts">Overshirts</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">SKU</label>
              <input
                type="text"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs font-mono uppercase"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Selling Price (₹)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs font-bold"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Original / Compare (₹)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs"
              />
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Image URL</label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs font-mono text-[11px]"
            />
          </div>

          {/* Fabric & Fit */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Fabric & Material Spec</label>
            <input
              type="text"
              value={fabric}
              onChange={(e) => setFabric(e.target.value)}
              className="w-full h-9 px-3 bg-surface-container-lowest border border-border rounded-xs"
            />
          </div>

          {/* Inventory Breakdown by Size */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-text-muted block mb-1">Initial Stock Per Size</label>
            <div className="grid grid-cols-6 gap-2">
              {(['S', 'M', 'L', 'XL', 'XXL', '3XL'] as ProductSize[]).map((s) => (
                <div key={s} className="text-center">
                  <span className="text-[10px] font-bold text-text-muted block mb-0.5">{s}</span>
                  <input
                    type="number"
                    min={0}
                    value={stocks[s]}
                    onChange={(e) => setStocks({ ...stocks, [s]: Math.max(0, Number(e.target.value)) })}
                    className="w-full h-8 text-center bg-surface-container-lowest border border-border text-xs font-bold rounded-xs"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-border flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setIsQuickAddOpen(false)}
              className="px-4 py-2 border border-border rounded-xs text-xs font-semibold text-secondary hover:text-text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-surface rounded-xs text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition"
            >
              Publish to Store
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
