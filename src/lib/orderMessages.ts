import type { Order, Product } from '../types';
import { STORE_CONFIG, whatsappLink } from '../data/storeConfig';
import { formatPrice, paymentLabel } from './format';

export const siteLink = (path: string) =>
  `${window.location.origin}${window.location.pathname}#${path.startsWith('/') ? path : `/${path}`}`;

/** The order message the customer sends to the shop on WhatsApp. */
export function orderWhatsAppLink(order: Order) {
  const lines: string[] = [];
  lines.push(`Hello ${STORE_CONFIG.name}, I'd like to place an order.`);
  lines.push('');
  lines.push(`Order no: ${order.id}`);
  order.items.forEach((item, i) => {
    const details = [`Size ${item.size}`, item.color].filter(Boolean).join(', ');
    lines.push(`${i + 1}. ${item.name} (${details}) x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`);
  });
  lines.push('');
  lines.push(`Items: ${formatPrice(order.subtotal)}`);
  if (order.discount > 0) lines.push(`Discount${order.couponCode ? ` (${order.couponCode})` : ''}: -${formatPrice(order.discount)}`);
  if (order.fulfilment === 'delivery') {
    lines.push(`Delivery: ${order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}`);
  }
  lines.push(`Total: ${formatPrice(order.total)}`);
  lines.push(`Payment: ${paymentLabel(order.payment)}`);
  lines.push('');
  lines.push(`Name: ${order.customer.name}`);
  lines.push(`Phone: ${order.customer.phone}`);
  if (order.fulfilment === 'pickup') {
    lines.push('I will pick it up from the shop.');
  } else if (order.address) {
    const a = order.address;
    lines.push(`Deliver to: ${[a.line1, a.landmark, a.city, a.state].filter(Boolean).join(', ')} - ${a.pincode}`);
  }
  if (order.note) lines.push(`Note: ${order.note}`);
  return whatsappLink(lines.join('\n'));
}

export function orderQuestionLink(order: Order) {
  return whatsappLink(`Hello ${STORE_CONFIG.name}, I have a question about my order ${order.id}.`);
}

export function productQuestionLink(product: Product, size?: string, color?: string) {
  const details = [size && `size ${size}`, color].filter(Boolean).join(', ');
  return whatsappLink(
    `Hello ${STORE_CONFIG.name}, is "${product.name}"${details ? ` (${details})` : ''} available?\n${siteLink(`/product/${product.id}`)}`,
  );
}

/** Opens the customer's UPI app with the amount filled in (Android / iOS with UPI apps). */
export function upiPayLink(order: Order) {
  const params = new URLSearchParams({
    pa: STORE_CONFIG.payments.upiId,
    pn: STORE_CONFIG.name,
    am: order.total.toFixed(2),
    cu: 'INR',
    tn: `Order ${order.id}`,
  });
  return `upi://pay?${params.toString()}`;
}
