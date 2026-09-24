/** The one list of categories used by the shop, filters and the staff product form. */

export type SizeChart = 'tops' | 'waist' | 'none';

export interface Category {
  name: string;
  sizes: string[];
  chart: SizeChart;
}

const TOP_SIZES = ['S', 'M', 'L', 'XL', 'XXL', '3XL'];
const WAIST_SIZES = ['28', '30', '32', '34', '36', '38', '40'];
export const FREE_SIZE = 'Free size';

export const CATEGORIES: Category[] = [
  { name: 'Shirts', sizes: TOP_SIZES, chart: 'tops' },
  { name: 'T-Shirts', sizes: TOP_SIZES, chart: 'tops' },
  { name: 'Jeans', sizes: WAIST_SIZES, chart: 'waist' },
  { name: 'Trousers', sizes: WAIST_SIZES, chart: 'waist' },
  { name: 'Jackets', sizes: TOP_SIZES, chart: 'tops' },
  { name: 'Winterwear', sizes: TOP_SIZES, chart: 'tops' },
  { name: 'Kurtas', sizes: TOP_SIZES, chart: 'tops' },
  { name: 'Accessories', sizes: [FREE_SIZE], chart: 'none' },
];

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);

export const getCategory = (name: string): Category =>
  CATEGORIES.find((c) => c.name === name) ?? { name, sizes: TOP_SIZES, chart: 'tops' };

/** Size order used when sorting sizes for display */
const SIZE_ORDER = [...['XS'], ...TOP_SIZES, ...WAIST_SIZES, FREE_SIZE];
export const compareSizes = (a: string, b: string) => {
  const ia = SIZE_ORDER.indexOf(a);
  const ib = SIZE_ORDER.indexOf(b);
  if (ia === -1 && ib === -1) return a.localeCompare(b, undefined, { numeric: true });
  if (ia === -1) return 1;
  if (ib === -1) return -1;
  return ia - ib;
};

/** Common colours the shopkeeper can tap to add */
export const COLOR_SWATCHES = [
  { name: 'Black', hex: '#1a1a1a' },
  { name: 'White', hex: '#ffffff' },
  { name: 'Grey', hex: '#9ca3af' },
  { name: 'Charcoal', hex: '#3f3f46' },
  { name: 'Navy', hex: '#1e2a44' },
  { name: 'Blue', hex: '#3b6fb6' },
  { name: 'Sky Blue', hex: '#a7c7e7' },
  { name: 'Green', hex: '#2f6b3a' },
  { name: 'Olive', hex: '#5b5e3a' },
  { name: 'Beige', hex: '#d9ccb4' },
  { name: 'Brown', hex: '#6b4a32' },
  { name: 'Maroon', hex: '#6d1f2b' },
  { name: 'Red', hex: '#c0392b' },
  { name: 'Yellow', hex: '#e8c547' },
];
