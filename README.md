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

Open `/#/admin` (or tap **Staff login** in the footer), enter a staff email and password, then
type in the 6-digit code that is emailed to you (valid for 10 minutes).

- **Products**: add or edit a product with photos from the phone camera, a price, sizes and stock.
- **Stock**: tap + / − when stock arrives or sells in the shop.
- **Orders**: move orders through Packed → Shipped/Ready → Delivered, and message the customer.
- **Settings**: see who is logged in, change your password, download or restore a backup.

### How staff login works

Everything is checked by Supabase, not the browser (`supabase/migrations/2026092512*` –
`2026092515*`, `supabase/functions/staff-login`):

1. The `staff-login` Edge Function checks the email + password against `public.staff_members`
   (bcrypt; 5 wrong tries lock that email for 15 minutes). Only then does it have Supabase Auth
   create a login code and email it through your SMTP account (one code a minute at most).
2. The app signs in with that code (`supabase.auth.verifyOtp`).

Supabase Auth never sends an email by itself (its send-email hook refuses them all), and it
won't create an account for any email that isn't in `staff_members`. So nobody can make it email
the staff, or anyone else, without a staff password.

Database policies allow changes to products, orders and product photos only for a logged-in staff
email. Customers can read published products, place orders through `place_order()`, and look up
their own orders by order number + phone through `get_my_orders()`.

### Setting up staff

Run these in the Supabase dashboard → SQL Editor.

Set or reset a password (at least 8 characters):

```sql
select public.set_staff_password('someone@gmail.com', 'their new password');
```

Add or remove staff (emails in lowercase):

```sql
insert into public.staff_members (email) values ('new.person@gmail.com');
delete from public.staff_members where email = 'old.person@gmail.com';
```

### Login emails

The login code is sent from an email account you own, over SMTP. With Gmail: turn on 2-Step
Verification for the sending account, create an **app password**
(Google Account → Security → App passwords), then run:

```bash
npx supabase secrets set SMTP_USER=shop.account@gmail.com SMTP_PASS="the 16-letter app password"
```

Another provider works too: also set `SMTP_HOST` and `SMTP_PORT` (port 465).

Auth settings (code length and expiry, the two auth hooks) live in `supabase/config.toml` and
are applied with `npx supabase config push`. After changing the function, deploy it with
`npx supabase functions deploy staff-login --use-api`.

## Important: what needs a backend

Products, stock and orders are saved **in the browser of the device that made the change**
(localStorage). This means:

- Products the shopkeeper adds are visible only on the shopkeeper's device, not to customers
  on other phones.

Before going live with real products, connect a backend (for example Supabase or Firebase)
for products, orders, photo uploads and staff login. All saving goes through
`src/lib/storage.ts` and `src/context/StoreContext.tsx`, so these are the only places that
need to change. Until then, the starter products in `src/data/sampleProducts.ts` are what
customers see. Their photos are placeholders from Unsplash.
