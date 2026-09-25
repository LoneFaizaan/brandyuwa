-- Staff must enter their password before a login code is emailed.
--
-- 1. request_staff_login() checks the password and opens a short ticket.
-- 2. Supabase Auth hands every email to the send-email Edge Function (auth send-email hook),
--    which sends a login code only while a ticket is open and refuses every other email.
-- So nobody can make Supabase email the staff without knowing a staff password.

ALTER TABLE public.staff_members
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS failed_attempts INT NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;

-- Open after a correct password: allows a few code emails for a few minutes
CREATE TABLE IF NOT EXISTS public.staff_login_tickets (
  email TEXT PRIMARY KEY REFERENCES public.staff_members(email) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL,
  emails_left INT NOT NULL
);

ALTER TABLE public.staff_login_tickets ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON TABLE public.staff_login_tickets FROM anon, authenticated;

/* ───────────────────────── Login step 1: password ───────────────────────── */

-- Returns 'ok', 'invalid' or 'locked'. Unknown emails get the same answer as a wrong password.
CREATE OR REPLACE FUNCTION public.request_staff_login(p_email TEXT, p_password TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email TEXT := lower(trim(coalesce(p_email, '')));
  m public.staff_members;
BEGIN
  SELECT * INTO m FROM public.staff_members WHERE email = v_email FOR UPDATE;

  IF NOT FOUND OR m.password_hash IS NULL THEN
    -- Same work as a real check, so the answer time doesn't reveal staff emails
    PERFORM extensions.crypt(coalesce(p_password, ''), extensions.gen_salt('bf', 10));
    RETURN 'invalid';
  END IF;

  IF m.locked_until > now() THEN
    RETURN 'locked';
  END IF;

  IF extensions.crypt(coalesce(p_password, ''), m.password_hash) IS DISTINCT FROM m.password_hash THEN
    -- 5 wrong passwords in a row lock the email for 15 minutes
    UPDATE public.staff_members
       SET failed_attempts = CASE WHEN failed_attempts + 1 >= 5 THEN 0 ELSE failed_attempts + 1 END,
           locked_until = CASE WHEN failed_attempts + 1 >= 5 THEN now() + interval '15 minutes' ELSE locked_until END
     WHERE email = v_email;
    RETURN CASE WHEN m.failed_attempts + 1 >= 5 THEN 'locked' ELSE 'invalid' END;
  END IF;

  UPDATE public.staff_members SET failed_attempts = 0, locked_until = NULL WHERE email = v_email;

  INSERT INTO public.staff_login_tickets (email, expires_at, emails_left)
  VALUES (v_email, now() + interval '10 minutes', 3)
  ON CONFLICT (email) DO UPDATE SET expires_at = excluded.expires_at, emails_left = excluded.emails_left;

  RETURN 'ok';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.request_staff_login(TEXT, TEXT) FROM public;
GRANT EXECUTE ON FUNCTION public.request_staff_login(TEXT, TEXT) TO anon, authenticated;

/* ───────────────────────── Login step 2: code email ───────────────────────── */

-- Called by the send-email Edge Function (service role) before it sends a login code
CREATE OR REPLACE FUNCTION public.consume_staff_login_ticket(p_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  UPDATE public.staff_login_tickets
     SET emails_left = emails_left - 1
   WHERE email = lower(trim(coalesce(p_email, '')))
     AND expires_at > now()
     AND emails_left > 0;
  RETURN FOUND;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.consume_staff_login_ticket(TEXT) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.consume_staff_login_ticket(TEXT) TO service_role;

/* ───────────────────────── Passwords ───────────────────────── */

-- For the site owner, from the Supabase SQL editor:
--   select public.set_staff_password('someone@gmail.com', 'a long password');
CREATE OR REPLACE FUNCTION public.set_staff_password(p_email TEXT, p_password TEXT)
RETURNS VOID
LANGUAGE plpgsql
SET search_path = ''
AS $$
BEGIN
  IF length(coalesce(p_password, '')) < 8 THEN
    RAISE EXCEPTION 'The password needs at least 8 characters';
  END IF;

  UPDATE public.staff_members
     SET password_hash = extensions.crypt(p_password, extensions.gen_salt('bf', 10)),
         failed_attempts = 0,
         locked_until = NULL
   WHERE email = lower(trim(p_email));

  IF NOT FOUND THEN
    RAISE EXCEPTION '% is not in staff_members', p_email;
  END IF;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.set_staff_password(TEXT, TEXT) FROM public, anon, authenticated;

-- For logged-in staff, from Settings. Returns 'ok', 'invalid' (wrong current password) or 'too_short'.
CREATE OR REPLACE FUNCTION public.change_staff_password(p_current TEXT, p_new TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_email TEXT := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_hash TEXT;
BEGIN
  SELECT password_hash INTO v_hash FROM public.staff_members WHERE email = v_email;
  IF NOT FOUND OR v_hash IS NULL
     OR extensions.crypt(coalesce(p_current, ''), v_hash) IS DISTINCT FROM v_hash THEN
    RETURN 'invalid';
  END IF;
  IF length(coalesce(p_new, '')) < 8 THEN
    RETURN 'too_short';
  END IF;

  UPDATE public.staff_members
     SET password_hash = extensions.crypt(p_new, extensions.gen_salt('bf', 10))
   WHERE email = v_email;
  RETURN 'ok';
END;
$$;

REVOKE EXECUTE ON FUNCTION public.change_staff_password(TEXT, TEXT) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.change_staff_password(TEXT, TEXT) TO authenticated;
