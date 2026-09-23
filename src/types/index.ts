export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | '3XL';

export interface ProductColor {
  name: string;
  hex: string;
}

export interface SizeStock {
  size: ProductSize;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  category: 'Shirts' | 'T-Shirts' | 'Jeans' | 'Trousers' | 'Jackets' | 'Overshirts';
  sku: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  description: string;
  fabric: string;
  fit: string;
  care: string;
  colors: ProductColor[];
  sizes: SizeStock[];
  totalStock: number;
  isNew?: boolean;
  isBestseller?: boolean;
  status: 'Published' | 'Draft' | 'Archived';
  salesCount: number;
}

export interface CartItem {
  product: Product;
  selectedColor: ProductColor;
  selectedSize: ProductSize;
  quantity: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  type: 'Home' | 'Work';
}

export interface OrderTimelineStep {
  status: string;
  label: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  status: 'Pending' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  timeline: OrderTimelineStep[];
}

export interface Coupon {
  code: string;
  discountPercent: number;
  minOrderValue: number;
  description: string;
  isActive: boolean;
}

export type ViewMode = 'storefront' | 'admin';

export type StorefrontPage = 
  | 'home'
  | 'shop'
  | 'product'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'order-tracking'
  | 'account';

export type AdminPage = 
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'inventory'
  | 'analytics';
