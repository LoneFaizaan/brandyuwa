import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { AuthError, Session } from '@supabase/supabase-js';
import type {
  Address,
  CartItem,
  CartLine,
  Coupon,
  CustomerDetails,
  Fulfilment,
  Order,
  OrderStatus,
  PaymentMethod,
  Product,
  SizeStock,
} from '../types';
import { STORE_CONFIG } from '../data/storeConfig';
import { KEYS, load, remove, save } from '../lib/storage';
import { calcTotals } from '../lib/pricing';
import { useRouter } from '../lib/router';
import {
  supabase,
  isSupabaseConfigured,
  fetchProductsFromDb,
  upsertProductDb,
  deleteProductDb,
  updateProductStockDb,
  fetchOrdersFromDb,
  fetchMyOrdersFromDb,
  insertOrderDb,
  placeOrderDb,
  updateOrderStatusDb,
  updateOrderPaidDb,
  deleteOrderDb,
  checkIsStaff,
} from '../lib/supabase';

/* ───────────────────────── Types ───────────────────────── */

export type ToastTone = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
  action?: { label: string; onClick: () => void };
}

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

export interface PlaceOrderInput {
  customer: { name: string; phone: string };
  fulfilment: Fulfilment;
  address?: Address;
  payment: PaymentMethod;
  note?: string;
}

interface StoreContextValue {
  // Catalogue
  products: Product[];
  liveProducts: Product[];
  getProduct: (id: string) => Product | undefined;
  saveProduct: (input: ProductInput, id?: string) => Product | null;
  deleteProduct: (id: string) => void;
  setStock: (productId: string, size: string, stock: number) => void;

  // Bag
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (productId: string, size: string, color?: string, quantity?: number) => boolean;
  setCartQuantity: (key: string, quantity: number) => void;
  removeFromCart: (key: string) => void;

  // Coupons
  coupon: Coupon | null;
  applyCoupon: (code: string) => string | null;
  removeCoupon: () => void;

  // Saved items
  saved: string[];
  isSaved: (id: string) => boolean;
  toggleSaved: (id: string) => void;

  // Orders
  /** Every order in the shop. Only loaded for signed-in staff. */
  orders: Order[];
  /** Orders placed on this device */
  myOrders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderPaid: (id: string, paid: boolean) => void;
  deleteOrder: (id: string) => Promise<void>;
  savedCustomer: CustomerDetails | null;

  // Staff (Supabase email OTP; the database decides who is staff)
  isStaff: boolean;
  /** True while a saved login is being checked */
  staffLoading: boolean;
  staffEmail: string | null;
  requestStaffCode: (email: string) => Promise<string | null>;
  verifyStaffCode: (email: string, code: string) => Promise<string | null>;
  staffLogout: () => Promise<void>;
  restoreBackup: (data: unknown) => string | null;

  // Backend / Cloud
  backendStatus: 'connected' | 'connecting' | 'offline';
  isBackendConnected: boolean;
  refreshBackendData: () => Promise<void>;

