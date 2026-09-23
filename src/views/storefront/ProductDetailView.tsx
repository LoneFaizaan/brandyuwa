import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductSize, ProductColor } from '../../types';
import { ProductCard } from '../../components/storefront/ProductCard';

export const ProductDetailView: React.FC = () => {
  const { 
    selectedProductId, 
    getProductById, 
    products, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setStorefrontPage, 
    setIsCartOpen,
    showToast 
  } = useStore();

  const product = getProductById(selectedProductId) || products[0];

  // States
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState<ProductColor>(product.colors[0] || { name: 'Default', hex: '#000000' });
  const [selectedSize, setSelectedSize] = useState<ProductSize>(
    product.sizes.find(s => s.stock > 0)?.size || product.sizes[0].size
  );
  const [quantity, setQuantity] = useState(1);
  const [pincode, setPincode] = useState('560038');
  const [pincodeMessage, setPincodeMessage] = useState<string | null>(
    'Express dispatch available to 560038 • Expected Friday, Oct 24'
  );

  // Active size stock
  const currentSizeObj = product.sizes.find(s => s.size === selectedSize);
  const currentStock = currentSizeObj ? currentSizeObj.stock : 0;
  const isLiked = isInWishlist(product.id);

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeMessage(`Express dispatch available to ${pincode} • Expected in 2–3 business days`);
      showToast('Delivery service confirmed', 'success');
    } else {
      setPincodeMessage('Please enter a valid 6-digit PIN code');
    }
  };

  const handleAddToCart = () => {
    if (currentStock <= 0) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (currentStock <= 0) {
      showToast('Selected size is currently out of stock', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    setStorefrontPage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const relatedProducts = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-12">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <button
          onClick={() => setStorefrontPage('shop')}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-secondary hover:text-text-primary uppercase tracking-wider"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to Collection</span>
        </button>
        <span className="text-[11px] font-mono text-text-muted">SKU: {product.sku}</span>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: Product Image Gallery */}
        <div className="md:col-span-6 space-y-3">
          {/* Main Visual */}
          <div className="relative aspect-[3/4] bg-surface-container overflow-hidden rounded-xs border border-border">
            <img
              src={product.gallery[selectedImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover object-top"
            />
            {product.discountPercent > 0 && (
              <span className="absolute top-3 left-3 bg-error-sale text-surface text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                -{product.discountPercent}% Off
              </span>
            )}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-text-primary shadow-sm active:scale-95"
            >
              <span className={`material-symbols-outlined text-[20px] ${isLiked ? 'text-error-sale fill' : 'text-text-primary'}`}>
                favorite
              </span>
            </button>
          </div>

          {/* Thumbnail Rail */}
          {product.gallery.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-18 h-24 shrink-0 rounded-xs overflow-hidden border-2 transition ${
                    selectedImageIndex === idx ? 'border-primary' : 'border-border opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Detail & Purchase Controls */}
        <div className="md:col-span-6 space-y-6">
          {/* Brand & Title */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Atelier • {product.category}
              </span>
              <span className="text-border">•</span>
              <div className="flex items-center space-x-1 text-amber-600 text-xs font-semibold">
                <span className="material-symbols-outlined text-[15px] fill">star</span>
                <span>{product.rating}</span>
                <span className="text-text-muted">({product.reviewCount} reviews)</span>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text-primary leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price & Stock Badge */}
          <div className="flex items-baseline space-x-3 pb-4 border-b border-border">
            <span className="text-2xl font-bold text-text-primary tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-sm text-text-muted line-through tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            <span className="text-xs text-text-muted font-medium">Inclusive of all taxes</span>
          </div>

          {/* Color Selector */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold uppercase tracking-wider text-text-muted">Color:</span>
              <span className="font-bold text-text-primary">{selectedColor.name}</span>
            </div>
            <div className="flex space-x-3">
              {product.colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c)}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition ${
                    selectedColor.name === c.name ? 'border-primary ring-2 ring-primary ring-offset-2' : 'border-border'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                >
                  {selectedColor.name === c.name && (
                    <span className="material-symbols-outlined text-[16px] text-white mix-blend-difference">
                      check
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold uppercase tracking-wider text-text-muted">Size:</span>
              <span className="text-[11px] text-secondary font-medium">Model is 6'1" wearing size L</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((s) => {
                const isSelected = selectedSize === s.size;
                const isOutOfStock = s.stock <= 0;
                return (
                  <button
                    key={s.size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(s.size)}
                    className={`py-3 text-center text-xs font-bold uppercase rounded-xs border transition ${
                      isSelected
                        ? 'bg-primary text-surface border-primary'
                        : isOutOfStock
                        ? 'bg-surface-container-low text-text-muted/40 border-border line-through cursor-not-allowed'
                        : 'bg-surface-container-lowest text-text-primary border-border hover:border-primary'
                    }`}
                  >
                    <div>{s.size}</div>
                    <div className="text-[9px] font-normal mt-0.5 opacity-80">
                      {isOutOfStock ? 'Sold out' : s.stock <= 4 ? `${s.stock} left` : 'In stock'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              {/* Quantity Adjuster */}
              <div className="flex items-center border border-border rounded-full bg-surface-container-lowest h-12 px-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-full flex items-center justify-center text-text-primary hover:text-secondary font-bold"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-bold tabular-nums text-text-primary">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(currentStock || 5, quantity + 1))}
                  className="w-8 h-full flex items-center justify-center text-text-primary hover:text-secondary font-bold"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                disabled={currentStock <= 0}
                onClick={handleAddToCart}
                className="flex-1 bg-primary hover:bg-neutral-900 active:scale-[0.99] text-surface h-12 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-sm disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>{currentStock <= 0 ? 'Sold Out' : 'Add to Bag'}</span>
              </button>
            </div>

            {/* Direct Buy Now */}
            <button
              disabled={currentStock <= 0}
              onClick={handleBuyNow}
              className="w-full bg-surface-container-lowest border border-primary text-text-primary hover:bg-surface-container-low active:scale-[0.99] h-12 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Instant Checkout</span>
              <span className="material-symbols-outlined text-[16px]">bolt</span>
            </button>
          </div>

          {/* Pincode checker */}
          <div className="p-3.5 bg-surface-container-low border border-border rounded-xs space-y-2">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-text-primary uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px]">local_shipping</span>
              <span>Delivery & Availability Check</span>
            </div>
            <form onSubmit={handlePincodeCheck} className="flex space-x-2">
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 bg-surface-container-lowest border border-border px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-surface px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-xs"
              >
                Check
              </button>
            </form>
            {pincodeMessage && (
              <p className="text-[11px] text-secondary flex items-center space-x-1">
                <span className="material-symbols-outlined text-[14px] text-emerald-700">check_circle</span>
                <span>{pincodeMessage}</span>
              </p>
            )}
          </div>

          {/* Accordion Specs */}
          <div className="divide-y divide-border border-y border-border text-xs">
            <details className="py-3 group cursor-pointer" open>
              <summary className="font-bold uppercase tracking-wider flex justify-between items-center text-text-primary list-none">
                <span>Fabric & Structural Specifications</span>
                <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="pt-2 text-secondary space-y-1.5 leading-relaxed">
                <p><strong>Fabric:</strong> {product.fabric}</p>
                <p><strong>Fit:</strong> {product.fit}</p>
                <p><strong>Description:</strong> {product.description}</p>
              </div>
            </details>

            <details className="py-3 group cursor-pointer">
              <summary className="font-bold uppercase tracking-wider flex justify-between items-center text-text-primary list-none">
                <span>Care Instructions</span>
                <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="pt-2 text-secondary leading-relaxed">
                <p>{product.care}</p>
              </div>
            </details>

            <details className="py-3 group cursor-pointer">
              <summary className="font-bold uppercase tracking-wider flex justify-between items-center text-text-primary list-none">
                <span>14-Day Hassle-Free Returns</span>
                <span className="material-symbols-outlined text-[18px] group-open:rotate-180 transition-transform">
                  expand_more
                </span>
              </summary>
              <div className="pt-2 text-secondary leading-relaxed">
                <p>Complimentary reverse pickup arranged from your doorstep. Full refund credited within 24 hours of warehouse receipt.</p>
              </div>
            </details>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="pt-8 border-t border-border">
          <div className="flex justify-between items-end mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
                Complete The Wardrobe
              </span>
              <h2 className="text-xl font-bold uppercase tracking-tight text-text-primary mt-0.5">
                Related {product.category}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
