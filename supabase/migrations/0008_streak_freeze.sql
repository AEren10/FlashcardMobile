-- 0008_streak_freeze.sql
-- Streak Freeze — kullanıcı 1 gün atlasa bile streak korunur (haftada 1 hak).
-- Duolingo'nun retention motoru, %48 streak survival artırıyor.
--
-- Şema:
--   profiles.freeze_count       — bu hafta kalan freeze hakkı (0 veya 1)
--   profiles.freeze_last_used   — son freeze kullanım zamanı (haftalık reset için)
--
-- Reset mantığı:
--   freeze_last_used == NULL → daima 1 hak
--   freeze_last_used >= NOW() - INTERVAL '7 days' → kullanılmış, henüz yenilenmedi
--   freeze_last_used <  NOW() - INTERVAL '7 days' → 1 yeni hak verilir
--
-- Pro kullanıcılara haftada 3 hak (ileride genişletilir).

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS freeze_count INT DEFAULT 1 NOT NULL,
  ADD COLUMN IF NOT EXISTS freeze_last_used TIMESTAMPTZ;

COMMENT ON COLUMN profiles.freeze_count IS 'Kullanıcının kalan haftalık streak freeze hakkı';
COMMENT ON COLUMN profiles.freeze_last_used IS 'Son freeze kullanım zamanı';

-- ─────────────────────────────────────────────
-- RPC: streak freeze durumunu sorgula
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_freeze_status()
RETURNS TABLE (
  can_use BOOLEAN,
  available INT,
  next_reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  uid UUID := auth.uid();
  fc INT;
  flu TIMESTAMPTZ;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  SELECT freeze_count, freeze_last_used INTO fc, flu
  FROM profiles WHERE id = uid;

  -- Hiç kullanmadıysa veya 7 gün geçtiyse 1 hak ver
  IF flu IS NULL OR flu < NOW() - INTERVAL '7 days' THEN
    RETURN QUERY SELECT TRUE, 1, NULL::TIMESTAMPTZ;
  ELSE
    RETURN QUERY SELECT FALSE, 0, flu + INTERVAL '7 days';
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION get_freeze_status() TO authenticated;

-- ─────────────────────────────────────────────
-- RPC: streak freeze kullan (haftalık 1 hak)
-- ─────────────────────────────────────────────
CREATE OR REPLACE FUNCTION consume_streak_freeze()
RETURNS TABLE (
  success BOOLEAN,
  message TEXT,
  next_reset_at TIMESTAMPTZ
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  uid UUID := auth.uid();
  flu TIMESTAMPTZ;
BEGIN
  IF uid IS NULL THEN
    RETURN QUERY SELECT FALSE, 'unauthorized'::TEXT, NULL::TIMESTAMPTZ;
    RETURN;
  END IF;

  SELECT freeze_last_used INTO flu FROM profiles WHERE id = uid;

  -- Eğer 7 günden kısa süre önce kullanılmışsa reddet
  IF flu IS NOT NULL AND flu >= NOW() - INTERVAL '7 days' THEN
    RETURN QUERY SELECT FALSE, 'freeze_already_used'::TEXT, flu + INTERVAL '7 days';
    RETURN;
  END IF;

  -- Kullan
  UPDATE profiles
  SET freeze_count = GREATEST(freeze_count - 1, 0),
      freeze_last_used = NOW()
  WHERE id = uid;

  RETURN QUERY SELECT TRUE, 'frozen'::TEXT, (NOW() + INTERVAL '7 days')::TIMESTAMPTZ;
END;
$$;

GRANT EXECUTE ON FUNCTION consume_streak_freeze() TO authenticated;
