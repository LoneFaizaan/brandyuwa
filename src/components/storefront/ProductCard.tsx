import React from 'react';
import { Heart } from 'lucide-react';
import type { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { discountPercent, formatPrice, totalStock } from '../../lib/format';
import { ProductImage } from '../common/ProductImage';

export const PRODUCT_GRID = 'grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4';

export const ProductCard: React.FC<{ product: Product; eager?: boolean }> = ({ product, eager }) => {
  const { isSaved, toggleSaved } = useStore();
  const saved = isSaved(product.id);
  const soldOut = totalStock(product) === 0;
  const off = discountPercent(product);

  return (
    <div className="group relative">
      <Link to={`/product/${product.id}`} className="block rounded-xl">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-soft">
          <ProductImage
            src={product.images[0]}
            alt={product.name}
            eager={eager}
            className={`h-full w-full transition-transform duration-300 group-hover:scale-[1.03] ${soldOut ? 'opacity-60' : ''}`}
          />
          <div className="absolute left-2 top-2 flex flex-col items-start gap-1">
            {soldOut ? (
              <span className="badge bg-canvas text-ink">Sold out</span>
            ) : (
              <>
                {off > 0 && <span className="badge bg-sale text-white">−{off}%</span>}
                {product.isNew && <span className="badge bg-canvas text-ink">New</span>}
              </>
            )}
          </div>
        </div>
        <div className="mt-2.5 px-0.5">
          <h3 className="line-clamp-2 text-[15px] font-medium leading-snug text-ink">{product.name}</h3>
          <p className="mt-1 flex flex-wrap items-baseline gap-x-2">
            <span className="tabular text-[15px] font-semibold">{formatPrice(product.price)}</span>
            {off > 0 && <span className="tabular text-sm text-muted line-through">{formatPrice(product.mrp!)}</span>}
          </p>
          {product.colors.length > 1 && <p className="mt-0.5 text-sm text-muted">{product.colors.length} colours</p>}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => toggleSaved(product.id)}
        aria-pressed={saved}
        aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
        className="absolute right-1.5 top-1.5 flex h-10 w-10 items-center justify-center rounded-full bg-canvas/90 text-ink shadow-sm backdrop-blur transition active:scale-90"
      >
        <Heart size={19} strokeWidth={2} className={saved ? 'animate-pop fill-sale text-sale' : ''} />
      </button>
    </div>
  );
};

/** Horizontally scrolling row of products (swipe on phones). */
export const ProductRail: React.FC<{ products: Product[] }> = ({ products }) => (
  <div className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:scroll-px-6 sm:gap-5 sm:px-6">
    {products.map((p) => (
      <div key={p.id} className="w-[44%] shrink-0 snap-start sm:w-[30%] lg:w-[calc(25%-15px)]">
        <ProductCard product={p} />
      </div>
    ))}
  </div>
);
