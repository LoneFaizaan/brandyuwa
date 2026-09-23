import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

const POPULAR_SEARCHES = ['Heavy Twill Overshirt', 'Oxford Shirt', 'Selvedge Denim', 'Bomber', 'Trousers'];

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    products, 
    setSelectedProductId, 
    setStorefrontPage 
  } = useStore();

  const [term, setTerm] = useState('');

  if (!isSearchOpen) return null;

  const filtered = term.trim() === '' 
    ? [] 
    : products.filter(p => 
        p.name.toLowerCase().includes(term.toLowerCase()) || 
        p.category.toLowerCase().includes(term.toLowerCase()) ||
        p.description.toLowerCase().includes(term.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm p-4 sm:p-6 md:p-20 flex justify-center items-start">
      <div className="w-full max-w-2xl bg-surface border border-border shadow-2xl rounded-sm overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-border bg-surface-container-lowest flex items-center space-x-3">
          <span className="material-symbols-outlined text-[22px] text-text-muted">search</span>
          <input
            type="search"
            autoFocus
            placeholder="Search Atelier collection (e.g. Oxford, Selvedge, Overshirt)..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="flex-1 bg-transparent border-none text-sm text-text-primary placeholder:text-text-muted focus:outline-none"
          />
          {term && (
            <button onClick={() => setTerm('')} className="p-1 text-text-muted hover:text-text-primary">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button 
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold uppercase tracking-wider text-secondary hover:text-text-primary px-2 py-1"
          >
            Esc
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Popular searches suggestions */}
          {term.trim() === '' && (
            <div className="space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                Popular Searches
              </h4>
              <div className="flex flex-wrap gap-2">
                {POPULAR_SEARCHES.map(tag => (
                  <button
                    key={tag}
                    onClick={() => setTerm(tag)}
                    className="text-xs bg-surface-container-low hover:bg-surface-container border border-border px-3 py-1.5 rounded-full text-text-primary transition"
                  >
                    {tag}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-3">
                  Featured Items
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {products.slice(0, 3).map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setStorefrontPage('product');
                        setIsSearchOpen(false);
                      }}
                      className="text-left group"
                    >
                      <div className="aspect-[3/4] bg-surface-container overflow-hidden rounded-xs">
                        <img 
                          src={p.image} 
                          alt={p.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      </div>
                      <p className="text-xs font-semibold text-text-primary mt-1.5 line-clamp-1">{p.name}</p>
                      <p className="text-[11px] font-bold text-text-primary tabular-nums">₹{p.price.toLocaleString('en-IN')}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Results list */}
          {term.trim() !== '' && (
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">
                  Results ({filtered.length})
                </span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <span className="material-symbols-outlined text-3xl text-text-muted">search_off</span>
                  <p className="text-sm font-medium text-text-primary">No pieces found matching "{term}"</p>
                  <p className="text-xs text-text-muted">Try checking for spelling or searching for generic categories like Shirts, Jackets, or Denim.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filtered.map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSelectedProductId(item.id);
                        setStorefrontPage('product');
                        setIsSearchOpen(false);
                      }}
                      className="w-full py-3 flex items-center space-x-3 text-left hover:bg-surface-container-low px-2 transition rounded-xs"
                    >
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-16 object-cover rounded-xs bg-surface-container shrink-0" 
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-text-muted block">
                          {item.category}
                        </span>
                        <h4 className="text-xs font-bold text-text-primary truncate">{item.name}</h4>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <span className="text-xs font-bold text-text-primary tabular-nums">₹{item.price.toLocaleString('en-IN')}</span>
                          {item.originalPrice > item.price && (
                            <span className="text-[10px] text-text-muted line-through tabular-nums">₹{item.originalPrice.toLocaleString('en-IN')}</span>
                          )}
                        </div>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-text-muted">arrow_forward</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
