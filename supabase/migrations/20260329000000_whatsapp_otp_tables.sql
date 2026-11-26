-- ─────────────────────────────────────────────────────────────────────────────
-- WhatsApp OTP Authentication Tables
-- Used by the whatsapp-auth Edge Function (bypasses Supabase phone provider)
-- ─────────────────────────────────────────────────────────────────────────────

-- Table: whatsapp_otp_codes
-- Stores short-lived, hashed OTP codes keyed by E.164 phone number.
-- Only the Edge Function (service_role) may read/write this table.
CREATE TABLE IF NOT EXISTS public.whatsapp_otp_codes (
  phone            TEXT        PRIMARY KEY,          -- E.164 e.g. +919876543210
  otp_hash         TEXT        NOT NULL,             -- HMAC-SHA256 hex of the OTP
  expires_at       TIMESTAMPTZ NOT NULL,             -- Hard expiry (10 min)
  send_attempts    INTEGER     NOT NULL DEFAULT 0,   -- OTP send count (rate-limit)
  verify_attempts  INTEGER     NOT NULL DEFAULT 0,   -- OTP verify count (brute-force guard)
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- Block all public / authenticated access; only service_role (Edge Function) can touch it.
ALTER TABLE public.whatsapp_otp_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "deny_all_anon"          ON public.whatsapp_otp_codes FOR ALL TO anon          USING (false);
CREATE POLICY "deny_all_authenticated" ON public.whatsapp_otp_codes FOR ALL TO authenticated USING (false);
-- ─────────────────────────────────────────────────────────────────────────────
-- Helper: look up a user in auth.users by phone number.
-- Called from the Edge Function via adminClient.rpc().
-- SECURITY DEFINER so it can read the private auth schema.
-- REVOKED from public; only service_role may execute.
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_auth_user_by_phone(p_phone TEXT)
RETURNS TABLE(id UUID, phone TEXT, email TEXT)
LANGUAGE SQL
SECURITY DEFINER
SET search_path = auth, public, pg_temp
AS $$
  SELECT id, phone::TEXT, email::TEXT
  FROM auth.users
  WHERE phone = p_phone
  LIMIT 1;
$$;
REVOKE ALL ON FUNCTION public.get_auth_user_by_phone(TEXT) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_auth_user_by_phone(TEXT) TO service_role;
-- ─────────────────────────────────────────────────────────────────────────────
-- Housekeeping: auto-delete expired OTP rows so the table stays lean.
-- (Optional: call from a pg_cron job or let the Edge Function clean up.)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.cleanup_expired_otp_codes()
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
  DELETE FROM public.whatsapp_otp_codes WHERE expires_at < NOW();
$$;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_otp_codes() TO service_role;
