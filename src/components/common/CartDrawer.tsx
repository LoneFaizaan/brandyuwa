import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartDiscount, 
    cartShipping, 
    cartTotal,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setStorefrontPage
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (cartSubtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-surface border-l border-border flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-surface-container-lowest">
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[20px] text-text-primary">shopping_bag</span>
              <h2 className="font-bold text-sm tracking-wider uppercase text-text-primary">
                Your Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button 
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-secondary hover:text-text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="p-3 bg-surface-container-low border-b border-border">
            <div className="flex justify-between text-[11px] font-medium mb-1">
              <span>
                {remainingForFreeShipping > 0 
                  ? `Add ₹${remainingForFreeShipping} more for FREE shipping`
                  : 'Unlocked FREE Standard Delivery!'}
              </span>
              <span className="font-bold">{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full bg-border h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <span className="material-symbols-outlined text-4xl text-text-muted">shopping_bag</span>
                <p className="text-sm font-semibold text-text-primary">Your bag is empty</p>
                <p className="text-xs text-secondary">Explore our architectural menswear essentials</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setStorefrontPage('shop');
                  }}
                  className="mt-2 inline-block bg-primary text-surface text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-wider"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.product.id}-${item.selectedSize}-${item.selectedColor.name}`}
                  className="flex space-x-3 p-3 bg-surface-container-lowest border border-border rounded-sm"
                >
                  <img 
                    src={item.product.image} 
                    alt={item.product.name}
                    className="w-18 h-24 object-cover object-top rounded-xs bg-surface-container shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-xs text-text-primary leading-tight line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor.name)}
                          className="text-text-muted hover:text-error-sale p-0.5 ml-2"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-[11px] text-secondary">
                        <span>Color: {item.selectedColor.name}</span>
                        <span>•</span>
                        <span className="font-semibold text-text-primary bg-surface-container px-1.5 py-0.2 rounded-xs">
                          Size {item.selectedSize}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-xs">
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.name, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-secondary hover:text-text-primary"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-semibold tabular-nums text-text-primary">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, item.selectedSize, item.selectedColor.name, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-secondary hover:text-text-primary"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <span className="text-xs font-bold text-text-primary tabular-nums">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-border bg-surface-container-lowest space-y-3">
              {/* Coupon input */}
              {activeCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3 py-2 rounded-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Coupon <strong>{activeCoupon.code}</strong> applied (-₹{cartDiscount})</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-emerald-900 underline font-semibold text-[11px]"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex space-x-2">
                    <input 
                      type="text"
                      placeholder="Promo code (e.g. ATELIER10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 bg-surface-container-low border border-border text-xs px-3 py-1.5 uppercase focus:outline-none focus:border-primary"
                    />
                    <button 
                      onClick={() => {
                        if (applyCoupon(couponInput)) {
                          setCouponInput('');
                        }
                      }}
                      className="bg-primary text-surface text-xs font-semibold px-3 py-1.5 rounded-xs hover:bg-neutral-800 transition"
                    >
                      Apply
                    </button>
                  </div>
                  <button 
                    onClick={() => applyCoupon('ATELIER10')}
                    className="text-[10px] text-text-muted hover:text-text-primary transition"
                  >
                    Tip: Tap to use code <span className="font-bold underline">ATELIER10</span> for 10% off
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1 text-xs text-secondary pt-2 border-t border-border">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-text-primary tabular-nums">
                    ₹{cartSubtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-error-sale">
                    <span>Discount ({activeCoupon?.code})</span>
                    <span className="font-medium tabular-nums">-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Delivery</span>
                  <span className="font-medium text-text-primary">
                    {cartShipping === 0 ? 'FREE' : `₹${cartShipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-text-primary pt-2 border-t border-border">
                  <span>Total Due</span>
                  <span className="tabular-nums">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setStorefrontPage('checkout');
                }}
                className="w-full bg-primary hover:bg-neutral-900 active:scale-[0.99] text-surface py-3 px-4 rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition"
              >
                <span>Proceed to Checkout</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
