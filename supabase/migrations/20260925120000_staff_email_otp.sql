-- Staff login with Supabase email OTP.
--
-- Only emails listed in public.staff_members can create an account (enforced by
-- the before-user-created auth hook), and every change to products, orders and
-- product photos now needs a signed-in staff member. Customers keep read access
-- to published products and place orders through public.place_order().

/* ───────────────────────── Staff list ───────────────────────── */

CREATE TABLE IF NOT EXISTS public.staff_members (
  email TEXT PRIMARY KEY CHECK (email = lower(email)),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.staff_members ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.staff_members FROM anon, authenticated;

INSERT INTO public.staff_members (email) VALUES
  ('lonemehraj45@gmail.com'),
  ('faizanlone098@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- True when the signed-in user's email is on the staff list
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.staff_members s
    WHERE s.email = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM public;
GRANT EXECUTE ON FUNCTION public.is_staff() TO anon, authenticated;

/* ───────────────────────── Auth hook ───────────────────────── */

-- Runs before Supabase Auth creates any user: refuses every email not on the staff list,
-- so an OTP code can never be sent to (or used by) anyone else.
CREATE OR REPLACE FUNCTION public.hook_before_user_created(event JSONB)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SET search_path = ''
AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM public.staff_members s
    WHERE s.email = lower(coalesce(event -> 'user' ->> 'email', ''))
  ) THEN
    RETURN '{}'::jsonb;
  END IF;

  RETURN jsonb_build_object(
    'error', jsonb_build_object('http_code', 403, 'message', 'This email does not have staff access.')
  );
END;
$$;

GRANT USAGE ON SCHEMA public TO supabase_auth_admin;
GRANT EXECUTE ON FUNCTION public.hook_before_user_created(JSONB) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.hook_before_user_created(JSONB) FROM public, anon, authenticated;

GRANT SELECT ON TABLE public.staff_members TO supabase_auth_admin;
DROP POLICY IF EXISTS "Auth reads staff list" ON public.staff_members;
CREATE POLICY "Auth reads staff list"
  ON public.staff_members
  FOR SELECT
  TO supabase_auth_admin
  USING (true);

/* ───────────────────────── Products ───────────────────────── */

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Public manage products" ON public.products;

CREATE POLICY "Public read products"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (published OR (SELECT public.is_staff()));

CREATE POLICY "Staff add products"
  ON public.products
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT public.is_staff()));

CREATE POLICY "Staff update products"
  ON public.products
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_staff()))
  WITH CHECK ((SELECT public.is_staff()));

CREATE POLICY "Staff delete products"
  ON public.products
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_staff()));

/* ───────────────────────── Orders ───────────────────────── */

DROP POLICY IF EXISTS "Public create orders" ON public.orders;
DROP POLICY IF EXISTS "Public view orders" ON public.orders;
DROP POLICY IF EXISTS "Public update orders" ON public.orders;
DROP POLICY IF EXISTS "Public delete orders" ON public.orders;

CREATE POLICY "Staff view orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING ((SELECT public.is_staff()));

-- Used when staff restore a backup; customers go through place_order()
CREATE POLICY "Staff add orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT public.is_staff()));

CREATE POLICY "Staff update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING ((SELECT public.is_staff()))
  WITH CHECK ((SELECT public.is_staff()));

CREATE POLICY "Staff delete orders"
  ON public.orders
  FOR DELETE
  TO authenticated
  USING ((SELECT public.is_staff()));

-- Saves a customer's order and takes the ordered pieces out of stock in one step.
-- Status, payment and timestamps are set here, not taken from the browser.
CREATE OR REPLACE FUNCTION public.place_order(p_order JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  o public.orders;
  item JSONB;
  qty INT;
BEGIN
  o := jsonb_populate_record(NULL::public.orders, p_order);

  IF o.id IS NULL OR o.id !~ '^BY-[0-9]{6}-[A-Z0-9]{3,8}$' THEN
    RAISE EXCEPTION 'Invalid order number';
  END IF;
  IF jsonb_typeof(o.items) IS DISTINCT FROM 'array' OR jsonb_array_length(o.items) NOT BETWEEN 1 AND 50 THEN
    RAISE EXCEPTION 'Invalid order items';
  END IF;

  o.created_at := now();
  o.status := 'new';
  o.paid := false;
  o.history := jsonb_build_array(jsonb_build_object('status', 'new', 'at', now()));

  INSERT INTO public.orders VALUES (o.*);

  FOR item IN SELECT value FROM jsonb_array_elements(o.items) LOOP
    qty := greatest(0, floor(coalesce((item ->> 'quantity')::numeric, 0))::int);
    UPDATE public.products p
       SET sizes = (
         SELECT coalesce(jsonb_agg(
                  CASE WHEN s ->> 'size' = item ->> 'size'
                       THEN jsonb_set(s, '{stock}', to_jsonb(greatest(0, floor(coalesce((s ->> 'stock')::numeric, 0))::int - qty)))
                       ELSE s
                  END ORDER BY t.ord), '[]'::jsonb)
           FROM jsonb_array_elements(p.sizes) WITH ORDINALITY AS t(s, ord)
       )
     WHERE p.id = item ->> 'productId';
  END LOOP;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.place_order(JSONB) FROM public;
GRANT EXECUTE ON FUNCTION public.place_order(JSONB) TO anon, authenticated;

-- Lets a customer refresh the orders saved on their device. Each lookup needs both the
-- order number and the phone number on the order, so orders can't be found by guessing numbers.
CREATE OR REPLACE FUNCTION public.get_my_orders(p_lookups JSONB)
RETURNS SETOF public.orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT o.*
    FROM jsonb_to_recordset(
           CASE WHEN jsonb_typeof(p_lookups) = 'array' THEN p_lookups ELSE '[]'::jsonb END
         ) AS l(id TEXT, phone TEXT)
    JOIN public.orders o ON o.id = l.id AND o.customer ->> 'phone' = l.phone
   LIMIT 50;
$$;

REVOKE EXECUTE ON FUNCTION public.get_my_orders(JSONB) FROM public;
GRANT EXECUTE ON FUNCTION public.get_my_orders(JSONB) TO anon, authenticated;

/* ───────────────────────── Product photos ───────────────────────── */

DROP POLICY IF EXISTS "Public Upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Public Delete product-images" ON storage.objects;

CREATE POLICY "Staff upload product-images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND (SELECT public.is_staff()));

CREATE POLICY "Staff update product-images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND (SELECT public.is_staff()))
  WITH CHECK (bucket_id = 'product-images' AND (SELECT public.is_staff()));

CREATE POLICY "Staff delete product-images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND (SELECT public.is_staff()));

/* ───────────────────────── Realtime ───────────────────────── */

-- The app listens for product and order changes; the policies above decide who receives them.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;
END $$;
