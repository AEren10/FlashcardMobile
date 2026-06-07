-- =============================================================
-- word_sentences — alternatif örnek cümle deposu
-- Her kelimeye 1+ ek cümle. RPC ile rastgele, görülmeyen
-- cümle tercih edilerek getirilir. RLS açık.
-- =============================================================

CREATE TABLE IF NOT EXISTS word_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_id UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  sentence TEXT NOT NULL,
  sentence_tr TEXT,
  difficulty INT DEFAULT 2,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_word_sentences_word ON word_sentences (word_id);

-- Kullanıcı bazlı görülen cümle takip
CREATE TABLE IF NOT EXISTS user_sentence_seen (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sentence_id UUID NOT NULL REFERENCES word_sentences(id) ON DELETE CASCADE,
  seen_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, sentence_id)
);
CREATE INDEX IF NOT EXISTS idx_user_sentence_seen_user ON user_sentence_seen (user_id, seen_at);

-- Random cümle getir — kullanıcının görmediklerini tercih et
CREATE OR REPLACE FUNCTION get_random_sentence_for_word(p_word_id UUID)
RETURNS TABLE (id UUID, sentence TEXT, sentence_tr TEXT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  RETURN QUERY
  SELECT ws.id, ws.sentence, ws.sentence_tr
    FROM word_sentences ws
   WHERE ws.word_id = p_word_id
     AND (v_user_id IS NULL OR NOT EXISTS (
       SELECT 1 FROM user_sentence_seen uss
        WHERE uss.user_id = v_user_id AND uss.sentence_id = ws.id
          AND uss.seen_at > NOW() - INTERVAL '30 days'
     ))
   ORDER BY RANDOM()
   LIMIT 1;
END;
$$;
GRANT EXECUTE ON FUNCTION get_random_sentence_for_word(UUID) TO anon, authenticated;

-- Cümleyi görüldü olarak işaretle (idempotent)
CREATE OR REPLACE FUNCTION mark_sentence_seen(p_sentence_id UUID)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN RETURN; END IF;
  INSERT INTO user_sentence_seen (user_id, sentence_id) VALUES (v_user_id, p_sentence_id)
  ON CONFLICT (user_id, sentence_id) DO UPDATE SET seen_at = NOW();
END;
$$;
GRANT EXECUTE ON FUNCTION mark_sentence_seen(UUID) TO authenticated;

ALTER TABLE word_sentences ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "sentences_read_all" ON word_sentences;
CREATE POLICY "sentences_read_all" ON word_sentences FOR SELECT USING (true);
ALTER TABLE user_sentence_seen ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "seen_own_only" ON user_sentence_seen;
CREATE POLICY "seen_own_only" ON user_sentence_seen FOR ALL USING (auth.uid() = user_id);
