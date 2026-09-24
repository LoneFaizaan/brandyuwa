import React, { useMemo, useRef, useState } from 'react';
import { Banknote, ChevronRight, EyeOff, Heart, RotateCcw, Ruler, Share2, Store, Truck } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link, useRouter } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { discountPercent, formatPrice, totalStock } from '../../lib/format';
import { compareSizes, getCategory } from '../../data/catalog';
import { colorImages } from '../../types';
import { STORE_CONFIG } from '../../data/storeConfig';
import { productQuestionLink, siteLink } from '../../lib/orderMessages';
import { ProductRail } from '../../components/storefront/ProductCard';
import { ProductImage } from '../../components/common/ProductImage';
import { SizeGuideModal } from '../../components/common/SizeGuideModal';
import { WhatsAppIcon } from '../../components/common/SocialIcons';
import { NotFoundView } from './NotFoundView';

export const ProductDetailView: React.FC<{ productId: string }> = ({ productId }) => {
  const { getProduct, liveProducts, addToCart, cart, isSaved, toggleSaved, isStaff, showToast } = useStore();
  const { navigate } = useRouter();
  const product = getProduct(productId);
  const visible = !!product && (product.published || isStaff);

  const sizes = useMemo(() => [...(product?.sizes ?? [])].sort((a, b) => compareSizes(a.size, b.size)), [product]);
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0].size : '');
  const [color, setColor] = useState(product?.colors[0]?.name);
  const [imageIndex, setImageIndex] = useState(0);
  const [sizeError, setSizeError] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const sizeRef = useRef<HTMLFieldSetElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  usePageTitle(visible ? product.name : 'Product not found');

  const related = useMemo(() => {
    if (!product) return [];
    const others = liveProducts.filter((p) => p.id !== product.id && totalStock(p) > 0);
    const same = others.filter((p) => p.category === product.category);
    return [...same, ...others.filter((p) => p.category !== product.category)].slice(0, 8);
  }, [liveProducts, product]);

  if (!visible) {
    return <NotFoundView title="This product is not available" description="It may have sold out or been removed from the shop." />;
  }

  // A colour with its own photos shows only those; otherwise show every photo
  const selectedColorImages = colorImages(product.colors.find((c) => c.name === color) ?? { name: '', hex: '' }).filter((src) =>
    product.images.includes(src),
  );
  const images = selectedColorImages.length > 0 ? selectedColorImages : product.images.length > 0 ? product.images : [''];
  const off = discountPercent(product);
  const soldOut = totalStock(product) === 0;
  const selected = sizes.find((s) => s.size === size);
  const chart = getCategory(product.category).chart;
  const saved = isSaved(product.id);

  const showImage = (index: number) => {
    const el = galleryRef.current;
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setImageIndex(index);
  };

  const pickColor = (name: string) => {
    setColor(name);
    galleryRef.current?.scrollTo({ left: 0 });
    setImageIndex(0);
  };

  const pickSize = (value: string) => {
    setSize(value);
    setSizeError(false);
  };

  const ensureSize = () => {
    if (size) return true;
    setSizeError(true);
    sizeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return false;
  };

  const addToBag = () => {
    if (ensureSize()) addToCart(product.id, size, color);
  };

  const buyNow = () => {
    if (!ensureSize()) return;
    const alreadyInBag = cart.some((i) => i.productId === product.id && i.size === size && i.color === color);
    if (alreadyInBag || addToCart(product.id, size, color)) navigate('/checkout');
  };

  const share = async () => {
    const url = siteLink(`/product/${product.id}`);
    try {
      if (navigator.share) await navigator.share({ title: product.name, text: `${product.name} – ${formatPrice(product.price)}`, url });
      else {
        await navigator.clipboard.writeText(url);
        showToast('Link copied');
      }
    } catch {
      /* share sheet closed */
    }
  };

  return (
    <div className="animate-fade-in pb-8 md:pb-10">
      {!product.published && (
        <div className="bg-warn-soft px-4 py-3 text-center text-sm font-medium text-warn">
          <EyeOff size={16} className="mr-1.5 inline -translate-y-px" />
          Hidden from customers.{' '}
          <Link to={`/admin/products/${product.id}`} className="underline">
            Edit product
          </Link>
        </div>
      )}

      <div className="page pt-3 md:pt-8">
        <nav aria-label="Breadcrumb" className="mb-3 flex items-center gap-1 text-sm text-muted">
          <Link to="/shop" className="rounded px-1 py-1 hover:text-ink">
            Shop
          </Link>
          <ChevronRight size={14} />
          <Link to={`/shop?cat=${encodeURIComponent(product.category)}`} className="rounded px-1 py-1 hover:text-ink">
            {product.category}
          </Link>
        </nav>

        <div className="grid gap-6 md:grid-cols-2 md:gap-10 lg:gap-14">
          {/* Photos */}
          <div className="md:sticky md:top-20 md:self-start">
            <div className="relative -mx-4 sm:mx-0">
              <div
                ref={galleryRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  setImageIndex(Math.round(el.scrollLeft / el.clientWidth));
                }}
                className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto sm:rounded-2xl"
              >
                {images.map((src, i) => (
                  <ProductImage
                    key={i}
                    src={src}
                    alt={`${product.name}${images.length > 1 ? ` – photo ${i + 1}` : ''}`}
                    eager={i === 0}
                    className="aspect-[4/5] w-full shrink-0 snap-center"
                  />
                ))}
              </div>
              {images.length > 1 && (
                <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5 sm:hidden">
                  {images.map((_, i) => (
                    <span key={i} className={`h-1.5 rounded-full transition-all ${i === imageIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/60'}`} />
                  ))}
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="no-scrollbar mt-3 hidden gap-2 overflow-x-auto sm:flex">
                {images.map((src, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => showImage(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === imageIndex}
                    className={`shrink-0 overflow-hidden rounded-xl border-2 ${i === imageIndex ? 'border-ink' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <ProductImage src={src} alt="" className="h-24 w-20" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-2xl font-bold leading-tight tracking-tight sm:text-3xl">{product.name}</h1>
              <button type="button" onClick={share} className="icon-btn -mr-2 -mt-1" aria-label="Share">
                <Share2 size={20} />
              </button>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="tabular text-2xl font-semibold">{formatPrice(product.price)}</span>
              {off > 0 && (
                <>
                  <span className="tabular text-base text-muted line-through">{formatPrice(product.mrp!)}</span>
                  <span className="badge bg-sale-soft text-sale">{off}% off</span>
                </>
              )}
            </div>
            <p className="mt-1 text-sm text-muted">Inclusive of all taxes</p>

            {product.colors.length > 0 && (
              <fieldset className="mt-6">
                <legend className="mb-2.5 text-[15px]">
                  <span className="font-semibold">Colour:</span> <span className="text-muted">{color}</span>
                </legend>
                <div className="flex flex-wrap gap-2.5">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => pickColor(c.name)}
                      aria-pressed={color === c.name}
                      aria-label={c.name}
                      title={c.name}
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                        color === c.name ? 'border-ink' : 'border-transparent hover:border-line-strong'
                      }`}
                    >
                      <span className="h-8 w-8 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            {!soldOut && (
              <fieldset ref={sizeRef} className="mt-6 scroll-mt-24">
                <div className="mb-2.5 flex items-center justify-between">
                  <legend className="text-[15px] font-semibold">
                    {sizes.length === 1 ? 'Size' : 'Choose your size'}
                  </legend>
                  {chart !== 'none' && (
                    <button
                      type="button"
                      onClick={() => setGuideOpen(true)}
                      className="-mr-2 inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:text-ink"
                    >
                      <Ruler size={16} />
                      Size guide
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
                  {sizes.map((s) => {
                    const out = s.stock <= 0;
                    return (
                      <button
                        key={s.size}
                        type="button"
                        disabled={out}
                        onClick={() => pickSize(s.size)}
                        aria-pressed={size === s.size}
                        className={`h-12 rounded-xl border text-[15px] font-semibold transition ${
                          size === s.size
                            ? 'border-ink bg-ink text-white'
                            : out
                              ? 'cursor-not-allowed border-line bg-soft text-faint line-through'
                              : sizeError
                                ? 'border-sale/60 bg-canvas text-ink'
                                : 'border-line-strong bg-canvas text-ink hover:border-ink'
                        } ${sizes.length === 1 ? 'col-span-2' : ''}`}
                      >
                        {s.size}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 min-h-[1.25rem] text-sm" aria-live="polite">
                  {sizeError ? (
                    <span className="font-medium text-sale">Please choose a size first</span>
                  ) : selected && selected.stock <= 3 ? (
                    <span className="font-medium text-warn">Only {selected.stock} left in this size</span>
                  ) : null}
                </p>
              </fieldset>
            )}

            {soldOut && (
              <div className="mt-6 rounded-xl bg-soft p-4 text-[15px]">
                <p className="font-semibold">Sold out</p>
                <p className="mt-0.5 text-muted">Message us and we'll tell you when it's back.</p>
              </div>
            )}

            {/* Actions: fixed to the bottom on phones, inline on larger screens */}
            <div className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-line bg-canvas px-4 pt-3 md:static md:mt-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
              <div className="flex gap-2 pb-3 md:pb-0">
                <button
                  type="button"
                  onClick={() => toggleSaved(product.id)}
                  aria-pressed={saved}
                  aria-label={saved ? 'Remove from saved' : 'Save for later'}
                  className="btn btn-secondary w-12 shrink-0 px-0"
                >
                  <Heart size={20} className={saved ? 'fill-sale text-sale' : ''} />
                </button>
                {soldOut ? (
                  <a
                    href={productQuestionLink(product)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-whatsapp flex-1"
                  >
                    <WhatsAppIcon size={18} />
                    Ask when it's back
                  </a>
                ) : (
                  <>
                    <button type="button" onClick={addToBag} className="btn btn-secondary flex-1 px-3">
                      Add to bag
                    </button>
                    <button type="button" onClick={buyNow} className="btn btn-primary flex-1 px-3">
                      Buy now
                    </button>
                  </>
                )}
              </div>
            </div>

            {!soldOut && (
              <a
                href={productQuestionLink(product, size, color)}
                target="_blank"
                rel="noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl py-2 text-[15px] font-medium text-whatsapp hover:bg-ok-soft"
              >
                <WhatsAppIcon size={18} />
                Questions? Ask us on WhatsApp
              </a>
            )}

            {(product.description || product.fabric) && (
              <section className="mt-6 border-t border-line pt-6">
                <h2 className="text-[15px] font-semibold">Product details</h2>
                {product.description && <p className="mt-2 whitespace-pre-line text-[15px] leading-relaxed text-ink-2">{product.description}</p>}
                {product.fabric && (
                  <p className="mt-3 text-[15px]">
                    <span className="text-muted">Fabric:</span> {product.fabric}
                  </p>
                )}
              </section>
            )}

            <ul className="mt-6 space-y-3 border-t border-line pt-6 text-[15px]">
              <li className="flex gap-3">
                <Truck size={20} className="shrink-0 text-muted" />
                <span>
                  Free delivery above {formatPrice(STORE_CONFIG.delivery.freeAbove)}, otherwise {formatPrice(STORE_CONFIG.delivery.fee)}.
                  Usually arrives in {STORE_CONFIG.delivery.estimate}.
                </span>
              </li>
              {STORE_CONFIG.delivery.pickup && (
                <li className="flex gap-3">
                  <Store size={20} className="shrink-0 text-muted" />
                  <span>Free pickup from our shop in {STORE_CONFIG.address.locality}, {STORE_CONFIG.address.city}.</span>
                </li>
              )}
              {STORE_CONFIG.payments.cashOnDelivery && (
                <li className="flex gap-3">
                  <Banknote size={20} className="shrink-0 text-muted" />
                  <span>Cash on delivery available.</span>
                </li>
              )}
              <li className="flex gap-3">
                <RotateCcw size={20} className="shrink-0 text-muted" />
                <span>
                  Size exchange within {STORE_CONFIG.exchangeDays} days.{' '}
                  <Link to="/returns" className="link">
                    How it works
                  </Link>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {related.length > 0 && (
          <section className="mt-12 border-t border-line pt-8">
            <h2 className="section-title mb-4">You may also like</h2>
            <ProductRail products={related} />
          </section>
        )}
      </div>

      <SizeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} chart={chart} />
    </div>
  );
};
