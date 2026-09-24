import type { OrderStatus, Fulfilment, PaymentMethod, Product } from '../types';

const inr = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

export const formatPrice = (amount: number) => `₹${inr.format(Math.round(amount))}`;

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
  });

export const timeAgo = (iso: string) => {
  const minutes = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? '' : 's'} ago`;
  return formatDate(iso);
};

export const isToday = (iso: string) => new Date(iso).toDateString() === new Date().toDateString();

export const plural = (count: number, one: string, many = `${one}s`) => `${count} ${count === 1 ? one : many}`;

export const totalStock = (p: Product) => p.sizes.reduce((sum, s) => sum + Math.max(0, s.stock), 0);

export const discountPercent = (p: Pick<Product, 'price' | 'mrp'>) =>
  p.mrp && p.mrp > p.price ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0;

export const statusLabel = (status: OrderStatus, fulfilment: Fulfilment) => {
  switch (status) {
    case 'new':
      return 'New';
    case 'packed':
      return 'Packed';
    case 'shipped':
      return fulfilment === 'pickup' ? 'Ready for pickup' : 'Shipped';
    case 'delivered':
      return fulfilment === 'pickup' ? 'Picked up' : 'Delivered';
    case 'cancelled':
      return 'Cancelled';
  }
};

export const paymentLabel = (payment: PaymentMethod) =>
  payment === 'cod' ? 'Cash on delivery' : payment === 'upi' ? 'UPI' : 'Pay at store';

/** Digits only, without a leading +91 / 0 */
export const cleanPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  if (digits.length > 10 && digits.startsWith('91')) return digits.slice(-10);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
};

export const isValidPhone = (value: string) => /^[6-9]\d{9}$/.test(cleanPhone(value));
