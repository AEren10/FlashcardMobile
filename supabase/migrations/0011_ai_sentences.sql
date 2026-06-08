-- 0011_ai_sentences.sql
-- AI cümle üretim cache'i — aynı kelime ikinci sefer çağrılırsa DB'den döner.
-- Cache hit ratio %70+ hedef → AI maliyeti düşük tutulur.
--
-- Yetki: tüm authenticated kullanıcılar okur (paylaşılan cache), yazma SECURITY DEFINER fonksiyon ile

CREATE TABLE IF NOT EXISTS ai_sentences (
  word TEXT PRIMARY KEY,
  sentence TEXT NOT NULL,
  translation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT DEFAULT 'haiku' -- haiku | stub | manual
);

CREATE INDEX IF NOT EXISTS idx_ai_sentences_word ON ai_sentences(word);

ALTER TABLE ai_sentences ENABLE ROW LEVEL SECURITY;

-- Herkes okuyabilir (cache shared)
DROP POLICY IF EXISTS "ai_sentences_select_all" ON ai_sentences;
CREATE POLICY "ai_sentences_select_all" ON ai_sentences
  FOR SELECT USING (true);

-- Insert/upsert için authenticated yetki (rate limit client-side; ileride RPC ile sıkılaştırılabilir)
DROP POLICY IF EXISTS "ai_sentences_insert_auth" ON ai_sentences;
CREATE POLICY "ai_sentences_insert_auth" ON ai_sentences
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "ai_sentences_update_auth" ON ai_sentences;
CREATE POLICY "ai_sentences_update_auth" ON ai_sentences
  FOR UPDATE USING (auth.uid() IS NOT NULL);

COMMENT ON TABLE ai_sentences IS 'AI üretilmiş kelime-bağlam cümle cache (Haiku + stub karması)';
