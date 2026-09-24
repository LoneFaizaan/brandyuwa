/**
 * All saving happens through this file. Today data is kept in the browser
 * (localStorage). To connect a real backend later, replace these functions.
 */
const PREFIX = 'by:v3:';

// Clear data saved by older versions (fresh start for every browser)
try {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const k = localStorage.key(i);
    if (k && (k.startsWith('by:v2:') || k.startsWith('brandyuwa_'))) localStorage.removeItem(k);
  }
} catch {
  /* storage unavailable */
}

export const KEYS = {
  products: 'products',
  orders: 'orders',
  cart: 'cart',
  saved: 'saved',
  customer: 'customer',
  coupon: 'coupon',
  recentSearches: 'recent-searches',
  staffSession: 'staff-session',
  staffPassword: 'staff-password',
  loginAttempts: 'login-attempts',
} as const;

export type StorageKey = (typeof KEYS)[keyof typeof KEYS];

export function load<T>(key: StorageKey): T | null {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw === null ? null : (JSON.parse(raw) as T);
  } catch {
    return null;
  }
}

/** Returns false when the value could not be saved (usually because storage is full). */
export function save(key: StorageKey, value: unknown): boolean {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function remove(key: StorageKey) {
  try {
    localStorage.removeItem(PREFIX + key);
  } catch {
    /* storage unavailable */
  }
}

/** Rough size of everything this site has saved, in bytes. Browsers allow about 5 MB. */
export function usedBytes(): number {
  try {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) total += (k.length + (localStorage.getItem(k)?.length ?? 0)) * 2;
    }
    return total;
  } catch {
    return 0;
  }
}

export const STORAGE_LIMIT_BYTES = 5 * 1024 * 1024;
