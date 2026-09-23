import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';

export const OrderTrackingView: React.FC = () => {
  const { orders, selectedOrderId, setSelectedOrderId, setStorefrontPage, setActiveInvoiceOrder } = useStore();
  const [searchId, setSearchId] = useState(selectedOrderId || orders[0]?.id || '');

  const activeOrder = orders.find(o => o.id.toLowerCase() === searchId.trim().toLowerCase()) || orders[0];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-text-muted">
            Live Logistics
          </span>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-text-primary mt-0.5">
            Track Shipment
          </h1>
        </div>
        <button
          onClick={() => setStorefrontPage('shop')}
          className="text-xs font-bold uppercase tracking-wider text-secondary hover:text-text-primary"
        >
          Back to Shop
        </button>
      </div>

      {/* Search Order Bar */}
      <div className="bg-surface-container-low border border-border p-4 rounded-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 w-full relative">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-text-muted text-[18px]">
            search
          </span>
          <input
            type="text"
            placeholder="Enter Order ID (e.g. ORD-8942)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="w-full h-10 pl-9 pr-3 bg-surface-container-lowest border border-border text-xs font-mono uppercase focus:outline-none focus:border-primary"
          />
        </div>
        {/* Quick selection chips for existing orders */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          <span className="text-[10px] uppercase font-bold text-text-muted shrink-0">Recent:</span>
          {orders.slice(0, 3).map(o => (
            <button
              key={o.id}
              onClick={() => {
                setSearchId(o.id);
                setSelectedOrderId(o.id);
              }}
              className={`px-2.5 py-1 text-xs font-mono rounded-xs border transition ${
                activeOrder?.id === o.id 
                  ? 'bg-primary text-surface border-primary font-bold' 
                  : 'bg-surface-container-lowest border-border text-secondary hover:text-text-primary'
              }`}
            >
              #{o.id}
            </button>
          ))}
        </div>
      </div>

      {activeOrder ? (
        <div className="space-y-6">
          {/* Tracking Summary Card */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-xs shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted">Air Waybill Number</span>
                <p className="text-base font-mono font-bold text-text-primary">BD-IN-984210982</p>
                <p className="text-xs text-secondary mt-0.5">Carrier: BlueDart Express Air • Priority Dispatch</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold uppercase rounded-full">
                  Status: {activeOrder.status}
                </span>
                <button
                  onClick={() => setActiveInvoiceOrder(activeOrder)}
                  className="px-3 py-1 bg-surface-container-low hover:bg-surface-container border border-border text-xs font-semibold rounded-full"
                >
                  Invoice
                </button>
              </div>
            </div>

            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-surface-container-low p-3.5 border border-border rounded-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">Origin Facility</span>
                <p className="font-bold text-text-primary">Atelier Fulfillment Hub 01</p>
                <p className="text-secondary">Indiranagar, Bengaluru, KA - 560038</p>
              </div>
              <div className="bg-surface-container-low p-3.5 border border-border rounded-xs">
                <span className="text-[10px] uppercase font-bold text-text-muted block mb-0.5">Delivery Destination</span>
                <p className="font-bold text-text-primary">{activeOrder.shippingAddress.fullName}</p>
                <p className="text-secondary">{activeOrder.shippingAddress.city}, {activeOrder.shippingAddress.state} - {activeOrder.shippingAddress.pincode}</p>
              </div>
            </div>
          </div>

          {/* Stepper Timeline */}
          <div className="bg-surface-container-lowest border border-border p-6 rounded-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-primary border-b border-border pb-3">
              Shipment Tracking Events
            </h3>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-border">
              {activeOrder.timeline.map((step, idx) => (
                <div key={idx} className="relative flex items-start space-x-3 text-xs">
                  <div 
                    className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center font-bold ${
                      step.completed 
                        ? 'bg-primary text-surface' 
                        : step.current 
                        ? 'bg-emerald-600 text-surface ring-4 ring-emerald-100' 
                        : 'bg-surface-container-low border border-border text-text-muted'
                    }`}
                  >
                    {step.completed ? (
                      <span className="material-symbols-outlined text-[12px]">check</span>
                    ) : (
                      <span className="text-[9px]">{idx + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline">
                      <span className={`font-bold ${step.current ? 'text-emerald-800' : 'text-text-primary'}`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] font-mono text-text-muted">{step.timestamp}</span>
                    </div>
                    <p className="text-[11px] text-secondary mt-0.5">Checkpoint: {step.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-container-low border border-border rounded-xs">
          <p className="text-xs text-secondary">Enter a valid Order ID to inspect live progress.</p>
        </div>
      )}
    </div>
  );
};