  // UI
  isSearchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  receiptOrder: Order | null;
  setReceiptOrder: (order: Order | null) => void;
  toasts: Toast[];
  showToast: (message: string, tone?: ToastTone, action?: Toast['action']) => void;
  dismissToast: (id: number) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

/* ───────────────────────── Helpers ───────────────────────── */

export const lineKey = (l: Pick<CartLine, 'productId' | 'size' | 'color'>) => `${l.productId}|${l.size}|${l.color ?? ''}`;

function authErrorMessage(error: AuthError) {
  if (error.code === 'otp_expired') return 'This code is wrong or has expired. Check it or send a new one.';
  if (error.status === 429 || error.code?.startsWith('over_')) return 'Too many login emails sent. Please wait a few minutes and try again.';
  if (error.status === 403 || error.code === 'signup_disabled' || error.code === 'otp_disabled') return 'This email does not have staff access.';
  // Supabase's built-in sender only mails the project's own team until a custom SMTP sender is set up
  if (error.code === 'email_address_not_authorized') return 'The login email could not be sent. Ask the person who set up this website to finish the email setup.';
  if (error.name === 'AuthRetryableFetchError') return 'Could not connect. Check your internet and try again.';
  return error.message || 'Something went wrong. Please try again.';
}

function loadInitialProducts(): Product[] {
  const stored = load<Product[]>(KEYS.products);
  return Array.isArray(stored) ? stored : [];
}

const ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function newOrderId(existing: Order[]) {
  const d = new Date();
  const date = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  for (;;) {
    const rand = Array.from({ length: 3 }, () => ID_CHARS[Math.floor(Math.random() * ID_CHARS.length)]).join('');
    const id = `BY-${date}-${rand}`;
    if (!existing.some((o) => o.id === id)) return id;
  }
}

function newProductId(name: string, existing: Product[]) {
  const slug =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40) || 'product';
  let id = slug;
  let n = 2;
  while (existing.some((p) => p.id === id)) id = `${slug}-${n++}`;
  return id;
}

/** Adds (+) or removes (−) ordered quantities from product stock */
function adjustStock(products: Product[], items: { productId: string; size: string; quantity: number }[], direction: 1 | -1) {
  return products.map((p) => {
    const lines = items.filter((i) => i.productId === p.id);
    if (lines.length === 0) return p;
    return {
      ...p,
      sizes: p.sizes.map((s) => {
        const qty = lines.filter((l) => l.size === s.size).reduce((sum, l) => sum + l.quantity, 0);
        return qty ? { ...s, stock: Math.max(0, s.stock + direction * qty) } : s;
      }),
    };
  });
}

