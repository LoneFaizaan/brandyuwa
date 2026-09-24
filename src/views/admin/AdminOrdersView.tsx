import React, { useState } from 'react';
import { ClipboardList, Phone, Receipt, Trash2 } from 'lucide-react';
import type { Order, OrderStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { usePageTitle } from '../../lib/hooks';
import { formatPrice, paymentLabel, statusLabel, timeAgo } from '../../lib/format';
import { STORE_CONFIG } from '../../data/storeConfig';
import { AdminPage } from '../../components/admin/AdminShell';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductImage } from '../../components/common/ProductImage';
import { WhatsAppIcon } from '../../components/common/SocialIcons';
import { statusTone } from '../../components/storefront/OrderProgress';

type Tab = OrderStatus | 'all';

const NEXT: Partial<Record<OrderStatus, OrderStatus>> = { new: 'packed', packed: 'shipped', shipped: 'delivered' };

const nextLabel = (order: Order) => {
  const next = NEXT[order.status];
  if (!next) return null;
  if (next === 'packed') return 'Mark as packed';
  if (next === 'shipped') return order.fulfilment === 'pickup' ? 'Mark ready for pickup' : 'Mark as shipped';
  return order.fulfilment === 'pickup' ? 'Mark as picked up' : 'Mark as delivered';
};

/** Ready-made WhatsApp message to the customer for the order's current stage */
const customerMessage = (order: Order) => {
  const first = order.customer.name.split(' ')[0];
  const intro = `Hello ${first}, this is ${STORE_CONFIG.name}.`;
  switch (order.status) {
    case 'new':
      return `${intro} We have received your order ${order.id} (${formatPrice(order.total)}). We will pack it soon.`;
    case 'packed':
      return `${intro} Your order ${order.id} is packed.`;
    case 'shipped':
      return order.fulfilment === 'pickup'
        ? `${intro} Your order ${order.id} is ready. You can collect it from our shop.`
        : `${intro} Your order ${order.id} is on its way.`;
    case 'delivered':
      return `${intro} Thank you for shopping with us! We hope you like your order.`;
    case 'cancelled':
      return `${intro} Your order ${order.id} has been cancelled.`;
  }
};

export const AdminOrdersView: React.FC = () => {
  usePageTitle('Orders');
  const { orders } = useStore();
  const [tab, setTab] = useState<Tab>(() => (orders.some((o) => o.status === 'new') ? 'new' : 'all'));

  const count = (t: Tab) => (t === 'all' ? orders.length : orders.filter((o) => o.status === t).length);
  const tabs: { key: Tab; label: string }[] = [
    { key: 'new', label: 'New' },
    { key: 'packed', label: 'Packed' },
    { key: 'shipped', label: 'Shipped / ready' },
    { key: 'delivered', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
    { key: 'all', label: 'All' },
  ];
  const list = tab === 'all' ? orders : orders.filter((o) => o.status === tab);

  return (
    <AdminPage title="Orders" subtitle="Real-time orders synced with cloud. Customer orders also arrive on your WhatsApp.">
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)} aria-pressed={tab === t.key} className={`chip ${tab === t.key ? 'chip-active' : ''}`}>
            {t.label} <span className={tab === t.key ? 'text-white/70' : 'text-muted'}>{count(t.key)}</span>
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={<ClipboardList size={26} />}
          title={orders.length === 0 ? 'No orders yet' : 'Nothing here'}
          description={orders.length === 0 ? 'Orders will show up here in real time as customers place them.' : 'No orders in this list.'}
        />
      ) : (
        <ul className="mt-4 space-y-3">
          {list.map((o) => (
            <li key={o.id}>
              <OrderCard order={o} />
            </li>
          ))}
        </ul>
      )}
    </AdminPage>
  );
};

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { setOrderStatus, setOrderPaid, setReceiptOrder, deleteOrder } = useStore();
  const next = NEXT[order.status];
  const label = nextLabel(order);
  const closed = order.status === 'delivered' || order.status === 'cancelled';
  const customerWhatsApp = `https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(customerMessage(order))}`;

  return (
    <article className="card p-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold">{order.id}</p>
          <p className="text-sm text-muted">
            {timeAgo(order.createdAt)} · {order.fulfilment === 'pickup' ? 'Pickup' : 'Delivery'}
          </p>
        </div>
        <span className={`badge ${statusTone(order.status)}`}>{statusLabel(order.status, order.fulfilment)}</span>
      </header>

      <div className="mt-3 flex items-center gap-2 rounded-xl bg-soft p-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[15px] font-semibold">{order.customer.name}</p>
          <p className="tabular text-sm text-muted">+91 {order.customer.phone}</p>
        </div>
        <a href={`tel:+91${order.customer.phone}`} className="icon-btn border border-line-strong bg-canvas" aria-label={`Call ${order.customer.name}`}>
          <Phone size={19} />
        </a>
        <a
          href={customerWhatsApp}
          target="_blank"
          rel="noreferrer"
          className="icon-btn border border-line-strong bg-canvas text-whatsapp"
          aria-label={`WhatsApp ${order.customer.name}`}
        >
          <WhatsAppIcon size={19} />
        </a>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink-2">
        {order.fulfilment === 'pickup' ? (
          'Customer will pick up from the shop.'
        ) : order.address ? (
          <>
            <span className="text-muted">Deliver to: </span>
            {[order.address.line1, order.address.landmark, order.address.city, order.address.state].filter(Boolean).join(', ')} –{' '}
            {order.address.pincode}
          </>
        ) : null}
      </p>
      {order.note && <p className="mt-2 rounded-lg bg-warn-soft px-3 py-2 text-sm text-warn">Note: {order.note}</p>}

      <ul className="mt-3 space-y-2">
        {order.items.map((item, i) => (
          <li key={i} className="flex items-center gap-3">
            <ProductImage src={item.image} alt="" className="h-14 w-11 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{item.name}</p>
              <p className="text-muted">
                <strong className="text-ink">Size {item.size}</strong>
                {item.color && ` · ${item.color}`} · Qty {item.quantity}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
        <p className="text-[15px]">
          <span className="tabular font-bold">{formatPrice(order.total)}</span>
          <span className="text-muted"> · {paymentLabel(order.payment)}</span>
        </p>
        <span className={`badge ${order.paid ? 'bg-ok-soft text-ok' : 'bg-soft text-muted'}`}>{order.paid ? 'Paid' : 'Not paid'}</span>
      </div>

      {next && label && (
        <button type="button" onClick={() => setOrderStatus(order.id, next)} className="btn btn-primary mt-3 w-full">
          {label}
        </button>
      )}

      <div className="mt-2 flex flex-wrap gap-2">
        <button type="button" onClick={() => setReceiptOrder(order)} className="btn btn-secondary btn-sm flex-1">
          <Receipt size={16} />
          Receipt
        </button>
        {order.status !== 'cancelled' && (
          <button type="button" onClick={() => setOrderPaid(order.id, !order.paid)} className="btn btn-secondary btn-sm flex-1">
            {order.paid ? 'Mark not paid' : 'Mark paid'}
          </button>
        )}
        {!closed ? (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Cancel order ${order.id}? The items will be put back in stock.`)) setOrderStatus(order.id, 'cancelled');
            }}
            className="btn btn-danger btn-sm flex-1"
          >
            Cancel order
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              if (window.confirm(`Permanently remove order ${order.id} from records?`)) {
                deleteOrder(order.id);
              }
            }}
            className="btn btn-secondary btn-sm flex-1 text-sale hover:bg-sale-soft"
          >
            <Trash2 size={16} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
};
