-- ============================================================
-- 0002 — v_hard_words + v_daily_challenge
-- Supabase SQL Editor'a yapıştır, çalıştır.
-- 0001_schema.sql'den sonra çalıştır.
-- ============================================================

-- Zor kelimeler: lapses >= 2 (2+ kere unutulmuş) veya ease < 2.0
CREATE OR REPLACE VIEW v_hard_words AS
  SELECT w.*, wp.lapses, wp.ease, wp.due_at, wp.last_reviewed
  FROM words w
  JOIN word_progress wp ON wp.word_id = w.id
  WHERE wp.user_id = auth.uid()
    AND (wp.lapses >= 2 OR wp.ease < 2.0)
  ORDER BY wp.lapses DESC, wp.ease ASC;

-- Günlük challenge: bugün due olan ilk 10 kelime.
-- Due kelime yoksa son eklenen progress'siz kelimelerden 10 tane.
CREATE OR REPLACE VIEW v_daily_challenge AS
  WITH due AS (
    SELECT w.*, wp.due_at, 0 AS rank
    FROM words w
    JOIN word_progress wp ON wp.word_id = w.id
    WHERE wp.user_id = auth.uid() AND wp.due_at <= NOW()
    ORDER BY wp.due_at ASC
    LIMIT 10
  ),
  new_ones AS (
    SELECT w.*, NULL::TIMESTAMPTZ AS due_at, 1 AS rank
    FROM words w
    LEFT JOIN word_progress wp
      ON wp.word_id = w.id AND wp.user_id = auth.uid()
    WHERE wp.id IS NULL
    ORDER BY w.inserted_at DESC
    LIMIT 10
  )
  SELECT * FROM due
  UNION ALL
  SELECT * FROM new_ones
  ORDER BY rank ASC, due_at ASC NULLS LAST
  LIMIT 10;