/* ───────────────────────── Provider ───────────────────────── */

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { navigate } = useRouter();

  /* Backend status */
  const [backendStatus, setBackendStatus] = useState<'connected' | 'connecting' | 'offline'>('connecting');
  const isBackendConnected = backendStatus === 'connected';

  /* Toasts */
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const dismissToast = useCallback((id: number) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);
  const showToast = useCallback(
    (message: string, tone: ToastTone = 'success', action?: Toast['action']) => {
      const id = ++toastId.current;
      setToasts((prev) => [...prev.slice(-2), { id, message, tone, action }]);
      window.setTimeout(() => dismissToast(id), tone === 'error' ? 5000 : action ? 4500 : 3000);
    },
    [dismissToast],
  );

  /* Products — cached locally and synchronized with Supabase */
  const [products, setProducts] = useState<Product[]>(loadInitialProducts);
  const productsRef = useRef(products);
  const persistProducts = useCallback((next: Product[]) => {
    const ok = save(KEYS.products, next);
    productsRef.current = next;
    setProducts(next);
    return ok;
  }, []);

  const liveProducts = useMemo(() => products.filter((p) => p.published), [products]);
  const getProduct = useCallback((id: string) => products.find((p) => p.id === id), [products]);

  /* Orders placed on this device — refreshed from Supabase by order number + phone */
  const [myOrders, setMyOrders] = useState<Order[]>(() => load<Order[]>(KEYS.myOrders) ?? []);
  const myOrdersRef = useRef(myOrders);
  const persistMyOrders = useCallback((next: Order[]) => {
    myOrdersRef.current = next;
    setMyOrders(next);
    save(KEYS.myOrders, next);
  }, []);

  /* Every shop order — staff only, cached locally and synchronized with Supabase */
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>(KEYS.staffOrders) ?? []);
  const ordersRef = useRef(orders);
  const persistOrders = useCallback((next: Order[]) => {
    ordersRef.current = next;
    setOrders(next);
    save(KEYS.staffOrders, next);
  }, []);

  /* Staff session — Supabase Auth keeps the login; the database decides who is staff */
  const [session, setSession] = useState<Session | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [staffCheck, setStaffCheck] = useState<{ userId: string; ok: boolean } | null>(null);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setSessionLoaded(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const userId = session?.user.id ?? null;
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    checkIsStaff().then((ok) => {
      if (cancelled) return;
      if (ok === false) {
        void supabase.auth.signOut({ scope: 'local' });
        showToast('This email does not have staff access.', 'error');
      }
      // When the check can't run (offline), keep showing the staff screens.
      // This only affects what is shown: the database still refuses changes from non-staff.
      setStaffCheck({ userId, ok: ok !== false });
    });
    return () => {
      cancelled = true;
    };
  }, [userId, showToast]);

  const staffChecked = !!userId && staffCheck?.userId === userId;
  const isStaff = staffChecked && !!staffCheck?.ok;
  const staffLoading = !sessionLoaded || (!!userId && !staffChecked);
  const staffEmail = isStaff ? (session?.user.email ?? null) : null;
  const isStaffRef = useRef(isStaff);
  useEffect(() => {
    isStaffRef.current = isStaff;
  }, [isStaff]);

  /* Synchronize from Supabase */
  const refreshSeq = useRef(0);
  const refreshBackendData = useCallback(async () => {
    const seq = ++refreshSeq.current;
    try {
      const [remoteProducts, remoteOrders] = await Promise.all([
        fetchProductsFromDb(),
        isStaff ? fetchOrdersFromDb() : fetchMyOrdersFromDb(myOrdersRef.current),
      ]);
      // A newer refresh started meanwhile (e.g. after logging in or out); its data wins
      if (seq !== refreshSeq.current) return;

      if (remoteProducts !== null) {
        productsRef.current = remoteProducts;
        setProducts(remoteProducts);
        save(KEYS.products, remoteProducts);
      }

      if (remoteOrders !== null) {
        if (isStaff) persistOrders(remoteOrders);
        else persistMyOrders(myOrdersRef.current.map((o) => remoteOrders.find((r) => r.id === o.id) ?? o));
      }

      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend sync failed:', err);
      setBackendStatus('offline');
    }
  }, [isStaff, persistOrders, persistMyOrders]);

  /* Load once the saved login has been checked, and again whenever staff log in or out */
  useEffect(() => {
    if (staffLoading) return;
    // Shop orders hold customers' phone numbers and addresses: don't keep them after logout
    if (!isStaff && ordersRef.current.length > 0) persistOrders([]);
    refreshBackendData();
  }, [staffLoading, isStaff, refreshBackendData, persistOrders]);

  /* Real-time synchronization */
  useEffect(() => {
    if (!isSupabaseConfigured) {
      setBackendStatus('offline');
      return;
    }

    const channel = supabase
      .channel('storefront-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        async () => {
          const remote = await fetchProductsFromDb();
          if (remote !== null) {
            productsRef.current = remote;
            setProducts(remote);
            save(KEYS.products, remote);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        async () => {
          // Only staff are sent order changes
          if (!isStaffRef.current) return;
          const remote = await fetchOrdersFromDb();
          if (remote !== null && isStaffRef.current) persistOrders(remote);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setBackendStatus('connected');
        } else if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
          setBackendStatus('offline');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [persistOrders]);

  /* Bag, saved items, coupon, customer details */
  const [cartLines, setCartLines] = useState<CartLine[]>(() => load<CartLine[]>(KEYS.cart) ?? []);
  const [saved, setSaved] = useState<string[]>(() => load<string[]>(KEYS.saved) ?? []);
  const [couponCode, setCouponCode] = useState<string | null>(() => load<string>(KEYS.coupon));
  const [savedCustomer, setSavedCustomer] = useState<CustomerDetails | null>(() => load<CustomerDetails>(KEYS.customer));

  useEffect(() => void save(KEYS.cart, cartLines), [cartLines]);
  useEffect(() => void save(KEYS.saved, saved), [saved]);
  useEffect(() => {
    if (couponCode) save(KEYS.coupon, couponCode);
    else remove(KEYS.coupon);
  }, [couponCode]);

  /* UI state */
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  /* ── Catalogue actions ── */

  const saveProduct = useCallback(
    (input: ProductInput, id?: string): Product | null => {
      const current = productsRef.current;
      const existing = id ? current.find((p) => p.id === id) : undefined;
      const product: Product = existing
        ? { ...existing, ...input }
        : { ...input, id: newProductId(input.name, current), createdAt: new Date().toISOString() };
      const next = existing ? current.map((p) => (p.id === id ? product : p)) : [product, ...current];
      
      persistProducts(next);
      showToast(existing ? 'Changes saved' : 'Product added to your shop');

      // Asynchronously upsert to Supabase
      upsertProductDb(product).then((ok) => {
        if (!ok) {
          showToast('Saved locally, but could not sync with Supabase database.', 'error');
        }
      });

      return product;
    },
    [persistProducts, showToast],
  );

  const deleteProduct = useCallback(
    (id: string) => {
      persistProducts(productsRef.current.filter((p) => p.id !== id));
      setCartLines((prev) => prev.filter((l) => l.productId !== id));
      setSaved((prev) => prev.filter((s) => s !== id));
      showToast('Product deleted', 'info');

      // Delete from Supabase
      deleteProductDb(id).then((ok) => {
        if (!ok) {
          showToast('Deleted locally, but could not remove from Supabase database.', 'error');
        }
      });
    },
    [persistProducts, showToast],
  );

  const setStock = useCallback(
    (productId: string, size: string, stock: number) => {
      let updatedSizes: SizeStock[] | null = null;
      const next = productsRef.current.map((p) => {
        if (p.id === productId) {
          const sizes = p.sizes.map((s) => (s.size === size ? { ...s, stock: Math.max(0, Math.floor(stock) || 0) } : s));
          updatedSizes = sizes;
          return { ...p, sizes };
        }
        return p;
      });
      persistProducts(next);

      if (updatedSizes) {
        updateProductStockDb(productId, updatedSizes);
      }
    },
    [persistProducts],
  );

  /* ── Bag ── */

  const cart = useMemo<CartItem[]>(
    () =>
      cartLines.flatMap((line) => {
        const product = products.find((p) => p.id === line.productId && p.published);
        if (!product) return [];
        const available = product.sizes.find((s) => s.size === line.size)?.stock ?? 0;
        return [{ ...line, key: lineKey(line), product, available }];
      }),
    [cartLines, products],
  );
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartSubtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const addToCart = useCallback(
    (productId: string, size: string, color?: string, quantity = 1) => {
      const product = productsRef.current.find((p) => p.id === productId);
      if (!product) return false;
      const available = product.sizes.find((s) => s.size === size)?.stock ?? 0;
      const key = lineKey({ productId, size, color });
      const inBag = cartLines.find((l) => lineKey(l) === key)?.quantity ?? 0;
      if (inBag + quantity > available) {
        showToast(
          available === 0
            ? `Size ${size} is sold out`
            : inBag >= available
              ? `All ${available} pieces in size ${size} are already in your bag`
              : `Only ${available} left in size ${size}`,
          'error',
        );
        return false;
      }
      setCartLines((prev) => {
        const idx = prev.findIndex((l) => lineKey(l) === key);
        if (idx === -1) return [...prev, { productId, size, color, quantity }];
        return prev.map((l, i) => (i === idx ? { ...l, quantity: l.quantity + quantity } : l));
      });
      showToast('Added to bag', 'success', { label: 'View bag', onClick: () => navigate('/cart') });
      return true;
    },
    [cartLines, navigate, showToast],
  );

  const setCartQuantity = useCallback((key: string, quantity: number) => {
    setCartLines((prev) =>
      quantity <= 0 ? prev.filter((l) => lineKey(l) !== key) : prev.map((l) => (lineKey(l) === key ? { ...l, quantity } : l)),
    );
  }, []);

  const removeFromCart = useCallback(
    (key: string) => {
      const index = cartLines.findIndex((l) => lineKey(l) === key);
      if (index === -1) return;
      const removed = cartLines[index];
      setCartLines((prev) => prev.filter((l) => lineKey(l) !== key));
      showToast('Removed from bag', 'info', {
        label: 'Undo',
        onClick: () =>
          setCartLines((prev) => (prev.some((l) => lineKey(l) === key) ? prev : [...prev.slice(0, index), removed, ...prev.slice(index)])),
      });
    },
    [cartLines, showToast],
  );

  /* ── Coupons ── */

  const coupon = useMemo(
    () => STORE_CONFIG.coupons.find((c) => c.code.toUpperCase() === couponCode?.toUpperCase()) ?? null,
    [couponCode],
  );

  const applyCoupon = useCallback((code: string) => {
    const found = STORE_CONFIG.coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) return 'This code is not valid.';
    setCouponCode(found.code);
    return null;
  }, []);

  const removeCoupon = useCallback(() => setCouponCode(null), []);

  /* ── Saved items ── */

  const isSaved = useCallback((id: string) => saved.includes(id), [saved]);
  const toggleSaved = useCallback(
    (id: string) => {
      const wasSaved = saved.includes(id);
      setSaved((prev) => (wasSaved ? prev.filter((s) => s !== id) : [...prev.filter((s) => s !== id), id]));
      showToast(wasSaved ? 'Removed from saved' : 'Saved for later', wasSaved ? 'info' : 'success');
    },
    [saved, showToast],
  );

  /* ── Orders ── */

  const getOrder = useCallback(
    (id: string) => {
      const match = (o: Order) => o.id.toUpperCase() === id.toUpperCase();
      return myOrders.find(match) ?? orders.find(match);
    },
    [myOrders, orders],
  );

  const placeOrder = useCallback(
    (input: PlaceOrderInput): Order | null => {
      if (cart.length === 0) return null;
      const problem = cart.find((i) => i.quantity > i.available);
      if (problem) {
        showToast(
          problem.available === 0
            ? `${problem.product.name} (${problem.size}) just sold out. Please remove it from your bag.`
            : `Only ${problem.available} of ${problem.product.name} (${problem.size}) left. Please update your bag.`,
          'error',
        );
        return null;
      }

      const totals = calcTotals(cartSubtotal, input.fulfilment, coupon);
      const now = new Date().toISOString();
      const order: Order = {
        id: newOrderId(myOrdersRef.current),
        createdAt: now,
        customer: input.customer,
        fulfilment: input.fulfilment,
        address: input.fulfilment === 'delivery' ? input.address : undefined,
        items: cart.map((i) => ({
          productId: i.productId,
          name: i.product.name,
          image: i.product.images[0],
          price: i.product.price,
          size: i.size,
          color: i.color,
          quantity: i.quantity,
        })),
        subtotal: totals.subtotal,
        discount: totals.discount,
        couponCode: totals.discount > 0 ? coupon?.code : undefined,
        deliveryFee: totals.deliveryFee,
        total: totals.total,
        payment: input.payment,
        paid: false,
        status: 'new',
        history: [{ status: 'new', at: now }],
        note: input.note?.trim() || undefined,
      };

      persistProducts(adjustStock(productsRef.current, order.items, -1));
      persistMyOrders([order, ...myOrdersRef.current]);
      setCartLines([]);
      setCouponCode(null);

      const details: CustomerDetails = { ...input.customer, address: input.address ?? savedCustomer?.address };
      setSavedCustomer(details);
      save(KEYS.customer, details);

      // Save the order to Supabase; the server also takes the pieces out of stock
      placeOrderDb(order).then((ok) => {
        if (!ok) {
          console.warn('Supabase order insert failed, order saved locally.');
        }
      });

      return order;
    },
    [cart, cartSubtotal, coupon, persistMyOrders, persistProducts, savedCustomer, showToast],
  );

  const setOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      const order = ordersRef.current.find((o) => o.id === id);
      if (!order || order.status === status || order.status === 'cancelled') return;
      
      let nextProducts = productsRef.current;
      if (status === 'cancelled') {
        nextProducts = adjustStock(productsRef.current, order.items, 1);
        persistProducts(nextProducts);
        for (const item of order.items) {
          const prod = nextProducts.find((p) => p.id === item.productId);
          if (prod) updateProductStockDb(prod.id, prod.sizes);
        }
      }

      const settlesOnHandover = order.payment === 'cod' || order.payment === 'store';
      const willBePaid = status === 'delivered' && settlesOnHandover ? true : order.paid;
      const nextHistory = [...order.history, { status, at: new Date().toISOString() }];

      const updated: Order = {
        ...order,
        status,
        paid: willBePaid,
        history: nextHistory,
      };

      persistOrders(ordersRef.current.map((o) => (o.id === id ? updated : o)));

      // Sync to Supabase
      updateOrderStatusDb(id, status, willBePaid, nextHistory);
    },
    [persistOrders, persistProducts],
  );

  const setOrderPaid = useCallback(
    (id: string, paid: boolean) => {
      persistOrders(ordersRef.current.map((o) => (o.id === id ? { ...o, paid } : o)));
      updateOrderPaidDb(id, paid);
    },
    [persistOrders],
  );

  const deleteOrder = useCallback(
    async (id: string) => {
      persistOrders(ordersRef.current.filter((o) => o.id !== id));
      await deleteOrderDb(id);
      showToast('Order removed');
    },
    [persistOrders, showToast],
  );

  /* ── Staff ── */

  // Supabase refuses to send a code to any email that isn't on the staff list
  const requestStaffCode = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim().toLowerCase() });
    return error ? authErrorMessage(error) : null;
  }, []);

  const verifyStaffCode = useCallback(async (email: string, code: string) => {
    const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: 'email' });
    return error ? authErrorMessage(error) : null;
  }, []);

  // 'local' ends this device's login only, not the same staff member's other devices
  const staffLogout = useCallback(async () => {
    await supabase.auth.signOut({ scope: 'local' });
  }, []);

  const restoreBackup = useCallback(
    (data: unknown) => {
      const backup = data as { products?: unknown; orders?: unknown };
      if (!backup || !Array.isArray(backup.products) || !Array.isArray(backup.orders)) {
        return 'This file is not a shop backup.';
      }
      const restoredProducts = backup.products as Product[];
      if (!restoredProducts.every((p) => p && typeof p.id === 'string' && Array.isArray(p.images) && Array.isArray(p.sizes))) {
        return 'This backup file looks damaged.';
      }
      persistProducts(restoredProducts);
      persistOrders(backup.orders as Order[]);

      // Sync backup items to Supabase
      for (const p of restoredProducts) {
        upsertProductDb(p);
      }
      for (const o of backup.orders as Order[]) {
        insertOrderDb(o);
      }

      return null;
    },
    [persistOrders, persistProducts],
  );

  const value: StoreContextValue = {
    products,
    liveProducts,
    getProduct,
    saveProduct,
    deleteProduct,
    setStock,
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    setCartQuantity,
    removeFromCart,
    coupon,
    applyCoupon,
    removeCoupon,
    saved,
    isSaved,
    toggleSaved,
    orders,
    myOrders,
    getOrder,
    placeOrder,
    setOrderStatus,
    setOrderPaid,
    deleteOrder,
    savedCustomer,
    isStaff,
    staffLoading,
    staffEmail,
    requestStaffCode,
    verifyStaffCode,
    staffLogout,
    restoreBackup,
    backendStatus,
    isBackendConnected,
    refreshBackendData,
    isSearchOpen,
    setSearchOpen,
    receiptOrder,
    setReceiptOrder,
    toasts,
    showToast,
    dismissToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
