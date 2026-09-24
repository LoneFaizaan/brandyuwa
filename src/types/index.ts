export interface ProductColor {
  name: string;
  hex: string;
  /** Photos (from the product's images) shown when this colour is picked */
  images?: string[];
  /** Older single-photo field, still read for saved products */
  image?: string;
}

export const colorImages = (c: ProductColor): string[] => c.images ?? (c.image ? [c.image] : []);

export interface SizeStock {
  size: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  /** Printed price (MRP). Only shown when higher than `price`. */
  mrp?: number;
  /** First image is the cover photo. */
  images: string[];
  description: string;
  fabric?: string;
  colors: ProductColor[];
  sizes: SizeStock[];
  isNew?: boolean;
  isFeatured?: boolean;
  /** Hidden products are only visible in the staff area. */
  published: boolean;
  createdAt: string;
}

/** What is stored for each line in the bag. Product details are looked up live. */
export interface CartLine {
  productId: string;
  size: string;
  color?: string;
  quantity: number;
}

export interface CartItem extends CartLine {
  key: string;
  product: Product;
  /** Units available for this size right now */
  available: number;
}

export interface Address {
  line1: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address?: Address;
}

export type Fulfilment = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'upi' | 'store';
export type OrderStatus = 'new' | 'packed' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  image?: string;
  price: number;
  size: string;
  color?: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  customer: { name: string; phone: string };
  fulfilment: Fulfilment;
  address?: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  deliveryFee: number;
  total: number;
  payment: PaymentMethod;
  paid: boolean;
  status: OrderStatus;
  history: { status: OrderStatus; at: string }[];
  note?: string;
}

export interface Coupon {
  code: string;
  percentOff: number;
  minOrder: number;
}
