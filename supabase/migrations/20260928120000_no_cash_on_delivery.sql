-- No cash on delivery: customer orders must be paid by UPI, or at the shop for pickup orders.
-- Same as place_order() from 20260925120000_staff_email_otp.sql, plus the payment check.
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
  IF o.payment IS DISTINCT FROM 'upi' AND NOT (o.payment = 'store' AND o.fulfilment = 'pickup') THEN
    RAISE EXCEPTION 'Orders are paid by UPI, or at the shop for pickup';
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
