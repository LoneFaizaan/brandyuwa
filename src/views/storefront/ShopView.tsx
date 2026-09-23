import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../../components/storefront/ProductCard';

export const ShopView: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    setStorefrontPage 
  } = useStore();

  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [inStockOnly, setInStockOnly] = useState(false);

  // Filter products by category and stock
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'All Items' || p.category === selectedCategory;
      const matchStock = inStockOnly ? p.totalStock > 0 : true;
      return matchCategory && matchStock;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0; // recommended
    });
  }, [products, selectedCategory, inStockOnly, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-[11px] text-text-muted">
        <button 
          onClick={() => setStorefrontPage('home')}
          className="hover:text-text-primary uppercase tracking-wider"
        >
          Home
        </button>
        <span>/</span>
        <button 
          onClick={() => setSelectedCategory('All Items')}
          className="hover:text-text-primary uppercase tracking-wider"
        >
          Shop
        </button>
        {selectedCategory !== 'All Items' && (
          <>
            <span>/</span>
            <span className="text-text-primary font-bold uppercase tracking-wider">
              {selectedCategory}
            </span>
          </>
        )}
      </nav>

      {/* Header & Result Count */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-border pb-4 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text-primary">
            {selectedCategory}
          </h1>
          <p className="text-xs text-secondary mt-1">
            Displaying {filteredProducts.length} architectural menswear pieces
          </p>
        </div>

        {/* Sort and Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* In-Stock Toggle */}
          <label className="flex items-center space-x-2 cursor-pointer bg-surface-container-low border border-border px-3 py-1.5 rounded-full">
            <input 
              type="checkbox" 
              checked={inStockOnly} 
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded border-border text-primary focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-text-primary font-medium">In Stock Only</span>
          </label>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-1.5 bg-surface-container-low border border-border px-3 py-1.5 rounded-full">
            <span className="text-text-muted">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-text-primary font-medium focus:outline-none cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-20 space-y-3 bg-surface-container-low border border-border rounded-xs">
          <span className="material-symbols-outlined text-4xl text-text-muted">checkroom</span>
          <h3 className="text-base font-bold text-text-primary">No pieces found in this category</h3>
          <p className="text-xs text-secondary">Try switching category or clearing the in-stock filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('All Items');
              setInStockOnly(false);
            }}
            className="bg-primary text-surface text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider"
          >
            Show All Items
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
