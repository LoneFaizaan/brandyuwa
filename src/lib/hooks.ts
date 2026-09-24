import { useEffect, useRef } from 'react';
import { STORE_CONFIG } from '../data/storeConfig';

let lockCount = 0;

/** Stops the page behind a sheet or dialog from scrolling. */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;
    lockCount++;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      lockCount--;
      if (lockCount === 0) document.body.style.overflow = prev;
    };
  }, [active]);
}

export function useEscapeKey(active: boolean, onEscape: () => void) {
  const handler = useRef(onEscape);
  handler.current = onEscape;
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handler.current();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active]);
}

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${STORE_CONFIG.name}` : `${STORE_CONFIG.name} — Men's Clothing, Kupwara`;
  }, [title]);
}

/** Is the shop open right now (India time)? */
export function isStoreOpenNow(): boolean {
  try {
    const parts = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(new Date());
    const h = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
    const m = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
    const now = h * 60 + m;
    const toMinutes = (t: string) => {
      const [hh, mm] = t.split(':').map(Number);
      return hh * 60 + mm;
    };
    return now >= toMinutes(STORE_CONFIG.hours.open) && now < toMinutes(STORE_CONFIG.hours.close);
  } catch {
    return false;
  }
}

export const formatHour = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')} ${suffix}` : `${hour} ${suffix}`;
};

export const OPENING_HOURS = `${formatHour(STORE_CONFIG.hours.open)} – ${formatHour(STORE_CONFIG.hours.close)}`;
