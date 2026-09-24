import React from 'react';
import { ChevronLeft, Receipt } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatDateTime, formatPrice, paymentLabel } from '../../lib/format';
import { orderQuestionLink, orderWhatsAppLink } from '../../lib/orderMessages';
import { STORE_CONFIG } from '../../data/storeConfig';
import { ProductImage } from '../../components/common/ProductImage';
import { WhatsAppIcon } from '../../components/common/SocialIcons';
import { OrderProgress, StatusBadge } from '../../components/storefront/OrderProgress';
import { NotFoundView } from './NotFoundView';

export const OrderDetailView: React.FC<{ orderId: string }> = ({ orderId }) => {
  const { getOrder, setReceiptOrder } = useStore();
  const order = getOrder(orderId);
  usePageTitle(order ? `Order ${order.id}` : 'Order not found');

  if (!order) {
    return <NotFoundView title="Order not found" description="We couldn't find this order on this device." />;
  }

  return (
    <div className="page max-w-2xl animate-fade-in py-5 md:py-8">
      <Link to="/orders" className="-ml-2 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm font-medium text-muted hover:text-ink">
        <ChevronLeft size={18} />
        My orders
      </Link>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <h1 className="text-2xl font-bold tracking-tight">{order.id}</h1>
        <StatusBadge order={order} />
      </div>
      <p className="mt-1 text-sm text-muted">Placed {formatDateTime(order.createdAt)}</p>

      <section className="card mt-5 p-5">
        <OrderProgress order={order} />
        {order.status === 'new' && (
          <p className="mt-4 border-t border-line pt-4 text-sm leading-relaxed text-muted">
            Didn't send the order on WhatsApp yet?{' '}
            <a href={orderWhatsAppLink(order)} target="_blank" rel="noreferrer" className="link">
              Send it now
            </a>
            .
          </p>
        )}
      </section>

      <section className="card mt-4 p-5">
        <h2 className="text-[15px] font-semibold">Items</h2>
        <ul className="mt-3 divide-y divide-line">
          {order.items.map((item, i) => (
            <li key={i} className="flex gap-3 py-3 first:pt-0 last:pb-0">
              <Link to={`/product/${item.productId}`} className="shrink-0">
                <ProductImage src={item.image} alt="" className="h-20 w-16 rounded-lg" />
              </Link>
              <div className="min-w-0 flex-1 text-[15px]">
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted">
                  Size {item.size}
                  {item.color && ` · ${item.color}`} · Qty {item.quantity}
                </p>
              </div>
              <p className="tabular shrink-0 text-[15px] font-medium">{formatPrice(item.price * item.quantity)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-[15px]">
          <div className="flex justify-between">
            <dt className="text-muted">Items</dt>
            <dd className="tabular">{formatPrice(order.subtotal)}</dd>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-ok">
              <dt>Discount</dt>
              <dd className="tabular">−{formatPrice(order.discount)}</dd>
            </div>
          )}
          {order.fulfilment === 'delivery' && (
            <div className="flex justify-between">
              <dt className="text-muted">Delivery</dt>
              <dd className="tabular">{order.deliveryFee === 0 ? 'Free' : formatPrice(order.deliveryFee)}</dd>
            </div>
          )}
          <div className="flex justify-between pt-1 text-base font-bold">
            <dt>Total</dt>
            <dd className="tabular">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <section className="card mt-4 grid gap-4 p-5 text-[15px] sm:grid-cols-2">
        <div>
          <h2 className="text-sm font-semibold text-muted">{order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery address'}</h2>
          <p className="mt-1 leading-relaxed">
            {order.customer.name}
            <br />
            {order.fulfilment === 'pickup' ? (
              <>
                {STORE_CONFIG.name}, {STORE_CONFIG.address.locality}, {STORE_CONFIG.address.city}
              </>
            ) : (
              order.address && (
                <>
                  {[order.address.line1, order.address.landmark].filter(Boolean).join(', ')}
                  <br />
                  {order.address.city}, {order.address.state} {order.address.pincode}
                </>
              )
            )}
          </p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-muted">Payment</h2>
          <p className="mt-1">
            {paymentLabel(order.payment)}
            <br />
            <span className="text-muted">{order.paid ? 'Paid' : 'Not paid yet'}</span>
          </p>
        </div>
      </section>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <a href={orderQuestionLink(order)} target="_blank" rel="noreferrer" className="btn btn-secondary">
          <WhatsAppIcon size={18} className="text-whatsapp" />
          Ask about this order
        </a>
        <button type="button" onClick={() => setReceiptOrder(order)} className="btn btn-secondary">
          <Receipt size={18} />
          View receipt
        </button>
      </div>
    </div>
  );
};
