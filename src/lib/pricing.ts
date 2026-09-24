import type { Coupon, Fulfilment } from '../types';
import { STORE_CONFIG } from '../data/storeConfig';

export interface Totals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  /** Coupon entered but order is below its minimum */
  couponBelowMinimum: boolean;
}

export function calcTotals(subtotal: number, fulfilment: Fulfilment, coupon: Coupon | null): Totals {
  const couponApplies = !!coupon && subtotal >= coupon.minOrder;
  const discount = couponApplies ? Math.round((subtotal * coupon!.percentOff) / 100) : 0;
  const { freeAbove, fee } = STORE_CONFIG.delivery;
  const deliveryFee = fulfilment === 'pickup' || subtotal === 0 || subtotal >= freeAbove ? 0 : fee;
  return {
    subtotal,
    discount,
    deliveryFee,
    total: Math.max(0, subtotal - discount + deliveryFee),
    couponBelowMinimum: !!coupon && !couponApplies,
  };
}

export const amountForFreeDelivery = (subtotal: number) => Math.max(0, STORE_CONFIG.delivery.freeAbove - subtotal);
