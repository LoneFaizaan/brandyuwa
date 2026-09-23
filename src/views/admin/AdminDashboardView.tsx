import React from 'react';
import { useStore } from '../../context/StoreContext';
import { KPIGrid } from '../../components/admin/KPIGrid';
import { DispatchPipeline } from '../../components/admin/DispatchPipeline';

export const AdminDashboardView: React.FC = () => {
  const { setIsQuickAddOpen, setAdminPage, showToast } = useStore();

  return (
    <div className="space-y-6 max-w-6xl mx-auto px-4 py-6">
      {/* 1. Quick Operational Actions */}
      <section className="space-y-3">
        {/* Primary Action */}
        <button
          onClick={() => setIsQuickAddOpen(true)}
          className="w-full bg-primary hover:bg-neutral-900 active:scale-[0.99] text-surface p-4 rounded-xs flex items-center justify-between transition shadow-sm"
        >
          <div className="flex items-center space-x-3">
            <span className="w-8 h-8 rounded-xs bg-white/15 flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add</span>
            </span>
            <div className="text-left leading-tight">
              <p className="text-xs sm:text-sm font-bold uppercase tracking-wider">
                Quick Add Product
              </p>
              <p className="text-[11px] text-white/70">
                Photo, Specs, Pricing, Sizes & Real-time Stock
              </p>
            </div>
          </div>
          <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
        </button>

        {/* Secondary Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              showToast('Flash sale applied: 10% discount promo active', 'info');
            }}
            className="py-2.5 px-3 rounded-xs bg-surface-container-lowest border border-border text-text-primary text-xs font-semibold flex items-center justify-center space-x-2 hover:bg-surface-container-low transition"
          >
            <span className="material-symbols-outlined text-[16px]">local_offer</span>
            <span>Trigger Campaign Discount</span>
          </button>
          <button
            onClick={() => setAdminPage('inventory')}
            className="py-2.5 px-3 rounded-xs bg-surface-container-lowest border border-border text-text-primary text-xs font-semibold flex items-center justify-center space-x-2 hover:bg-surface-container-low transition"
          >
            <span className="material-symbols-outlined text-[16px]">warehouse</span>
            <span>Manage Inventory Levels</span>
          </button>
        </div>
      </section>

      {/* 2. Today's Revenue & Operational KPI Grid */}
      <KPIGrid />

      {/* 3. Dispatch Pipeline */}
      <DispatchPipeline />
    </div>
  );
};
