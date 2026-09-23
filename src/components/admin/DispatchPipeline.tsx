import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';

export const DispatchPipeline: React.FC = () => {
  const { orders, updateOrderStatus, setActiveInvoiceOrder } = useStore();
  const [filterTab, setFilterTab] = useState<'All' | 'Pending' | 'Packed' | 'Shipped' | 'Delivered'>('Pending');

  const pendingCount = orders.filter(o => o.status === 'Pending').length;
  const packedCount = orders.filter(o => o.status === 'Packed').length;
  const shippedCount = orders.filter(o => o.status === 'Shipped').length;
  const deliveredCount = orders.filter(o => o.status === 'Delivered').length;

  const filteredOrders = orders.filter(order => {
    if (filterTab === 'All') return true;
    return order.status === filterTab;
  });

  return (
    <section className="bg-surface-container-lowest border border-border rounded-xs overflow-hidden shadow-sm">
      {/* Section Header */}
      <div className="p-4 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between bg-surface gap-2">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-text-primary flex items-center space-x-2">
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Fulfillment Dispatch Pipeline</span>
          </h2>
          <p className="text-[11px] text-text-muted mt-0.5">
            Pack garments, generate tax invoices, and handover to courier
          </p>
        </div>
        <span className="text-xs font-mono text-text-muted">
          Total Orders: <strong>{orders.length}</strong>
        </span>
      </div>

      {/* Segmented Pipeline Tabs */}
      <div className="grid grid-cols-5 text-center text-xs font-semibold border-b border-border bg-surface-container-low">
        <button
          onClick={() => setFilterTab('All')}
          className={`py-2.5 transition ${filterTab === 'All' ? 'bg-surface border-b-2 border-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          All ({orders.length})
        </button>
        <button
          onClick={() => setFilterTab('Pending')}
          className={`py-2.5 transition ${filterTab === 'Pending' ? 'bg-surface border-b-2 border-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setFilterTab('Packed')}
          className={`py-2.5 transition ${filterTab === 'Packed' ? 'bg-surface border-b-2 border-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          Packed ({packedCount})
        </button>
        <button
          onClick={() => setFilterTab('Shipped')}
          className={`py-2.5 transition ${filterTab === 'Shipped' ? 'bg-surface border-b-2 border-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          Shipped ({shippedCount})
        </button>
        <button
          onClick={() => setFilterTab('Delivered')}
          className={`py-2.5 transition ${filterTab === 'Delivered' ? 'bg-surface border-b-2 border-primary text-text-primary' : 'text-text-muted hover:text-text-primary'}`}
        >
          Delivered ({deliveredCount})
        </button>
      </div>

      {/* Actionable Orders List */}
      <div className="divide-y divide-border">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12 space-y-2">
            <span className="material-symbols-outlined text-3xl text-text-muted">task_alt</span>
            <p className="text-xs font-medium text-text-primary">No orders in "{filterTab}" stage.</p>
            <p className="text-[11px] text-text-muted">Place a new order in the storefront to simulate live fulfillment.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="p-4 space-y-3 hover:bg-surface/50 transition">
              {/* Card Top Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-xs sm:text-sm font-mono text-text-primary">
                    #{order.id}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider border ${
                    order.status === 'Pending'
                      ? 'bg-amber-100 text-amber-900 border-amber-200'
                      : order.status === 'Packed'
                      ? 'bg-blue-100 text-blue-900 border-blue-200'
                      : order.status === 'Shipped'
                      ? 'bg-purple-100 text-purple-900 border-purple-200'
                      : 'bg-emerald-100 text-emerald-900 border-emerald-200'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">
                    {order.paymentMethod} ({order.paymentStatus})
                  </span>
                </div>
                <span className="text-[11px] text-text-muted font-mono">{order.createdAt}</span>
              </div>

              {/* Customer & Item Content */}
              <div className="flex justify-between items-start text-xs">
                <div>
                  <p className="font-semibold text-text-primary">
                    {order.shippingAddress.fullName} •{' '}
                    <span className="text-text-muted font-normal">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </span>
                  </p>
                  <p className="text-[11px] text-secondary mt-0.5">
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}:{' '}
                    {order.items.map(i => `${i.product.name} (${i.selectedSize})`).join(', ')}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <span className="font-bold text-xs sm:text-sm tabular-nums text-text-primary">
                    ₹{order.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* 1-Tap Thumb Action Row */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-border/50">
                {order.status === 'Pending' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Packed')}
                    className="flex-1 py-1.5 px-3 bg-primary hover:bg-neutral-900 active:scale-[0.98] text-surface rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">inventory_2</span>
                    <span>Pack Items</span>
                  </button>
                )}

                {order.status === 'Packed' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Shipped')}
                    className="flex-1 py-1.5 px-3 bg-primary hover:bg-neutral-900 active:scale-[0.98] text-surface rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                    <span>Handover to Courier</span>
                  </button>
                )}

                {order.status === 'Shipped' && (
                  <button
                    onClick={() => updateOrderStatus(order.id, 'Delivered')}
                    className="flex-1 py-1.5 px-3 bg-emerald-700 hover:bg-emerald-800 active:scale-[0.98] text-surface rounded-xs text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-1 transition"
                  >
                    <span className="material-symbols-outlined text-[14px]">done_all</span>
                    <span>Mark Delivered</span>
                  </button>
                )}

                <button
                  onClick={() => setActiveInvoiceOrder(order)}
                  className="py-1.5 px-3 bg-surface border border-border hover:bg-surface-container text-text-primary rounded-xs text-xs font-semibold flex items-center space-x-1 transition"
                >
                  <span className="material-symbols-outlined text-[14px]">receipt</span>
                  <span>Invoice</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
