-- ============================================================
-- 0006 — Words: Türkçe örnek cümle çevirisi (example_tr)
-- Amaç: FlashcardMobile back face'inde İngilizce cümleye ek
--       olarak Türkçe karşılığını göster — bağlam + öğrenme verimi.
-- ============================================================

-- 1) example_tr kolonu ekle (nullable — eski kayıtlar etkilenmez)
ALTER TABLE words
  ADD COLUMN IF NOT EXISTS example_tr TEXT;

-- 2) "Yanlış çeviri bildir" raporları — kullanıcı feedback tablosu
CREATE TABLE IF NOT EXISTS word_reports (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  word_id       UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  reason        TEXT NOT NULL DEFAULT 'wrong_translation', -- 'wrong_translation' | 'wrong_example' | 'other'
  note          TEXT,                                       -- opsiyonel kullanıcı notu
  status        TEXT NOT NULL DEFAULT 'pending',           -- 'pending' | 'resolved' | 'dismissed'
  inserted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_word_reports_word   ON word_reports (word_id);
CREATE INDEX IF NOT EXISTS idx_word_reports_user   ON word_reports (user_id);
CREATE INDEX IF NOT EXISTS idx_word_reports_status ON word_reports (status);

-- RLS — kullanıcı sadece kendi raporlarını görür/yazar
ALTER TABLE word_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "word_reports_select_own"
  ON word_reports FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "word_reports_insert_own"
  ON word_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- BATCH TRANSLATION NOTU (script önerisi):
--
-- Mevcut kelimelerin example_tr'sini doldurmak için node script:
--
--   1. SELECT id, word, example FROM words WHERE example_tr IS NULL AND example IS NOT NULL LIMIT 500;
--   2. Her batch için OpenAI/Anthropic API'sine gönder:
--      "Bu İngilizce cümleyi doğal Türkçeye çevir, 1 satır, kelime: {word}, cümle: {example}"
--   3. UPDATE words SET example_tr = ? WHERE id = ?;
--   4. Rate limit: 50 req/sec, 1000 kelime ~30 saniye, $0.001/kelime ~$5 toplam 5000 kelime
--
-- Script konumu: scripts/translate_examples.js (henüz yok, ihtiyaca göre yazılacak)
-- ============================================================
