import React from 'react';
import { useStore } from '../../context/StoreContext';

export const OrderSuccessView: React.FC = () => {
  const { 
    selectedOrderId, 
    getOrderById, 
    orders, 
    setStorefrontPage, 
    setActiveInvoiceOrder 
  } = useStore();

  const order = getOrderById(selectedOrderId || '') || orders[0];

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm font-semibold">No order details found.</p>
        <button
          onClick={() => setStorefrontPage('shop')}
          className="bg-primary text-surface text-xs font-bold px-5 py-2 rounded-full uppercase"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">
      {/* 1. Header Banner */}
      <div className="text-center space-y-3 bg-surface-container-lowest border border-border p-6 sm:p-8 rounded-xs shadow-sm">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-3xl">check</span>
        </div>
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-800">
            Payment & Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-text-primary mt-1">
            Order #{order.id}
          </h1>
          <p className="text-xs text-secondary mt-1 max-w-md mx-auto leading-relaxed">
            Thank you, {order.customerName}. A confirmation has been dispatched to {order.email}. We are preparing your order for express dispatch.
          </p>
        </div>

        {/* Action Pills */}
        <div className="pt-2 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => setActiveInvoiceOrder(order)}
            className="inline-flex items-center space-x-1.5 bg-surface-container-low border border-border hover:bg-surface-container text-text-primary px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition"
          >
            <span className="material-symbols-outlined text-[16px]">receipt</span>
            <span>Download Invoice</span>
          </button>
          <button
            onClick={() => setStorefrontPage('order-tracking')}
            className="inline-flex items-center space-x-1.5 bg-primary text-surface px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-neutral-800 transition"
          >
            <span className="material-symbols-outlined text-[16px]">local_shipping</span>
            <span>Track Live Shipment</span>
          </button>
        </div>
      </div>

      {/* 2. Live Fulfillment Progress Timeline */}
      <div className="bg-surface-container-lowest border border-border p-6 rounded-xs space-y-4">
        <div className="flex justify-between items-center border-b border-border pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary">
            Dispatch & Delivery Timeline
          </h3>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold uppercase">
            Status: {order.status}
          </span>
        </div>

        {/* Stepper */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
          {order.timeline.map((step, idx) => {
            const isDone = step.completed;
            const isCurrent = step.current;

            return (
              <div key={idx} className="relative flex items-start space-x-3">
                <div 
                  className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold border ${
                    isDone 
                      ? 'bg-primary text-surface border-primary' 
                      : isCurrent 
                      ? 'bg-emerald-600 text-surface border-emerald-600 ring-4 ring-emerald-100'
                      : 'bg-surface border-border text-text-muted'
                  }`}
                >
                  {isDone ? (
                    <span className="material-symbols-outlined text-[12px]">check</span>
                  ) : (
                    <span className="text-[9px]">{idx + 1}</span>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <span className={`text-xs font-bold ${isCurrent ? 'text-emerald-800' : 'text-text-primary'}`}>
                      {step.label}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{step.timestamp}</span>
                  </div>
                  <p className="text-[11px] text-secondary mt-0.5">Stage: {step.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Delivery Details & Order Contents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping address card */}
        <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-2 text-xs">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Shipping Destination
          </span>
          <p className="font-bold text-text-primary">{order.shippingAddress.fullName}</p>
          <p className="text-secondary leading-relaxed">{order.shippingAddress.addressLine}</p>
          <p className="text-secondary">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
          <p className="text-text-muted font-mono pt-1">Phone: {order.phone}</p>
          <p className="text-text-muted font-mono">Payment: {order.paymentMethod} ({order.paymentStatus})</p>
        </div>

        {/* Order Items summary */}
        <div className="bg-surface-container-lowest border border-border p-5 rounded-xs space-y-3 text-xs">
          <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider block">
            Items in this Dispatch ({order.items.length})
          </span>
          <div className="divide-y divide-border max-h-48 overflow-y-auto pr-1">
            {order.items.map((item, idx) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-9 h-12 object-cover rounded-xs bg-surface-container"
                  />
                  <div>
                    <h4 className="font-semibold text-text-primary line-clamp-1">{item.product.name}</h4>
                    <span className="text-[10px] text-secondary">
                      Size: {item.selectedSize} • Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <span className="font-bold tabular-nums">
                  ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
          <div className="pt-2 border-t border-border flex justify-between font-bold text-sm text-text-primary">
            <span>Total Paid</span>
            <span className="tabular-nums">₹{order.total.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Return to shop */}
      <div className="text-center pt-4">
        <button
          onClick={() => setStorefrontPage('shop')}
          className="text-xs font-bold uppercase tracking-wider text-text-primary hover:text-secondary underline underline-offset-4"
        >
          Continue Exploring Collection
        </button>
      </div>
    </div>
  );
};
