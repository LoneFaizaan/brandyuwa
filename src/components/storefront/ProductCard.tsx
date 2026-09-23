import React, { useState } from 'react';
import { Product, ProductSize } from '../../types';
import { useStore } from '../../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProductId, 
    setStorefrontPage, 
    toggleWishlist, 
    isInWishlist, 
    addToCart 
  } = useStore();

  const isLiked = isInWishlist(product.id);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const handleCardClick = () => {
    setSelectedProductId(product.id);
    setStorefrontPage('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleQuickAdd = (e: React.MouseEvent, size: ProductSize) => {
    e.stopPropagation();
    addToCart(product, size, product.colors[selectedColorIndex], 1);
  };

  return (
    <div className="group bg-surface-container-lowest border border-border rounded-xs overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md">
      {/* Image & Badges */}
      <div 
        onClick={handleCardClick}
        className="relative aspect-[3/4] bg-surface-container overflow-hidden cursor-pointer"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-top transition duration-500 group-hover:scale-105"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col space-y-1">
          {product.isNew && (
            <span className="bg-primary text-surface text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              New
            </span>
          )}
          {product.discountPercent > 0 && (
            <span className="bg-error-sale text-surface text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              -{product.discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-primary hover:text-error-sale shadow-sm transition active:scale-90"
        >
          <span 
            className={`material-symbols-outlined text-[18px] ${isLiked ? 'text-error-sale fill' : 'text-text-primary'}`}
          >
            favorite
          </span>
        </button>

        {/* Quick Add Overlay on Hover (Desktop) */}
        <div className="hidden sm:flex absolute inset-x-0 bottom-0 bg-surface/95 backdrop-blur-sm border-t border-border p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200 justify-between items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">
            Quick Add:
          </span>
          <div className="flex space-x-1">
            {product.sizes.map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={(e) => handleQuickAdd(e, s.size)}
                className={`text-[10px] font-bold px-1.5 py-0.5 border rounded-xs transition ${
                  s.stock === 0
                    ? 'border-border text-border line-through cursor-not-allowed'
                    : 'border-border bg-surface-container-lowest hover:bg-primary hover:text-surface text-text-primary'
                }`}
                title={s.stock === 0 ? 'Out of stock' : `Add size ${s.size}`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Color Swatches */}
          <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
            <span className="uppercase tracking-wider font-semibold">{product.category}</span>
            <div className="flex items-center space-x-1">
              {product.colors.map((color, idx) => (
                <button
                  key={color.name}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  className={`w-2.5 h-2.5 rounded-full border ${
                    selectedColorIndex === idx ? 'border-primary ring-1 ring-primary' : 'border-neutral-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={handleCardClick}
            className="font-medium text-xs sm:text-sm text-text-primary line-clamp-1 cursor-pointer hover:underline"
          >
            {product.name}
          </h3>
        </div>

        {/* Pricing Lockup */}
        <div className="mt-2 pt-2 border-t border-border flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-bold text-xs sm:text-sm text-text-primary tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-[11px] text-text-muted line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
          <span className="text-[10px] text-text-muted font-medium flex items-center space-x-0.5">
            <span className="material-symbols-outlined text-[13px] text-amber-500 fill">star</span>
            <span>{product.rating}</span>
          </span>
        </div>

        {/* Mobile Quick Add Size Row */}
        <div className="sm:hidden mt-2 pt-2 border-t border-border/60 flex items-center justify-between">
          <span className="text-[9px] uppercase tracking-wider text-text-muted font-semibold">Sizes:</span>
          <div className="flex space-x-1">
            {product.sizes.slice(0, 4).map((s) => (
              <button
                key={s.size}
                disabled={s.stock === 0}
                onClick={(e) => handleQuickAdd(e, s.size)}
                className={`text-[9px] font-bold px-1.5 py-0.5 border rounded-xs ${
                  s.stock === 0
                    ? 'border-border text-border line-through'
                    : 'border-border bg-surface-container-low text-text-primary active:bg-primary active:text-surface'
                }`}
              >
                {s.size}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
