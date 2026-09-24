import React from 'react';
import { Printer } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_ADDRESS_FULL, STORE_CONFIG, STORE_PHONE_DISPLAY } from '../../data/storeConfig';
import { formatDateTime, formatPrice, paymentLabel, statusLabel } from '../../lib/format';
import { Modal } from './Modal';
import { Logo } from './Logo';

export const ReceiptModal: React.FC = () => {
  const { receiptOrder: order, setReceiptOrder } = useStore();

  const print = () => {
    document.body.classList.add('printing-receipt');
    const cleanup = () => {
      document.body.classList.remove('printing-receipt');
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);
    window.print();
  };

  if (!order) return null;

  return (
    <Modal
      open
      onClose={() => setReceiptOrder(null)}
      title="Receipt"
      panelId="receipt-sheet"
      headerActions={
        <button type="button" onClick={print} className="btn btn-ghost btn-sm">
          <Printer size={18} />
          Print
        </button>
      }
    >
      <div className="space-y-5 p-5 text-[15px]">
        <div className="border-b border-dashed border-line-strong pb-4 text-center">
          <div className="flex justify-center pb-2">
            <Logo size="md" />
          </div>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            {STORE_ADDRESS_FULL}
            <br />
            {STORE_PHONE_DISPLAY}
            {STORE_CONFIG.gstin && (
              <>
                <br />
                GSTIN: {STORE_CONFIG.gstin}
              </>
            )}
          </p>
        </div>

        <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
          <dt className="text-muted">Order no.</dt>
          <dd className="text-right font-semibold">{order.id}</dd>
          <dt className="text-muted">Date</dt>
          <dd className="text-right">{formatDateTime(order.createdAt)}</dd>
          <dt className="text-muted">Status</dt>
          <dd className="text-right">{statusLabel(order.status, order.fulfilment)}</dd>
          <dt className="text-muted">Payment</dt>
          <dd className="text-right">
            {paymentLabel(order.payment)} · {order.paid ? 'Paid' : 'Not paid yet'}
          </dd>
        </dl>

        <div className="rounded-xl bg-soft p-3 text-sm">
          <p className="font-semibold">{order.customer.name}</p>
          <p className="text-muted">+91 {order.customer.phone}</p>
          {order.fulfilment === 'pickup' ? (
            <p className="mt-1 text-muted">Pickup from shop</p>
          ) : (
            order.address && (
              <p className="mt-1 leading-relaxed text-muted">
                {[order.address.line1, order.address.landmark, order.address.city, order.address.state].filter(Boolean).join(', ')} –{' '}
                {order.address.pincode}
              </p>
            )
          )}
        </div>

        <ul className="divide-y divide-line border-y border-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex justify-between gap-3 py-2.5">
              <div className="min-w-0">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted">
                  {[`Size ${item.size}`, item.color].filter(Boolean).join(' · ')} · {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <p className="tabular shrink-0 font-medium">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>

        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Items</dt>
            <dd className="tabular">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <dt className="text-muted">Discount{order.couponCode ? ` (${order.couponCode})` : ''}</dt>
              <dd className="tabular text-ok">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          {order.fulfilment === 'delivery' && (
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="tabular">{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</dd>
            </div>
          )}
          <div className="flex justify-between border-t border-line pt-2 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <p className="text-center text-sm text-muted">
          Thank you for shopping with us. Size exchange within {STORE_CONFIG.exchangeDays} days with tags attached.
        </p>
      </div>
    </Modal>
  );
};
