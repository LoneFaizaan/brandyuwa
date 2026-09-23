import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { CartDrawer } from './components/common/CartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { InvoiceModal } from './components/common/InvoiceModal';
import { ModeSwitcher } from './components/common/ModeSwitcher';
import { QuickAddProductModal } from './components/admin/QuickAddProductModal';

// Storefront views
import { HomeView } from './views/storefront/HomeView';
import { ShopView } from './views/storefront/ShopView';
import { ProductDetailView } from './views/storefront/ProductDetailView';
import { CheckoutView } from './views/storefront/CheckoutView';
import { OrderSuccessView } from './views/storefront/OrderSuccessView';
import { OrderTrackingView } from './views/storefront/OrderTrackingView';

// Admin views
import { AdminHeader } from './components/admin/AdminHeader';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminProductsView } from './views/admin/AdminProductsView';
import { AdminInventoryView } from './views/admin/AdminInventoryView';
import { AdminAnalyticsView } from './views/admin/AdminAnalyticsView';
import { DispatchPipeline } from './components/admin/DispatchPipeline';

const AppContent: React.FC = () => {
  const { 
    viewMode, 
    frameMode, 
    storefrontPage, 
    adminPage, 
    toasts, 
    removeToast 
  } = useStore();

  return (
    <div className={`min-h-screen bg-background transition-all ${
      frameMode === 'mobile' 
        ? 'py-6 px-2 bg-neutral-900 flex justify-center items-start overflow-x-hidden' 
        : ''
    }`}>
      {/* Container - changes to phone frame when mobile mode is toggled */}
      <div className={`w-full transition-all ${
        frameMode === 'mobile' 
          ? 'max-w-[420px] bg-surface min-h-[90vh] shadow-2xl border border-neutral-700 rounded-2xl overflow-hidden relative' 
          : 'min-h-screen'
      }`}>
        
        {/* VIEW 1: CUSTOMER STOREFRONT */}
        {viewMode === 'storefront' && (
          <div className="flex flex-col min-h-screen">
            {storefrontPage !== 'checkout' && <Header />}
            
            <main className="flex-1 pb-16">
              {storefrontPage === 'home' && <HomeView />}
              {storefrontPage === 'shop' && <ShopView />}
              {storefrontPage === 'product' && <ProductDetailView />}
              {storefrontPage === 'checkout' && <CheckoutView />}
              {storefrontPage === 'order-success' && <OrderSuccessView />}
              {storefrontPage === 'order-tracking' && <OrderTrackingView />}
            </main>

            {storefrontPage !== 'checkout' && <Footer />}
          </div>
        )}

        {/* VIEW 2: STORE OWNER ADMIN CONSOLE */}
        {viewMode === 'admin' && (
          <div className="flex flex-col min-h-screen">
            <AdminHeader />
            
            <main className="flex-1 pb-20">
              {adminPage === 'dashboard' && <AdminDashboardView />}
              {adminPage === 'orders' && (
                <div className="max-w-6xl mx-auto px-4 py-6">
                  <DispatchPipeline />
                </div>
              )}
              {adminPage === 'products' && <AdminProductsView />}
              {adminPage === 'inventory' && <AdminInventoryView />}
              {adminPage === 'analytics' && <AdminAnalyticsView />}
            </main>
          </div>
        )}

      </div>

      {/* Global Overlays & Modals */}
      <CartDrawer />
      <SearchModal />
      <InvoiceModal />
      <QuickAddProductModal />
      <ModeSwitcher />

      {/* Toasts Notification Layer */}
      <div className="fixed top-4 right-4 z-50 flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => removeToast(toast.id)}
            className={`pointer-events-auto p-3.5 rounded-xs shadow-lg border text-xs flex items-center justify-between space-x-2 transition-all duration-300 animate-slide-in ${
              toast.type === 'success'
                ? 'bg-neutral-900 text-white border-neutral-800'
                : toast.type === 'error'
                ? 'bg-red-900 text-white border-red-800'
                : 'bg-surface-container-lowest text-text-primary border-border'
            }`}
          >
            <div className="flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px]">
                {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
              </span>
              <span className="font-medium">{toast.message}</span>
            </div>
            <button className="text-white/70 hover:text-white p-0.5">
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}

export default App;
