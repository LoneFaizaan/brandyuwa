-- Login codes are now sent only by the staff-login Edge Function, after it has checked the
-- staff password. Supabase Auth itself never sends an email any more (send-email hook below),
-- so its /otp, recovery and invite endpoints can't be used to email the staff, and staff
-- logins don't depend on Auth's shared email quota.

DROP FUNCTION IF EXISTS public.consume_staff_login_ticket(TEXT);
DROP TABLE IF EXISTS public.staff_login_tickets;

ALTER TABLE public.staff_members
  ADD COLUMN IF NOT EXISTS last_code_sent_at TIMESTAMPTZ;

-- Called by the staff-login Edge Function. Returns 'ok' (send a code now), 'invalid',
-- 'locked' or 'wait' (a code was sent less than a minute ago).
-- Unknown emails get the same answer as a wrong password.
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

  IF m.last_code_sent_at > now() - interval '60 seconds' THEN
    RETURN 'wait';
  END IF;

  UPDATE public.staff_members SET last_code_sent_at = now() WHERE email = v_email;
  RETURN 'ok';
END;
$$;

-- Only the Edge Function may check passwords
REVOKE EXECUTE ON FUNCTION public.request_staff_login(TEXT, TEXT) FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.request_staff_login(TEXT, TEXT) TO service_role;

-- Auth send-email hook: refuse every email Supabase Auth would send by itself
CREATE OR REPLACE FUNCTION public.hook_send_email(event JSONB)
RETURNS JSONB
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  SELECT jsonb_build_object(
    'error', jsonb_build_object('http_code', 403, 'message', 'Use the staff login page to get a login code.')
  );
$$;

GRANT EXECUTE ON FUNCTION public.hook_send_email(JSONB) TO supabase_auth_admin;
REVOKE EXECUTE ON FUNCTION public.hook_send_email(JSONB) FROM public, anon, authenticated;
