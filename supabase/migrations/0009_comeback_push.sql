-- 0009_comeback_push.sql
-- Comeback Push — kullanıcı X gün absent kalırsa kişiselleştirilmiş push.
--
-- Akış:
--   1. App açıldığında client `expo_push_token` ve `last_active_at` yazar
--   2. Supabase Edge Function (`comeback-push`) günde 1 kez (pg_cron 11:00 UTC) çalışır:
--      - SELECT users WHERE last_active_at <= NOW() - 3d AND last_active_at >= NOW() - 8d
--      - Her birine Expo Push API ile özel mesaj
--      - `comeback_pushes`'a kayıt (idempotency — aynı user'a aynı gün 2x atma)
--
-- Mesaj kişisel:
--   - streak vardı → "🔥 X günlük serini kaybetme"
--   - favori kelime varsa → "📚 'serendipity' dahil X kelimen bekliyor"
--   - 7+ gün → "👋 Eksikliğin hissediliyor — yeni X liste eklendi"

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS expo_push_token TEXT,
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

COMMENT ON COLUMN profiles.expo_push_token IS 'Expo Push token (cihaz değişince güncellenir)';
COMMENT ON COLUMN profiles.last_active_at IS 'Kullanıcının son aktif olduğu zaman — comeback trigger için';

CREATE INDEX IF NOT EXISTS idx_profiles_last_active
  ON profiles(last_active_at)
  WHERE expo_push_token IS NOT NULL;

-- ─────────────────────────────────────────────
-- Comeback push gönderim kaydı (idempotency)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS comeback_pushes (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  days_absent INT NOT NULL,
  message_kind TEXT NOT NULL,
  delivered BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS idx_comeback_user_date
  ON comeback_pushes(user_id, sent_at DESC);

-- NOT: Aynı gün uniqueness için partial index date_trunc() IMMUTABLE değil — kullanılmıyor.
-- get_comeback_candidates() RPC zaten NOT EXISTS (date_trunc('day', sent_at) = today) ile kontrol ediyor.

ALTER TABLE comeback_pushes ENABLE ROW LEVEL SECURITY;
-- Sadece service role görür (edge function service key ile çağırır)
CREATE POLICY "service_only_select" ON comeback_pushes
  FOR SELECT USING (false);

-- ─────────────────────────────────────────────
-- RPC: Last active update (client her app open'da çağırır)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION touch_last_active()
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() IS NOT NULL THEN
    UPDATE profiles SET last_active_at = NOW() WHERE id = auth.uid();
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION touch_last_active() TO authenticated;

-- ─────────────────────────────────────────────
-- RPC: Push token kayıt (client expo token aldığında çağırır)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION register_push_token(p_token TEXT)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  IF auth.uid() IS NOT NULL AND p_token IS NOT NULL THEN
    UPDATE profiles SET expo_push_token = p_token WHERE id = auth.uid();
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION register_push_token(TEXT) TO authenticated;

-- ─────────────────────────────────────────────
-- RPC: Edge function'ın çağıracağı adaylar listesi (3-8 gün absent)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_comeback_candidates()
RETURNS TABLE (
  user_id UUID,
  push_token TEXT,
  days_absent INT,
  display_name TEXT,
  streak_days INT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.expo_push_token,
    EXTRACT(DAY FROM NOW() - p.last_active_at)::INT,
    p.display_name,
    COALESCE(p.streak_days, 0)
  FROM profiles p
  WHERE p.expo_push_token IS NOT NULL
    AND p.last_active_at IS NOT NULL
    AND p.last_active_at <= NOW() - INTERVAL '3 days'
    AND p.last_active_at >= NOW() - INTERVAL '8 days'
    -- Bugün zaten gönderilmediyse
    AND NOT EXISTS (
      SELECT 1 FROM comeback_pushes cp
      WHERE cp.user_id = p.id
        AND date_trunc('day', cp.sent_at) = date_trunc('day', NOW())
    );
END;
$$;
-- Sadece service role çağırabilir (edge function service_role key ile)
REVOKE EXECUTE ON FUNCTION get_comeback_candidates() FROM PUBLIC, authenticated;

-- ─────────────────────────────────────────────
-- pg_cron schedule (Supabase Dashboard → Database → Extensions → pg_cron'u aktive et)
-- Aşağıdaki query'yi Supabase SQL Editor'da bir kez çalıştır:
--
--   SELECT cron.schedule(
--     'comeback-push-daily',
--     '0 8 * * *',  -- her gün 08:00 UTC (TR 11:00)
--     $$
--       SELECT net.http_post(
--         url := 'https://<project-ref>.supabase.co/functions/v1/comeback-push',
--         headers := jsonb_build_object(
--           'Authorization', 'Bearer <service-role-key>',
--           'Content-Type', 'application/json'
--         )
--       );
--     $$
--   );
-- ─────────────────────────────────────────────
