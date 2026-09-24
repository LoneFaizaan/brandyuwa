import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { matchPath, RouterProvider, useRouter } from './lib/router';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { SearchModal } from './components/common/SearchModal';
import { ReceiptModal } from './components/common/ReceiptModal';
import { Toasts } from './components/common/Toasts';
import { AdminShell } from './components/admin/AdminShell';

import { HomeView } from './views/storefront/HomeView';
import { ShopView } from './views/storefront/ShopView';
import { ProductDetailView } from './views/storefront/ProductDetailView';
import { CartView } from './views/storefront/CartView';
import { CheckoutView } from './views/storefront/CheckoutView';
import { OrderPlacedView } from './views/storefront/OrderPlacedView';
import { MyOrdersView } from './views/storefront/MyOrdersView';
import { OrderDetailView } from './views/storefront/OrderDetailView';
import { SavedView } from './views/storefront/SavedView';
import { ContactView } from './views/storefront/ContactView';
import { InfoPage, InfoPageName } from './views/storefront/InfoPage';
import { NotFoundView } from './views/storefront/NotFoundView';

import { AdminLoginView } from './views/admin/AdminLoginView';
import { AdminDashboardView } from './views/admin/AdminDashboardView';
import { AdminProductsView } from './views/admin/AdminProductsView';
import { AdminProductFormView } from './views/admin/AdminProductFormView';
import { AdminOrdersView } from './views/admin/AdminOrdersView';
import { AdminStockView } from './views/admin/AdminStockView';
import { AdminSettingsView } from './views/admin/AdminSettingsView';

const INFO_PAGES: InfoPageName[] = ['about', 'faq', 'shipping', 'returns', 'privacy', 'terms'];

const Redirect: React.FC<{ to: string }> = ({ to }) => {
  const { navigate } = useRouter();
  useEffect(() => navigate(to, { replace: true }), [navigate, to]);
  return null;
};

/**
 * `bar` decides what sits at the bottom of the screen on phones:
 * the tab bar, or the page's own action bar (Add to bag, Checkout…).
 */
interface StoreRoute {
  view: React.ReactNode;
  bar: 'tabs' | 'page';
  footer?: boolean;
}

function storeRoute(path: string): StoreRoute {
  const tabs = (view: React.ReactNode): StoreRoute => ({ view, bar: 'tabs', footer: true });
  let m: Record<string, string> | null;

  if (path === '/') return tabs(<HomeView />);
  if (path === '/shop') return tabs(<ShopView />);
  if ((m = matchPath('/product/:id', path))) {
    return { view: <ProductDetailView key={m.id} productId={m.id} />, bar: 'page', footer: true };
  }
  if (path === '/cart') return { view: <CartView />, bar: 'page', footer: true };
  if (path === '/checkout') return { view: <CheckoutView />, bar: 'page' };
  if ((m = matchPath('/order-placed/:id', path) ?? matchPath('/order-success/:id', path))) {
    return tabs(<OrderPlacedView key={m.id} orderId={m.id} />);
  }
  if (path === '/orders') return tabs(<MyOrdersView />);
  if ((m = matchPath('/orders/:id', path))) return tabs(<OrderDetailView key={m.id} orderId={m.id} />);
  if (path === '/saved') return tabs(<SavedView />);
  if (path === '/contact') return tabs(<ContactView />);
  const info = path.slice(1) as InfoPageName;
  if (INFO_PAGES.includes(info)) return tabs(<InfoPage key={info} page={info} />);

  // Addresses used by the previous version of the site
  if (path === '/wishlist') return tabs(<Redirect to="/saved" />);
  if (path === '/account' || path === '/login') return tabs(<Redirect to="/orders" />);
  if ((m = matchPath('/order-tracking/:id', path))) return tabs(<Redirect to={`/orders/${m.id}`} />);
  if (path === '/order-tracking') return tabs(<Redirect to="/orders" />);

  return tabs(<NotFoundView />);
}

function adminRoute(path: string): { view: React.ReactNode; hideTabs?: boolean } {
  let m: Record<string, string> | null;
  if (path === '/admin') return { view: <AdminDashboardView /> };
  if (path === '/admin/products') return { view: <AdminProductsView /> };
  if (path === '/admin/products/new') return { view: <AdminProductFormView key="new" />, hideTabs: true };
  if ((m = matchPath('/admin/products/:id', path))) {
    return { view: <AdminProductFormView key={m.id} productId={m.id} />, hideTabs: true };
  }
  if (path === '/admin/orders') return { view: <AdminOrdersView /> };
  if (path === '/admin/stock' || path === '/admin/inventory') return { view: <AdminStockView /> };
  if (path === '/admin/settings') return { view: <AdminSettingsView /> };
  return { view: <Redirect to="/admin" /> };
}

const AppContent: React.FC = () => {
  const { path } = useRouter();
  const { isStaff } = useStore();
  const isAdmin = path === '/admin' || path.startsWith('/admin/');

  let page: React.ReactNode;
  if (isAdmin) {
    if (!isStaff) {
      page = <AdminLoginView />;
    } else {
      const route = adminRoute(path);
      page = <AdminShell hideTabs={route.hideTabs}>{route.view}</AdminShell>;
    }
  } else {
    const route = storeRoute(path);
    page = (
      <div className="flex min-h-[100dvh] flex-col">
        <Header />
        <main className="flex-1">{route.view}</main>
        {route.footer && <Footer />}
        {route.bar === 'tabs' && <BottomNav />}
        {/* Keeps the end of the page clear of the fixed bottom bar on phones */}
        <div
          aria-hidden="true"
          className={`md:hidden ${
            route.bar === 'tabs' ? 'h-[calc(4rem+env(safe-area-inset-bottom,0px))]' : 'h-[calc(4.75rem+env(safe-area-inset-bottom,0px))]'
          }`}
        />
      </div>
    );
  }

  return (
    <>
      {page}
      <SearchModal />
      <ReceiptModal />
      <Toasts />
    </>
  );
};

export default function App() {
  return (
    <RouterProvider>
      <StoreProvider>
        <AppContent />
      </StoreProvider>
    </RouterProvider>
  );
}
