/**
 * Everything about the shop lives here. Change a value once and it updates
 * across the whole site (header, footer, checkout, policies, receipts, WhatsApp).
 */
import type { Coupon } from '../types';

export const STORE_CONFIG = {
  name: 'Brand Yuva',
  tagline: 'Run for fashion',
  shortName: 'BY',
  /** Brand logos in /public */
  logos: {
    /** Round badge — header, favicon */
    round: '/brand-logo-round.png',
    /** Wide "Brand Yuva · Run for fashion" banner — footer, staff login */
    banner: '/brand-logo-cropped.png',
    /** Square — phone home-screen icon and link previews */
    square: '/brand-logo-full.png',
  },
  description: "Men's clothing store in Drugmulla, Kupwara.",

  hero: {
    title: 'Everyday clothes for men',
    subtitle: 'Shirts, t-shirts, jeans, trousers and jackets. Order online or visit us in Drugmulla, Kupwara.',
    /** Photo of the shop. A smaller copy is used on phones to save data. */
    image: '/store-hero.webp',
    imageSmall: '/store-hero-720.webp',
  },

  address: {
    line1: 'Near JK Bank, Boys Higher Secondary Road',
    locality: 'Drugmulla',
    city: 'Kupwara',
    state: 'Jammu and Kashmir',
    pincode: '193222',
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Near+JK+Bank+Drugmulla+Kupwara+193222',
    mapsEmbedUrl: 'https://www.google.com/maps?q=Near+JK+Bank+Drugmulla+Kupwara+193222&output=embed',
  },

  contact: {
    /** 10-digit Indian mobile number, digits only */
    phone: '9797064286',
    /** WhatsApp number, digits only (usually the same as phone) */
    whatsapp: '9797064286',
    email: 'lonemehraj45@gmail.com',
  },

  /** 24-hour clock, India time. */
  hours: {
    open: '10:00',
    close: '20:30',
    days: 'Open all 7 days',
  },

  socials: {
    instagram: { url: 'https://www.instagram.com/brandyuva_official/', handle: '@brandyuva_official' },
    facebook: { url: 'https://www.facebook.com/lonemehraj29', handle: 'lonemehraj29' },
  },

  delivery: {
    /** Orders at or above this amount get free home delivery */
    freeAbove: 999,
    /** Delivery charge for smaller orders */
    fee: 99,
    /** Shown on product, checkout and policy pages */
    estimate: '2–5 days',
    /** Let customers collect from the shop for free */
    pickup: true,
  },

  /** Days after delivery within which a size exchange is accepted */
  exchangeDays: 7,

  payments: {
    cashOnDelivery: true,
    /**
     * Your UPI ID, e.g. 'brandyuwa@okaxis'. Leave empty to hide UPI at checkout.
     * When set, customers get a "Pay by UPI" button after ordering.
     */
    upiId: '',
  },

  /** Add discount codes here, e.g. { code: 'EID10', percentOff: 10, minOrder: 999 } */
  coupons: [] as Coupon[],

  /** GST number. Printed on receipts when filled in. */
  gstin: '',

  /** Products with this many units or fewer (in total) are flagged as "running low" */
  lowStockAt: 5,

  /**
   * SHA-256 hash of the default staff password ("brandyuwa2026").
   * The shopkeeper can change the password from Staff area → Settings.
   */
  staffPasswordHash: '2a97e415a812d38175a076aec96f765bf7b5184adec2ec95e35884609a9ba297',
};

export const phoneDisplay = (digits: string) =>
  digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : digits;

export const STORE_PHONE_DISPLAY = phoneDisplay(STORE_CONFIG.contact.phone);
export const STORE_TEL = `tel:+91${STORE_CONFIG.contact.phone}`;
export const STORE_ADDRESS_FULL = `${STORE_CONFIG.address.line1}, ${STORE_CONFIG.address.locality}, ${STORE_CONFIG.address.city} ${STORE_CONFIG.address.pincode}, ${STORE_CONFIG.address.state}`;

export const whatsappLink = (message?: string) =>
  `https://wa.me/91${STORE_CONFIG.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
