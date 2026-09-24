# BrandYuwa — online shop

Mobile-first online shop for a men's clothing store in Drugmulla, Kupwara.
Built with React, TypeScript, Vite and Tailwind CSS.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production files in dist/
```

## Changing shop details

Everything about the shop is in **`src/data/storeConfig.ts`**: name, address, phone and
WhatsApp number, opening hours, social links, delivery charge and free-delivery amount,
exchange days, UPI ID, discount codes and GST number. Change a value there and it updates
across the whole site, including the policy pages and receipts.

Categories, sizes and the colour list used in the staff product form are in
`src/data/catalog.ts`.

## How orders work

There is no server yet. When a customer places an order:

1. The order is saved in their browser (they can see it under **My orders**).
2. Stock goes down on that device.
3. **WhatsApp opens with the full order** (items, sizes, total, address), addressed to the
   shop's number. The customer taps Send, and the shopkeeper confirms on WhatsApp.

Payment is cash on delivery, pay at the shop (for pickup), or UPI if `payments.upiId` is set.

## Staff area

Open `/#/admin` (or tap **Staff login** in the footer).

- Default password: **`brandyuwa2026`**. Change it straight away in **Settings**.
- **Products**: add or edit a product with photos from the phone camera, a price, sizes and stock.
- **Stock**: tap + / − when stock arrives or sells in the shop.
- **Orders**: move orders through Packed → Shipped/Ready → Delivered, and message the customer.
- **Settings**: change the password, download or restore a backup.

If the password is forgotten, clearing the site's data in the browser resets it to the
default (this also clears products saved in that browser — restore them from a backup).

## Important: what needs a backend

Products, stock and orders are saved **in the browser of the device that made the change**
(localStorage). This means:

- Products the shopkeeper adds are visible only on the shopkeeper's device, not to customers
  on other phones.
- The staff password check runs in the browser, so it keeps casual visitors out but is not
  real security.

Before going live with real products, connect a backend (for example Supabase or Firebase)
for products, orders, photo uploads and staff login. All saving goes through
`src/lib/storage.ts` and `src/context/StoreContext.tsx`, so these are the only places that
need to change. Until then, the starter products in `src/data/sampleProducts.ts` are what
customers see. Their photos are placeholders from Unsplash.
