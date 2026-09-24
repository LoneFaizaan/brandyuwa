import React from 'react';
import { CircleCheck, Copy } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, paymentLabel, plural } from '../../lib/format';
import { orderWhatsAppLink, upiPayLink } from '../../lib/orderMessages';
import { STORE_CONFIG } from '../../data/storeConfig';
import { WhatsAppIcon } from '../../components/common/SocialIcons';
import { ProductImage } from '../../components/common/ProductImage';
import { NotFoundView } from './NotFoundView';

export const OrderPlacedView: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { getOrder, showToast } = useStore();
  const order = getOrder(orderId);
  usePageTitle(order ? 'Order placed' : 'Order not found');

  if (!order) {
    return <NotFoundView title="Order not found" description="We couldn't find this order on this device." />;
  }

  const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
  const upi = order.payment === 'upi' && STORE_CONFIG.payments.upiId;

  const copyUpi = async () => {
    try {
      await navigator.clipboard.writeText(STORE_CONFIG.payments.upiId);
      showToast('UPI ID copied');
    } catch {
      showToast('Could not copy', 'error');
    }
  };

  return (
    <div className="page max-w-lg animate-fade-in py-8">
      <div className="text-center">
        <CircleCheck size={56} strokeWidth={1.6} className="mx-auto text-ok" />
        <h1 className="mt-3 text-2xl font-bold tracking-tight">Thank you, {order.customer.name.split(' ')[0]}!</h1>
        <p className="mt-1 text-[15px] text-muted">
          Order no. <span className="font-semibold text-ink">{order.id}</span>
        </p>
      </div>

      <div className="mt-6 rounded-2xl border-2 border-whatsapp/30 bg-ok-soft p-5">
        <p className="text-[15px] font-semibold">One last step: send the order on WhatsApp</p>
        <p className="mt-1 text-[15px] leading-relaxed text-ink-2">
          WhatsApp should have opened with your order details. Tap <strong>Send</strong> there so we receive it. If it didn't open, use the
          button below.
        </p>
        <a href={orderWhatsAppLink(order)} target="_blank" rel="noreferrer" className="btn btn-whatsapp mt-4 w-full">
          <WhatsAppIcon size={18} />
          Send order on WhatsApp
        </a>
      </div>

      {upi && (
        <div className="card mt-4 p-5">
          <p className="text-[15px] font-semibold">Pay {formatPrice(order.total)} by UPI</p>
          <p className="mt-1 text-sm text-muted">Opens your UPI app with the amount filled in. You can also pay to our UPI ID.</p>
          <a href={upiPayLink(order)} className="btn btn-primary mt-4 w-full">
            Pay with UPI app
          </a>
          <button type="button" onClick={copyUpi} className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-ink">
            <Copy size={15} />
            {STORE_CONFIG.payments.upiId}
          </button>
        </div>
      )}

      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-[15px] font-semibold">{plural(itemCount, 'item')}</h2>
          <p className="tabular text-[15px] font-bold">{formatPrice(order.total)}</p>
        </div>
        <ul className="mt-3 space-y-3">
          {order.items.map((item, i) => (
            <li key={i} className="flex items-center gap-3">
              <ProductImage src={item.image} alt="" className="h-14 w-11 shrink-0 rounded-lg" />
              <p className="min-w-0 flex-1 text-sm">
                <span className="block truncate font-medium">{item.name}</span>
                <span className="text-muted">
                  Size {item.size}
                  {item.color && ` · ${item.color}`} · Qty {item.quantity}
                </span>
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
          {order.fulfilment === 'pickup'
            ? `Pickup from our shop in ${STORE_CONFIG.address.locality}. We'll message you when it's ready.`
            : `Delivery to ${order.address?.city}, usually in ${STORE_CONFIG.delivery.estimate}.`}{' '}
          Payment: {paymentLabel(order.payment)}.
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <Link to={`/orders/${order.id}`} className="btn btn-secondary">
          View order
        </Link>
        <Link to="/shop" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};
