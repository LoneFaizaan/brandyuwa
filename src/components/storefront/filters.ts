import type { Product } from '../../types';
import { compareSizes } from '../../data/catalog';
import { totalStock } from '../../lib/format';
import { searchProducts } from '../common/SearchModal';

export type SortOption = 'featured' | 'new' | 'price-asc' | 'price-desc';

export interface ShopFilters {
  category: string;
  q: string;
  sort: SortOption;
  size: string;
  maxPrice: number;
  inStock: boolean;
}

export const SORT_LABELS: Record<SortOption, string> = {
  featured: 'Popular',
  new: 'Newest',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

export const PRICE_LIMITS = [500, 1000, 2000, 3000];

export function readFilters(query: URLSearchParams): ShopFilters {
  const sort = query.get('sort') as SortOption;
  return {
    category: query.get('cat') ?? '',
    q: query.get('q') ?? '',
    sort: sort && sort in SORT_LABELS ? sort : 'featured',
    size: query.get('size') ?? '',
    maxPrice: Number(query.get('max')) || 0,
    inStock: query.get('stock') === '1',
  };
}

export function filtersToQuery(f: ShopFilters) {
  const q = new URLSearchParams();
  if (f.category) q.set('cat', f.category);
  if (f.q) q.set('q', f.q);
  if (f.sort !== 'featured') q.set('sort', f.sort);
  if (f.size) q.set('size', f.size);
  if (f.maxPrice) q.set('max', String(f.maxPrice));
  if (f.inStock) q.set('stock', '1');
  const s = q.toString();
  return `/shop${s ? `?${s}` : ''}`;
}

/** Filters other than category and search, shown as a count on the Filter button */
export const extraFilterCount = (f: ShopFilters) => (f.size ? 1 : 0) + (f.maxPrice ? 1 : 0) + (f.inStock ? 1 : 0);

export function applyFilters(products: Product[], f: ShopFilters) {
  let list = f.q ? searchProducts(products, f.q) : products;
  list = list.filter(
    (p) =>
      (!f.category || p.category === f.category) &&
      (!f.maxPrice || p.price <= f.maxPrice) &&
      (!f.size || p.sizes.some((s) => s.size === f.size && (s.stock > 0 || !f.inStock))) &&
      (!f.inStock || totalStock(p) > 0),
  );

  const sorted = [...list];
  if (f.sort === 'price-asc') sorted.sort((a, b) => a.price - b.price);
  else if (f.sort === 'price-desc') sorted.sort((a, b) => b.price - a.price);
  else if (f.sort === 'new') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  else sorted.sort((a, b) => Number(!!b.isFeatured) - Number(!!a.isFeatured));

  // Sold-out items always go last
  return sorted.sort((a, b) => Number(totalStock(a) === 0) - Number(totalStock(b) === 0));
}

export function sizesIn(products: Product[]) {
  return Array.from(new Set(products.flatMap((p) => p.sizes.map((s) => s.size)))).sort(compareSizes);
}
