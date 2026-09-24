import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Tag, Trash2, X } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link, useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, plural } from '../../lib/format';
import { amountForFreeDelivery, calcTotals } from '../../lib/pricing';
import { STORE_CONFIG } from '../../data/storeConfig';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductImage } from '../../components/common/ProductImage';
import { QuantityStepper } from '../../components/common/QuantityStepper';

export const CartView: React.FC = () => {
  usePageTitle('Bag');
  const { cart, cartCount, cartSubtotal, setCartQuantity, removeFromCart, saved, coupon } = useStore();
  const { navigate } = useRouter();

  if (cart.length === 0) {
    return (
      <div className="page animate-fade-in py-6">
        <EmptyState
          icon={<ShoppingBag size={26} />}
          title="Your bag is empty"
          description="Browse the shop and add the things you like."
          action={
            <div className="flex flex-col items-center gap-3">
              <Link to="/shop" className="btn btn-primary">
                Start shopping
              </Link>
              {saved.length > 0 && (
                <Link to="/saved" className="link text-[15px]">
                  View your {plural(saved.length, 'saved item')}
                </Link>
              )}
            </div>
          }
        />
      </div>
    );
  }

  const totals = calcTotals(cartSubtotal, 'delivery', coupon);
  const toFree = amountForFreeDelivery(cartSubtotal);
  const hasProblem = cart.some((i) => i.quantity > i.available);

  return (
    <div className="animate-fade-in pb-8 md:pb-10">
      <div className="page pt-5 md:pt-8">
        <h1 className="text-2xl font-bold tracking-tight">
          Bag <span className="font-medium text-muted">({cartCount})</span>
        </h1>

        {toFree > 0 ? (
          <div className="mt-4 rounded-xl bg-soft p-4">
            <p className="text-[15px]">
              Add <strong className="tabular">{formatPrice(toFree)}</strong> more for free delivery
            </p>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-line-strong">
              <div
                className="h-full rounded-full bg-ink transition-all"
                style={{ width: `${Math.min(100, (cartSubtotal / STORE_CONFIG.delivery.freeAbove) * 100)}%` }}
              />
            </div>
          </div>
        ) : (
          <p className="mt-4 rounded-xl bg-ok-soft p-4 text-[15px] font-medium text-ok">Your order gets free delivery</p>
        )}

        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_22rem]">
          <ul className="divide-y divide-line border-y border-line">
            {cart.map((item) => {
              const tooMany = item.quantity > item.available;
              return (
                <li key={item.key} className="flex gap-3 py-4 sm:gap-4">
                  <Link to={`/product/${item.productId}`} className="shrink-0">
                    <ProductImage src={item.product.images[0]} alt={item.product.name} className="h-28 w-20 rounded-xl sm:h-32 sm:w-24" />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <Link to={`/product/${item.productId}`} className="line-clamp-2 text-[15px] font-medium leading-snug hover:underline">
                        {item.product.name}
                      </Link>
                      <p className="tabular shrink-0 text-[15px] font-semibold">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                    <p className="mt-1 text-sm text-muted">
                      Size {item.size}
                      {item.color && ` · ${item.color}`}
                      {item.quantity > 1 && ` · ${formatPrice(item.product.price)} each`}
                    </p>
                    {tooMany && (
                      <p className="mt-1.5 text-sm font-medium text-sale">
                        {item.available === 0 ? 'Sold out — please remove it' : `Only ${item.available} left — please lower the quantity`}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                      <QuantityStepper
                        value={item.quantity}
                        min={1}
                        max={Math.max(item.available, item.quantity)}
                        onChange={(q) => setCartQuantity(item.key, Math.min(q, Math.max(item.available, 1)))}
                        label={`quantity of ${item.product.name}`}
                      />
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.key)}
                        className="-mr-2 inline-flex h-10 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-muted hover:text-sale"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 size={17} />
                        <span className="hidden min-[360px]:inline">Remove</span>
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
            {STORE_CONFIG.coupons.length > 0 && <CouponBox />}
            <div className="card p-5">
              <h2 className="text-[15px] font-semibold">Order summary</h2>
              <dl className="mt-3 space-y-2 text-[15px]">
                <div className="flex justify-between">
                  <dt className="text-muted">Items ({cartCount})</dt>
                  <dd className="tabular">{formatPrice(totals.subtotal)}</dd>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-ok">
                    <dt>Discount</dt>
                    <dd className="tabular">−{formatPrice(totals.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted">Delivery</dt>
                  <dd className="tabular">{totals.deliveryFee === 0 ? 'Free' : formatPrice(totals.deliveryFee)}</dd>
                </div>
                <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="tabular">{formatPrice(totals.total)}</dd>
                </div>
              </dl>
              {STORE_CONFIG.delivery.pickup && totals.deliveryFee > 0 && (
                <p className="mt-2 text-sm text-muted">No delivery charge if you pick up from the shop.</p>
              )}
              <button
                type="button"
                disabled={hasProblem}
                onClick={() => navigate('/checkout')}
                className="btn btn-primary mt-5 hidden w-full md:flex"
              >
                Checkout
                <ArrowRight size={18} />
              </button>
            </div>
            <Link to="/shop" className="block text-center text-[15px] font-medium text-muted hover:text-ink">
              Continue shopping
            </Link>
          </aside>
        </div>
      </div>

      {/* Phone checkout bar */}
      <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas md:hidden">
        <div className="flex items-center gap-4 px-4 py-3">
          <div className="shrink-0">
            <p className="text-sm text-muted">Total</p>
            <p className="tabular text-lg font-bold leading-tight">{formatPrice(totals.total)}</p>
          </div>
          <button type="button" disabled={hasProblem} onClick={() => navigate('/checkout')} className="btn btn-primary flex-1">
            Checkout
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const CouponBox: React.FC = () => {
  const { coupon, applyCoupon, removeCoupon, cartSubtotal } = useStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (coupon) {
    const below = cartSubtotal < coupon.minOrder;
    return (
      <div className="card p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="inline-flex items-center gap-2 text-[15px] font-semibold">
            <Tag size={17} />
            {coupon.code} · {coupon.percentOff}% off
          </p>
          <button type="button" onClick={removeCoupon} className="icon-btn -mr-2 h-9 w-9" aria-label="Remove code">
            <X size={17} />
          </button>
        </div>
        {below && (
          <p className="mt-1 text-sm text-warn">
            Add {formatPrice(coupon.minOrder - cartSubtotal)} more to use this code.
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      className="card p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        const err = applyCoupon(code);
        setError(err);
        if (!err) setCode('');
      }}
    >
      <label htmlFor="coupon" className="label">
        Discount code
      </label>
      <div className="flex gap-2">
        <input
          id="coupon"
          value={code}
          onChange={(e) => {
            setCode(e.target.value.toUpperCase());
            setError(null);
          }}
          autoCapitalize="characters"
          autoComplete="off"
          className={`field ${error ? 'field-error' : ''}`}
        />
        <button type="submit" className="btn btn-secondary shrink-0">
          Apply
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </form>
  );
};
