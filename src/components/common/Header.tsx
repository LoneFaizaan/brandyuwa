import React from 'react';
import { useStore } from '../../context/StoreContext';

const CATEGORIES = [
  'All Items',
  'Shirts',
  'T-Shirts',
  'Jeans',
  'Trousers',
  'Jackets',
  'Overshirts'
];

export const Header: React.FC = () => {
  const { 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsSearchOpen, 
    selectedCategory, 
    setSelectedCategory,
    setStorefrontPage,
    searchQuery,
    setSearchQuery
  } = useStore();

  return (
    <>
      {/* 1. COMPACT ANNOUNCEMENT BAR */}
      <aside 
        aria-label="Store Delivery Alert" 
        className="bg-primary text-surface py-1.5 px-3 text-center text-[11px] font-medium tracking-wide flex items-center justify-center space-x-1.5"
      >
        <span className="material-symbols-outlined text-[13px] text-surface">local_shipping</span>
        <span>Free Delivery above ₹999 • Express Dispatch in 24h</span>
      </aside>

      {/* 2. STREAMLINED HEADER */}
      <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border px-3.5 py-2.5">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => {
              setSelectedCategory('All Items');
              setStorefrontPage('home');
            }}
            className="flex flex-col text-left focus:outline-none"
          >
            <span className="font-bold text-[15px] sm:text-[17px] tracking-wider uppercase text-text-primary leading-none">
              ATELIER RETAIL
            </span>
            <span className="text-[9px] uppercase tracking-widest text-text-muted font-medium mt-0.5">
              Architectural Men's Store
            </span>
          </button>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative items-center">
            <span className="material-symbols-outlined absolute left-3 text-[17px] text-text-muted pointer-events-none">
              search
            </span>
            <input 
              type="search"
              placeholder="Search cotton shirts, raw denim, overshirts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-surface-container-low border border-border rounded-full pl-9 pr-8 py-1.5 text-[13px] text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none transition-colors"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Mobile Search Icon Trigger */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search" 
              className="md:hidden text-text-primary hover:text-secondary p-1"
            >
              <span className="material-symbols-outlined text-[21px]">search</span>
            </button>

            {/* Wishlist */}
            <button 
              onClick={() => {
                setSelectedCategory('All Items');
                setStorefrontPage('shop');
              }}
              aria-label="Wishlist items" 
              className="relative text-text-primary hover:text-secondary p-1"
            >
              <span className="material-symbols-outlined text-[21px]">favorite</span>
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-primary text-surface text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart */}
            <button 
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Cart" 
              className="relative text-text-primary hover:text-secondary p-1"
            >
              <span className="material-symbols-outlined text-[21px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-error-sale text-surface text-[9px] font-semibold w-4 h-4 flex items-center justify-center rounded-full leading-none">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden mt-2 relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 text-[17px] text-text-muted pointer-events-none">
            search
          </span>
          <input 
            type="search"
            placeholder="Search cotton shirts, denim, jackets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-surface-container-low border border-border rounded-sm pl-8 pr-8 py-1.5 text-[12px] text-text-primary placeholder:text-text-muted focus:border-primary focus:bg-surface focus:outline-none transition-colors"
          />
          <button 
            onClick={() => setIsSearchOpen(true)}
            aria-label="Open search dialog"
            className="absolute right-2 text-text-muted hover:text-text-primary p-0.5"
          >
            <span className="material-symbols-outlined text-[16px]">qr_code_scanner</span>
          </button>
        </div>
      </header>

      {/* 3. QUICK CATEGORY TABS */}
      <nav className="bg-surface border-b border-border px-3 overflow-x-auto no-scrollbar flex items-center space-x-5 text-[12px] sm:text-[13px] max-w-6xl mx-auto">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setStorefrontPage('shop');
              }}
              className={`py-2 whitespace-nowrap transition-colors border-b-2 font-medium ${
                isActive 
                  ? 'border-primary text-text-primary font-bold' 
                  : 'border-transparent text-secondary hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </nav>
    </>
  );
};
