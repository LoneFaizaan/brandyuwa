DROP POLICY IF EXISTS "Public delete orders" ON public.orders;

CREATE POLICY "Public delete orders"
  ON public.orders
  FOR DELETE
  TO anon, authenticated
  USING (true);
