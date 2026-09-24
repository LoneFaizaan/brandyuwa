import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { SAMPLE_PRODUCTS } from '../data/sampleProducts';
import { KEYS, load, loadLegacy, remove, removeLegacy, save } from '../lib/storage';
import { calcTotals } from '../lib/pricing';
import { sha256 } from '../lib/sha256';
import { useRouter } from '../lib/router';
import {
  supabase,
  isSupabaseConfigured,
  fetchProductsFromDb,
  upsertProductDb,
  deleteProductDb,
  updateProductStockDb,
  fetchOrdersFromDb,
  insertOrderDb,
  updateOrderStatusDb,
  updateOrderPaidDb,
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
  orders: Order[];
  getOrder: (id: string) => Order | undefined;
  placeOrder: (input: PlaceOrderInput) => Order | null;
  setOrderStatus: (id: string, status: OrderStatus) => void;
  setOrderPaid: (id: string, paid: boolean) => void;
  savedCustomer: CustomerDetails | null;

  // Staff
  isStaff: boolean;
  staffLogin: (password: string) => string | null;
  staffLogout: () => void;
  changeStaffPassword: (current: string, next: string) => string | null;
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

const STAFF_SESSION_DAYS = 30;
const MAX_LOGIN_TRIES = 5;
const LOCKOUT_MS = 60_000;

const LEGACY_KEYS = [
  'brandyuwa_products',
  'brandyuwa_orders',
  'brandyuwa_cart',
  'brandyuwa_wishlist',
  'brandyuwa_user',
  'brandyuwa_recent_searches',
];

const CATEGORY_RENAMES: Record<string, string> = { Overshirts: 'Shirts', Traditional: 'Kurtas', Hoodies: 'Winterwear' };

/** Converts a product saved by the previous version of the site. */
function fromLegacyProduct(p: any): Product | null {
  if (!p || typeof p !== 'object' || !p.id || !p.name) return null;
  const images = [p.image, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(
    (x): x is string => typeof x === 'string' && x.length > 0,
  );
  const price = Number(p.price) || 0;
  const mrp = Number(p.originalPrice) || 0;
  return {
    id: String(p.id),
    name: String(p.name),
    category: CATEGORY_RENAMES[p.category] ?? String(p.category ?? 'Shirts'),
    price,
    mrp: mrp > price ? mrp : undefined,
    images: Array.from(new Set(images)),
    description: String(p.description ?? ''),
    fabric: p.fabric ? String(p.fabric) : undefined,
    colors: Array.isArray(p.colors)
      ? p.colors.filter((c: any) => c?.name).map((c: any) => ({ name: String(c.name), hex: String(c.hex ?? '#999999'), image: c.image }))
      : [],
    sizes: Array.isArray(p.sizes)
      ? p.sizes.map((s: any) => ({ size: String(s.size), stock: Math.max(0, Number(s.stock) || 0) }))
      : [],
    isNew: !!p.isNew,
    isFeatured: !!p.isBestseller,
    published: p.status ? p.status === 'Published' : true,
    createdAt: new Date().toISOString(),
  };
}

function loadInitialProducts(): Product[] {
  const stored = load<Product[]>(KEYS.products);
  if (Array.isArray(stored) && stored.length > 0) return stored;

  // First visit after the update: keep products the shopkeeper added, drop old demo items.
  let initial = SAMPLE_PRODUCTS;
  const legacy = loadLegacy<unknown[]>('brandyuwa_products');
  if (Array.isArray(legacy)) {
    const own = legacy
      .filter((p: any) => p && !/^prod-\d{1,2}$/.test(String(p.id)))
      .map(fromLegacyProduct)
      .filter((p): p is Product => p !== null);
    if (own.length > 0) initial = own;
  }
  removeLegacy(...LEGACY_KEYS);
  save(KEYS.products, initial);
  return initial;
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

  /* Orders — cached locally and synchronized with Supabase */
  const [orders, setOrders] = useState<Order[]>(() => load<Order[]>(KEYS.orders) ?? []);
  const ordersRef = useRef(orders);
  const persistOrders = useCallback((next: Order[]) => {
    ordersRef.current = next;
    setOrders(next);
    save(KEYS.orders, next);
  }, []);

  /* Synchronize from Supabase */
  const refreshBackendData = useCallback(async () => {
    try {
      const [remoteProducts, remoteOrders] = await Promise.all([
        fetchProductsFromDb(),
        fetchOrdersFromDb(),
      ]);

      if (remoteProducts && remoteProducts.length > 0) {
        productsRef.current = remoteProducts;
        setProducts(remoteProducts);
        save(KEYS.products, remoteProducts);
      } else if (remoteProducts && remoteProducts.length === 0 && productsRef.current.length > 0) {
        // Seeding Supabase if remote is completely empty
        for (const p of productsRef.current) {
          await upsertProductDb(p);
        }
      }

      if (remoteOrders) {
        ordersRef.current = remoteOrders;
        setOrders(remoteOrders);
        save(KEYS.orders, remoteOrders);
      }

      setBackendStatus('connected');
    } catch (err) {
      console.warn('Backend sync failed:', err);
      setBackendStatus('offline');
    }
  }, []);

  /* Initial mount and real-time synchronization */
  useEffect(() => {
    refreshBackendData();

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
          if (remote && remote.length > 0) {
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
          const remote = await fetchOrdersFromDb();
          if (remote) {
            ordersRef.current = remote;
            setOrders(remote);
            save(KEYS.orders, remote);
          }
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
  }, [refreshBackendData]);

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

  /* Staff session */
  const [isStaff, setIsStaff] = useState(() => {
    const session = load<{ until: number }>(KEYS.staffSession);
    return !!session && session.until > Date.now();
  });

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

  const getOrder = useCallback((id: string) => orders.find((o) => o.id.toUpperCase() === id.toUpperCase()), [orders]);

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
        id: newOrderId(ordersRef.current),
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

      const updatedProducts = adjustStock(productsRef.current, order.items, -1);
      persistProducts(updatedProducts);
      persistOrders([order, ...ordersRef.current]);
      setCartLines([]);
      setCouponCode(null);

      const details: CustomerDetails = { ...input.customer, address: input.address ?? savedCustomer?.address };
      setSavedCustomer(details);
      save(KEYS.customer, details);

      // Save order to Supabase
      insertOrderDb(order).then((ok) => {
        if (!ok) {
          console.warn('Supabase order insert failed, order saved locally.');
        }
      });

      // Update stocks in Supabase for each ordered item
      for (const item of order.items) {
        const prod = updatedProducts.find((p) => p.id === item.productId);
        if (prod) {
          updateProductStockDb(prod.id, prod.sizes);
        }
      }

      return order;
    },
    [cart, cartSubtotal, coupon, persistOrders, persistProducts, savedCustomer, showToast],
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

  /* ── Staff ── */

  const staffLogin = useCallback((password: string) => {
    const attempts = load<{ count: number; until: number }>(KEYS.loginAttempts) ?? { count: 0, until: 0 };
    if (attempts.until > Date.now()) {
      return `Too many wrong tries. Please wait ${Math.ceil((attempts.until - Date.now()) / 1000)} seconds.`;
    }
    const expected = load<string>(KEYS.staffPassword) ?? STORE_CONFIG.staffPasswordHash;
    if (sha256(password) === expected) {
      save(KEYS.staffSession, { until: Date.now() + STAFF_SESSION_DAYS * 86_400_000 });
      remove(KEYS.loginAttempts);
      setIsStaff(true);
      return null;
    }
    const count = attempts.count + 1;
    if (count >= MAX_LOGIN_TRIES) {
      save(KEYS.loginAttempts, { count: 0, until: Date.now() + LOCKOUT_MS });
      return 'Too many wrong tries. Please wait a minute and try again.';
    }
    save(KEYS.loginAttempts, { count, until: 0 });
    return 'Wrong password. Please try again.';
  }, []);

  const staffLogout = useCallback(() => {
    remove(KEYS.staffSession);
    setIsStaff(false);
  }, []);

  const changeStaffPassword = useCallback((current: string, next: string) => {
    const expected = load<string>(KEYS.staffPassword) ?? STORE_CONFIG.staffPasswordHash;
    if (sha256(current) !== expected) return 'Your current password is not correct.';
    if (next.trim().length < 6) return 'The new password needs at least 6 characters.';
    if (!save(KEYS.staffPassword, sha256(next))) return 'Could not save.';
    return null;
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
    getOrder,
    placeOrder,
    setOrderStatus,
    setOrderPaid,
    savedCustomer,
    isStaff,
    staffLogin,
    staffLogout,
    changeStaffPassword,
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
