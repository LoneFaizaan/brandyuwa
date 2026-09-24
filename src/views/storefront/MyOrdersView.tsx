import React from 'react';
import { ChevronRight, Package } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Link } from '../../lib/router';
import { usePageTitle } from '../../lib/hooks';
import { formatDate, formatPrice, plural } from '../../lib/format';
import { EmptyState } from '../../components/common/EmptyState';
import { ProductImage } from '../../components/common/ProductImage';
import { StatusBadge } from '../../components/storefront/OrderProgress';

export const MyOrdersView: React.FC = () => {
  usePageTitle('My orders');
  const { orders } = useStore();

  return (
    <div className="page max-w-2xl animate-fade-in py-5 md:py-8">
      <h1 className="text-2xl font-bold tracking-tight">My orders</h1>
      <p className="mt-1 text-sm text-muted">Orders placed from this phone or computer.</p>

      {orders.length === 0 ? (
        <EmptyState
          icon={<Package size={26} />}
          title="No orders yet"
          description="When you place an order, you can find it here."
          action={
            <Link to="/shop" className="btn btn-primary">
              Start shopping
            </Link>
          }
        />
      ) : (
        <ul className="mt-5 space-y-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className="card flex items-center gap-4 p-4 transition-colors hover:bg-soft">
                <div className="flex -space-x-4">
                  {order.items.slice(0, 3).map((item, i) => (
                    <ProductImage key={i} src={item.image} alt="" className="h-16 w-12 rounded-lg border-2 border-canvas" />
                  ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[15px] font-semibold">{order.id}</p>
                    <StatusBadge order={order} />
                  </div>
                  <p className="mt-0.5 text-sm text-muted">
                    {formatDate(order.createdAt)} · {plural(order.items.reduce((s, i) => s + i.quantity, 0), 'item')} ·{' '}
                    {formatPrice(order.total)}
                  </p>
                </div>
                <ChevronRight size={20} className="shrink-0 text-faint" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
