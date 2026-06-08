-- 0010_get_study_words.sql
-- Study Mode gerçek filter — get_study_words RPC.
--
-- Modlar:
--   'all'       — listenin tüm kelimeleri (sıralı)
--   'smart'     — SRS due olanlar + hiç çalışılmamışlar (en faydalı default)
--   'new'       — sadece hiç çalışılmamış kelimeler
--   'mistakes'  — bilemediğin kelimeler (word_progress.lapses > 0 OR mistakes streak)
--
-- Yetki: authenticated, RLS words/lists/word_progress'a göre zaten yetki yapıyor

CREATE OR REPLACE FUNCTION get_study_words(
  p_list_id UUID,
  p_mode TEXT DEFAULT 'all',
  p_limit INT DEFAULT 200
)
RETURNS TABLE (
  id UUID,
  list_id UUID,
  word TEXT,
  meaning TEXT,
  example TEXT,
  example_translation TEXT,
  pron TEXT,
  "position" INT,
  due_at TIMESTAMPTZ,
  lapses INT
)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  uid UUID := auth.uid();
BEGIN
  IF uid IS NULL THEN
    RETURN;
  END IF;

  IF p_mode = 'smart' THEN
    -- SRS due olanlar önce, sonra hiç görmedikleri, son olarak görüldüğünden bu yana en eskiler
    RETURN QUERY
    SELECT
      w.id, w.list_id, w.word, w.meaning, w.example, w.example_translation, w.pron, w."position",
      wp.due_at, COALESCE(wp.lapses, 0)
    FROM words w
    LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = uid
    WHERE w.list_id = p_list_id
      AND (wp.due_at IS NULL OR wp.due_at <= NOW())
    ORDER BY
      CASE WHEN wp.due_at IS NULL THEN 1 ELSE 0 END,  -- önce due olanlar
      wp.due_at ASC NULLS LAST,
      w.position ASC
    LIMIT p_limit;

  ELSIF p_mode = 'new' THEN
    -- Hiç çalışılmamış (word_progress kaydı yok)
    RETURN QUERY
    SELECT
      w.id, w.list_id, w.word, w.meaning, w.example, w.example_translation, w.pron, w."position",
      NULL::TIMESTAMPTZ, 0
    FROM words w
    LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = uid
    WHERE w.list_id = p_list_id
      AND wp.id IS NULL
    ORDER BY w."position" ASC
    LIMIT p_limit;

  ELSIF p_mode = 'mistakes' THEN
    -- Bilemediğin kelimeler — lapse'i olanlar (en sık unutulan üstte)
    RETURN QUERY
    SELECT
      w.id, w.list_id, w.word, w.meaning, w.example, w.example_translation, w.pron, w."position",
      wp.due_at, wp.lapses
    FROM words w
    JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = uid
    WHERE w.list_id = p_list_id
      AND wp.lapses > 0
    ORDER BY wp.lapses DESC, wp.due_at ASC
    LIMIT p_limit;

  ELSE
    -- 'all' default — listenin tüm kelimeleri sırayla
    RETURN QUERY
    SELECT
      w.id, w.list_id, w.word, w.meaning, w.example, w.example_translation, w.pron, w."position",
      wp.due_at, COALESCE(wp.lapses, 0)
    FROM words w
    LEFT JOIN word_progress wp ON wp.word_id = w.id AND wp.user_id = uid
    WHERE w.list_id = p_list_id
    ORDER BY w."position" ASC
    LIMIT p_limit;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION get_study_words(UUID, TEXT, INT) TO authenticated;

COMMENT ON FUNCTION get_study_words IS 'StudyModeModal mod seçimine göre filtreli kelime listesi';
