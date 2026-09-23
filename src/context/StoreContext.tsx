import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Coupon, 
  ViewMode, 
  StorefrontPage, 
  AdminPage, 
  ProductSize, 
  ProductColor,
  ShippingAddress
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_COUPONS } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Mode & Navigation
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  frameMode: 'full' | 'mobile';
  setFrameMode: (frame: 'full' | 'mobile') => void;
  storefrontPage: StorefrontPage;
  setStorefrontPage: (page: StorefrontPage) => void;
  adminPage: AdminPage;
  setAdminPage: (page: AdminPage) => void;
  
  // Selection
  selectedProductId: string;
  setSelectedProductId: (id: string) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Drawer / Modals
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isQuickAddOpen: boolean;
  setIsQuickAddOpen: (open: boolean) => void;
  activeInvoiceOrder: Order | null;
  setActiveInvoiceOrder: (order: Order | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => void;
  updateStock: (productId: string, size: ProductSize, newStock: number) => void;
  getProductById: (id: string) => Product | undefined;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, color: ProductColor, quantity?: number) => void;
  removeFromCart: (productId: string, size: ProductSize, colorName: string) => void;
  updateCartQuantity: (productId: string, size: ProductSize, colorName: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartShipping: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Orders
  orders: Order[];
  placeOrder: (orderData: {
    customerName: string;
    email: string;
    phone: string;
    shippingAddress: ShippingAddress;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  }) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  getOrderById: (id: string) => Order | undefined;

  // Coupons
  coupons: Coupon[];
  activeCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Operational metrics
  todayRevenue: number;
  todayOrdersCount: number;
  pendingDispatchCount: number;
  lowStockCount: number;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation states
  const [viewMode, setViewMode] = useState<ViewMode>('storefront');
  const [frameMode, setFrameMode] = useState<'full' | 'mobile'>('full');
  const [storefrontPage, setStorefrontPage] = useState<StorefrontPage>('home');
  const [adminPage, setAdminPage] = useState<AdminPage>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string>(INITIAL_PRODUCTS[0].id);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(INITIAL_ORDERS[0].id);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Items');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState<boolean>(false);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);

  // Persistent storage or initial fallbacks
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('atelier_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('atelier_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('atelier_cart');
    return saved ? JSON.parse(saved) : [
      {
        product: INITIAL_PRODUCTS[0],
        selectedColor: INITIAL_PRODUCTS[0].colors[0],
        selectedSize: 'L',
        quantity: 1
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('atelier_wishlist');
    return saved ? JSON.parse(saved) : [INITIAL_PRODUCTS[1].id, INITIAL_PRODUCTS[3].id];
  });

  const [coupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [activeCoupon, setActiveCoupon] = useState<Coupon | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('atelier_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('atelier_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('atelier_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('atelier_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Toast notification helper
  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Products actions
  const addProduct = (newProdData: Omit<Product, 'id' | 'rating' | 'reviewCount' | 'salesCount'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      salesCount: 0
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`Added "${newProduct.name}" to catalog`, 'success');
  };

  const updateStock = (productId: string, size: ProductSize, newStock: number) => {
    setProducts(prev => prev.map(prod => {
      if (prod.id !== productId) return prod;
      const updatedSizes = prod.sizes.map(s => s.size === size ? { ...s, stock: Math.max(0, newStock) } : s);
      const totalStock = updatedSizes.reduce((acc, curr) => acc + curr.stock, 0);
      return { ...prod, sizes: updatedSizes, totalStock };
    }));
    showToast(`Stock updated for size ${size}`, 'info');
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Cart actions
  const addToCart = (product: Product, size: ProductSize, color: ProductColor, quantity = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && 
                item.selectedSize === size && 
                item.selectedColor.name === color.name
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
    showToast(`Added ${product.name} (${size}) to bag`, 'success');
  };

  const removeFromCart = (productId: string, size: ProductSize, colorName: string) => {
    setCart(prev => prev.filter(
      item => !(item.product.id === productId && item.selectedSize === size && item.selectedColor.name === colorName)
    ));
    showToast('Item removed from bag', 'info');
  };

  const updateCartQuantity = (productId: string, size: ProductSize, colorName: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, colorName);
      return;
    }
    setCart(prev => prev.map(item => {
      if (item.product.id === productId && item.selectedSize === size && item.selectedColor.name === colorName) {
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartDiscount = activeCoupon ? Math.round((cartSubtotal * activeCoupon.discountPercent) / 100) : 0;
  const cartShipping = cartSubtotal >= 999 || cartSubtotal === 0 ? 0 : 99;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartShipping);

  // Wishlist actions
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to wishlist', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Orders actions
  const placeOrder = (orderData: {
    customerName: string;
    email: string;
    phone: string;
    shippingAddress: ShippingAddress;
    paymentMethod: 'UPI' | 'Card' | 'Net Banking' | 'COD';
  }): Order => {
    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: Order = {
      id: orderId,
      customerName: orderData.customerName,
      email: orderData.email,
      phone: orderData.phone,
      shippingAddress: orderData.shippingAddress,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      shippingFee: cartShipping,
      total: cartTotal,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'Pending' : 'Paid',
      status: 'Pending',
      createdAt: 'Just now',
      timeline: [
        { status: 'Ordered', label: 'Order Received', timestamp: 'Just now', completed: true, current: false },
        { status: 'Confirmed', label: `${orderData.paymentMethod} Verified`, timestamp: 'Just now', completed: true, current: false },
        { status: 'Packed', label: 'Quality Check & Packing', timestamp: 'Pending', completed: false, current: true },
        { status: 'Shipped', label: 'Handover to BlueDart', timestamp: 'Estimated in 24 hrs', completed: false, current: false },
        { status: 'Out for Delivery', label: 'Out for Delivery', timestamp: 'Pending', completed: false, current: false },
        { status: 'Delivered', label: 'Delivered', timestamp: 'Estimated in 2-4 days', completed: false, current: false }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(orderId);
    showToast(`Order #${orderId} confirmed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedTimeline = order.timeline.map(step => {
        if (newStatus === 'Packed' && step.status === 'Packed') {
          return { ...step, completed: true, current: true, timestamp: 'Today, Just now' };
        }
        if (newStatus === 'Shipped' && (step.status === 'Packed' || step.status === 'Shipped')) {
          return { ...step, completed: true, current: step.status === 'Shipped', timestamp: 'Today, Just now' };
        }
        if (newStatus === 'Delivered') {
          return { ...step, completed: true, current: step.status === 'Delivered', timestamp: 'Today, Just now' };
        }
        return step;
      });

      return {
        ...order,
        status: newStatus,
        timeline: updatedTimeline
      };
    }));
    showToast(`Order #${orderId} marked as ${newStatus}`, 'success');
  };

  const getOrderById = (id: string) => orders.find(o => o.id === id);

  // Coupon actions
  const applyCoupon = (code: string): boolean => {
    const found = coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      showToast('Invalid or expired coupon code', 'error');
      return false;
    }
    if (cartSubtotal < found.minOrderValue) {
      showToast(`Coupon valid on orders above ₹${found.minOrderValue}`, 'error');
      return false;
    }
    setActiveCoupon(found);
    showToast(`Applied code "${found.code}" (${found.discountPercent}% Off)`, 'success');
    return true;
  };

  const removeCoupon = () => {
    setActiveCoupon(null);
    showToast('Promo code removed', 'info');
  };

  // Operational metrics for Admin
  const todayRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.total, 0);
  const todayOrdersCount = orders.length;
  const pendingDispatchCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount = products.filter(p => p.sizes.some(s => s.stock <= 4)).length;

  return (
    <StoreContext.Provider value={{
      viewMode,
      setViewMode,
      frameMode,
      setFrameMode,
      storefrontPage,
      setStorefrontPage,
      adminPage,
      setAdminPage,
      selectedProductId,
      setSelectedProductId,
      selectedOrderId,
      setSelectedOrderId,
      selectedCategory,
      setSelectedCategory,
      searchQuery,
      setSearchQuery,
      isCartOpen,
      setIsCartOpen,
      isSearchOpen,
      setIsSearchOpen,
      isQuickAddOpen,
      setIsQuickAddOpen,
      activeInvoiceOrder,
      setActiveInvoiceOrder,
      products,
      addProduct,
      updateStock,
      getProductById,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      cartCount,
      cartSubtotal,
      cartDiscount,
      cartShipping,
      cartTotal,
      wishlist,
      toggleWishlist,
      isInWishlist,
      orders,
      placeOrder,
      updateOrderStatus,
      getOrderById,
      coupons,
      activeCoupon,
      applyCoupon,
      removeCoupon,
      todayRevenue,
      todayOrdersCount,
      pendingDispatchCount,
      lowStockCount,
      toasts,
      showToast,
      removeToast
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
