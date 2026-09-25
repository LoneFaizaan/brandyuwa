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

Open `/#/admin` (or tap **Staff login** in the footer), enter a staff email and type in the
6-digit code Supabase emails to it (valid for 10 minutes).

- **Products**: add or edit a product with photos from the phone camera, a price, sizes and stock.
- **Stock**: tap + / − when stock arrives or sells in the shop.
- **Orders**: move orders through Packed → Shipped/Ready → Delivered, and message the customer.
- **Settings**: see who is logged in, download or restore a backup.

### Who can log in

Staff access is checked by Supabase, not the browser
(`supabase/migrations/20260925120000_staff_email_otp.sql`):

- Only emails in the `public.staff_members` table can log in. A Supabase Auth hook refuses to
  create an account (or send a code) for any other email.
- Database policies allow changes to products, orders and product photos only for a logged-in
  staff email. Customers can read published products, place orders through `place_order()`,
  and look up their own orders by order number + phone through `get_my_orders()`.

To add or remove staff, edit the table in the Supabase dashboard (Table Editor →
`staff_members`, emails in lowercase) or run SQL:

```sql
insert into public.staff_members (email) values ('new.person@gmail.com');
delete from public.staff_members where email = 'old.person@gmail.com';
```

Auth settings (code length, expiry, the hook, email templates) live in `supabase/config.toml`
and are applied with `npx supabase config push`.

**Email sending:** Supabase's built-in sender only mails members of the Supabase team (about 2
emails an hour), and on the free plan it won't let the login email show a code. Set up a custom
SMTP sender (Dashboard → Authentication → Emails → SMTP Settings, e.g. Brevo, Resend or a Gmail
app password), then uncomment the template blocks in `supabase/config.toml` and run
`npx supabase config push`.

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
