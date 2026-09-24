import { createClient } from '@supabase/supabase-js';
import type { Order, OrderStatus, Product, SizeStock } from '../types';

export const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL || 'https://qypufzpwfixkhkofojaz.supabase.co';
export const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF5cHVmenB3Zml4a2hrb2ZvamF6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAyNTQ1NTMsImV4cCI6MjEwNTgzMDU1M30.YpGUD9T0CgTdvwkdsAkfuzEvDlCdhYKvvkESflt7F5E';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/* ───────────────────────── Database Mappers ───────────────────────── */

export interface DbProductRow {
  id: string;
  name: string;
  category: string;
  price: number;
  mrp?: number | null;
  images: any;
  description: string;
  fabric?: string | null;
  colors: any;
  sizes: any;
  is_new: boolean;
  is_featured: boolean;
  published: boolean;
  created_at: string;
}

export function toProduct(row: DbProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    price: Number(row.price),
    mrp: row.mrp ? Number(row.mrp) : undefined,
    images: Array.isArray(row.images) ? row.images : [],
    description: row.description || '',
    fabric: row.fabric || undefined,
    colors: Array.isArray(row.colors) ? row.colors : [],
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    isNew: Boolean(row.is_new),
    isFeatured: Boolean(row.is_featured),
    published: row.published !== false,
    createdAt: row.created_at || new Date().toISOString(),
  };
}

export function toProductRow(p: Product): DbProductRow {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: p.price,
    mrp: p.mrp ?? null,
    images: p.images ?? [],
    description: p.description ?? '',
    fabric: p.fabric ?? null,
    colors: p.colors ?? [],
    sizes: p.sizes ?? [],
    is_new: Boolean(p.isNew),
    is_featured: Boolean(p.isFeatured),
    published: p.published !== false,
    created_at: p.createdAt || new Date().toISOString(),
  };
}

export interface DbOrderRow {
  id: string;
  created_at: string;
  customer: any;
  fulfilment: string;
  address?: any;
  items: any;
  subtotal: number;
  discount: number;
  coupon_code?: string | null;
  delivery_fee: number;
  total: number;
  payment: string;
  paid: boolean;
  status: string;
  history: any;
  note?: string | null;
}

export function toOrder(row: DbOrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    customer: row.customer || { name: '', phone: '' },
    fulfilment: (row.fulfilment as any) || 'delivery',
    address: row.address || undefined,
    items: Array.isArray(row.items) ? row.items : [],
    subtotal: Number(row.subtotal) || 0,
    discount: Number(row.discount) || 0,
    couponCode: row.coupon_code || undefined,
    deliveryFee: Number(row.delivery_fee) || 0,
    total: Number(row.total) || 0,
    payment: (row.payment as any) || 'cod',
    paid: Boolean(row.paid),
    status: (row.status as OrderStatus) || 'new',
    history: Array.isArray(row.history) ? row.history : [{ status: 'new', at: row.created_at }],
    note: row.note || undefined,
  };
}

export function toOrderRow(o: Order): DbOrderRow {
  return {
    id: o.id,
    created_at: o.createdAt,
    customer: o.customer,
    fulfilment: o.fulfilment,
    address: o.address ?? null,
    items: o.items,
    subtotal: o.subtotal,
    discount: o.discount,
    coupon_code: o.couponCode ?? null,
    delivery_fee: o.deliveryFee,
    total: o.total,
    payment: o.payment,
    paid: o.paid,
    status: o.status,
    history: o.history,
    note: o.note ?? null,
  };
}

/* ───────────────────────── Database Operations ───────────────────────── */

export async function fetchProductsFromDb(): Promise<Product[] | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchProducts error:', error);
      return null;
    }
    return (data as DbProductRow[]).map(toProduct);
  } catch (err) {
    console.warn('Supabase fetchProducts exception:', err);
    return null;
  }
}

export async function upsertProductDb(product: Product): Promise<boolean> {
  try {
    const row = toProductRow(product);
    const { error } = await supabase.from('products').upsert(row);
    if (error) {
      console.error('Supabase upsertProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase upsertProduct exception:', err);
    return false;
  }
}

export async function deleteProductDb(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Supabase deleteProduct error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase deleteProduct exception:', err);
    return false;
  }
}

export async function updateProductStockDb(productId: string, sizes: SizeStock[]): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('products')
      .update({ sizes })
      .eq('id', productId);
    if (error) {
      console.error('Supabase updateProductStock error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase updateProductStock exception:', err);
    return false;
  }
}

export async function fetchOrdersFromDb(): Promise<Order[] | null> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase fetchOrders error:', error);
      return null;
    }
    return (data as DbOrderRow[]).map(toOrder);
  } catch (err) {
    console.warn('Supabase fetchOrders exception:', err);
    return null;
  }
}

export async function insertOrderDb(order: Order): Promise<boolean> {
  try {
    const row = toOrderRow(order);
    const { error } = await supabase.from('orders').insert(row);
    if (error) {
      console.error('Supabase insertOrder error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase insertOrder exception:', err);
    return false;
  }
}

export async function updateOrderStatusDb(
  id: string,
  status: OrderStatus,
  paid?: boolean,
  history?: { status: OrderStatus; at: string }[]
): Promise<boolean> {
  try {
    const patch: any = { status };
    if (typeof paid === 'boolean') patch.paid = paid;
    if (history) patch.history = history;

    const { error } = await supabase.from('orders').update(patch).eq('id', id);
    if (error) {
      console.error('Supabase updateOrderStatus error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase updateOrderStatus exception:', err);
    return false;
  }
}

export async function updateOrderPaidDb(id: string, paid: boolean): Promise<boolean> {
  try {
    const { error } = await supabase.from('orders').update({ paid }).eq('id', id);
    if (error) {
      console.error('Supabase updateOrderPaid error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Supabase updateOrderPaid exception:', err);
    return false;
  }
}

/* ───────────────────────── Image Upload Helper ───────────────────────── */

export async function uploadImageToSupabase(file: File): Promise<string | null> {
  try {
    const ext = file.name.split('.').pop() || 'jpg';
    const filePath = `products/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.warn('Supabase storage upload error:', uploadError);
      return null;
    }

    const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
    return data.publicUrl;
  } catch (err) {
    console.warn('Supabase storage upload exception:', err);
    return null;
  }
}
