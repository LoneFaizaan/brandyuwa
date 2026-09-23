import React from 'react';
import { useStore } from '../../context/StoreContext';

export const KPIGrid: React.FC = () => {
  const { todayRevenue, todayOrdersCount, pendingDispatchCount, lowStockCount, setAdminPage } = useStore();

  const aov = Math.round(todayRevenue / Math.max(1, todayOrdersCount));

  return (
    <div className="space-y-3">
      {/* Hero Operational Revenue Card */}
      <div className="bg-surface-container-lowest border border-border rounded-xs p-4 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">
              Today's Gross Revenue (Live)
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary tabular-nums leading-none">
                ₹{todayRevenue.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded-xs">
                +18.4% vs yest.
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Orders Placed</span>
              <p className="text-lg font-bold text-text-primary tabular-nums mt-0.5">
                {todayOrdersCount} <span className="text-xs font-normal text-text-muted">orders</span>
              </p>
            </div>
            <div className="border-l border-border pl-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted block">Average Order</span>
              <p className="text-lg font-bold text-text-primary tabular-nums mt-0.5">
                ₹{aov.toLocaleString('en-IN')}
              </p>
            </div>
          </div>
        </div>

        {/* Actionable Urgent Operational Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
          {/* Dispatch Alert */}
          <button
            onClick={() => setAdminPage('orders')}
            className="flex items-center space-x-3 p-2 rounded-xs hover:bg-surface-container-low text-left transition"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-error-sale animate-pulse shrink-0" />
            <div className="leading-tight">
              <p className="text-xs font-bold text-text-primary">
                {pendingDispatchCount} Awaiting Dispatch
              </p>
              <p className="text-[11px] text-text-muted">Courier cutoff at 5:00 PM • BlueDart Air</p>
            </div>
          </button>

          {/* Stock Alert */}
          <button
            onClick={() => setAdminPage('inventory')}
            className="flex items-center space-x-3 p-2 rounded-xs hover:bg-surface-container-low text-left transition sm:border-l sm:border-border sm:pl-4"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
            <div className="leading-tight">
              <p className="text-xs font-bold text-text-primary">
                {lowStockCount} Low Stock Variants
              </p>
              <p className="text-[11px] text-text-muted">Inventory reorder recommended (≤ 4 units)</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
