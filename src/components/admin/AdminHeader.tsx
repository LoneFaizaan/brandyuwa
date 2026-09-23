import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminPage } from '../../types';

export const AdminHeader: React.FC = () => {
  const { 
    adminPage, 
    setAdminPage, 
    setViewMode, 
    setStorefrontPage, 
    pendingDispatchCount,
    showToast 
  } = useStore();

  const [storeOpen, setStoreOpen] = useState(true);

  const toggleStore = () => {
    setStoreOpen(!storeOpen);
    showToast(storeOpen ? 'Store marked closed' : 'Store opened for live orders', 'info');
  };

  const navItems: { id: AdminPage; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'orders', label: 'Pipeline', icon: 'local_shipping' },
    { id: 'products', label: 'Products', icon: 'inventory_2' },
    { id: 'inventory', label: 'Inventory', icon: 'warehouse' },
    { id: 'analytics', label: 'Analytics', icon: 'analytics' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur-md border-b border-border">
      {/* Top Console Bar */}
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Identity & Live Status */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xs bg-primary text-surface flex items-center justify-center font-bold text-xs tracking-wider">
            AR
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="font-bold text-xs sm:text-sm tracking-tight uppercase text-text-primary leading-none">
                ATELIER RETAIL ADMIN
              </h1>
              <span className="hidden sm:inline-block bg-neutral-200 text-neutral-800 text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase">
                v2.6 Live
              </span>
            </div>
            {/* Live Toggle */}
            <button
              onClick={toggleStore}
              className="flex items-center space-x-1.5 mt-1 text-left"
              title="Click to toggle store operational status"
            >
              <span className={`w-2 h-2 rounded-full ${storeOpen ? 'bg-emerald-600 animate-pulse' : 'bg-neutral-400'}`} />
              <span className={`text-[10px] sm:text-[11px] font-medium ${storeOpen ? 'text-emerald-800' : 'text-neutral-500'}`}>
                {storeOpen ? 'Store Open • Accepting live orders' : 'Store Paused • Fulfillment only'}
              </span>
            </button>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center space-x-2">
          {/* Direct Storefront Switcher */}
          <button
            onClick={() => {
              setViewMode('storefront');
              setStorefrontPage('home');
            }}
            className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-surface-container-low hover:bg-surface-container border border-border rounded-xs text-xs font-semibold text-text-primary transition"
          >
            <span className="material-symbols-outlined text-[16px]">storefront</span>
            <span>View Store</span>
          </button>

          {/* Pending Alerts */}
          <button
            onClick={() => setAdminPage('orders')}
            className="relative p-2 rounded-xs hover:bg-surface-container-low text-text-primary transition"
            title={`${pendingDispatchCount} orders awaiting dispatch`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {pendingDispatchCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error-sale rounded-full animate-ping" />
            )}
          </button>

          {/* Store Owner Avatar */}
          <div className="w-8 h-8 rounded-full bg-primary text-surface font-bold text-xs flex items-center justify-center border border-border">
            RK
          </div>
        </div>
      </div>

      {/* Admin Sub-navigation Tabs */}
      <nav className="bg-surface-container-low border-t border-border overflow-x-auto no-scrollbar">
        <div className="max-w-6xl mx-auto px-4 flex space-x-2 sm:space-x-6 text-xs">
          {navItems.map((item) => {
            const isActive = adminPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminPage(item.id)}
                className={`py-2.5 px-2 flex items-center space-x-1.5 whitespace-nowrap border-b-2 font-medium transition-colors ${
                  isActive
                    ? 'border-primary text-text-primary font-bold bg-surface'
                    : 'border-transparent text-secondary hover:text-text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                <span>{item.label}</span>
                {item.id === 'orders' && pendingDispatchCount > 0 && (
                  <span className="ml-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 rounded-full">
                    {pendingDispatchCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </header>
  );
};
