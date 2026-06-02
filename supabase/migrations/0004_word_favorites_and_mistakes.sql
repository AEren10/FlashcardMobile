-- ============================================================
-- 0004 — Kelime favorileri + otomatik "Bilemediğin Kelimeler" listesi
-- ============================================================

-- 1) favorite_words: kullanıcı × kelime favorileri
CREATE TABLE IF NOT EXISTS favorite_words (
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id     UUID NOT NULL REFERENCES words(id)       ON DELETE CASCADE,
  list_id     UUID          REFERENCES lists(id)       ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_fw_user ON favorite_words (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fw_list ON favorite_words (list_id);

ALTER TABLE favorite_words ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS fw_all ON favorite_words;
CREATE POLICY fw_all ON favorite_words FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 2) lists tablosuna meta: otomatik üretilen liste mi, hangi tipte?
ALTER TABLE lists ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE lists ADD COLUMN IF NOT EXISTS kind TEXT;
-- kind örnekleri: 'mistakes' (Bilemediğin Kelimeler), null = normal kullanıcı/public listesi

CREATE INDEX IF NOT EXISTS idx_lists_kind ON lists (user_id, kind) WHERE kind IS NOT NULL;

-- 3) word_progress'a "mistakes listesinde üst üste doğru" sayacı
ALTER TABLE word_progress ADD COLUMN IF NOT EXISTS mistakes_streak INTEGER NOT NULL DEFAULT 0;

-- 4) RPC: kelimeleri kullanıcının mistakes listesine ekle (varsa upsert, yoksa oluştur)
CREATE OR REPLACE FUNCTION add_to_mistakes_list(p_word_ids UUID[])
RETURNS TABLE(list_id UUID, added_count INTEGER)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_list_id UUID;
  v_added   INTEGER := 0;
  v_max_pos INTEGER := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  -- Kullanıcının mistakes listesini bul ya da oluştur
  SELECT id INTO v_list_id
    FROM lists
   WHERE user_id = v_user_id AND kind = 'mistakes'
   LIMIT 1;

  IF v_list_id IS NULL THEN
    INSERT INTO lists (user_id, title, description, level, category, is_public, auto_generated, kind)
    VALUES (
      v_user_id,
      'Bilemediğin Kelimeler',
      'Çalışmalarında takıldığın kelimeler burada birikir. 3 kez doğru bilirsen otomatik çıkar.',
      'Mixed',
      'mistakes',
      false,
      true,
      'mistakes'
    )
    RETURNING id INTO v_list_id;
  END IF;

  -- Mevcut max position'ı al (sıralı eklemek için)
  SELECT COALESCE(MAX(position), 0) INTO v_max_pos
    FROM words WHERE list_id = v_list_id;

  -- Verilen word_id'leri kopyala — duplicate kontrolü için word+meaning ile bak
  WITH src AS (
    SELECT id, word, meaning, example
      FROM words
     WHERE id = ANY(p_word_ids)
  ),
  new_rows AS (
    INSERT INTO words (list_id, word, meaning, example, position)
    SELECT v_list_id, s.word, s.meaning, s.example,
           v_max_pos + ROW_NUMBER() OVER (ORDER BY s.word)
      FROM src s
     WHERE NOT EXISTS (
       SELECT 1 FROM words w
        WHERE w.list_id = v_list_id
          AND w.word = s.word
          AND w.meaning = s.meaning
     )
    RETURNING 1
  )
  SELECT COUNT(*) INTO v_added FROM new_rows;

  -- Eklenen kelimelerin mistakes_streak'ini sıfırla
  UPDATE word_progress
     SET mistakes_streak = 0
   WHERE user_id = v_user_id
     AND word_id IN (
       SELECT id FROM words WHERE list_id = v_list_id
     );

  RETURN QUERY SELECT v_list_id, v_added;
END;
$$;

GRANT EXECUTE ON FUNCTION add_to_mistakes_list(UUID[]) TO authenticated;

-- 5) RPC: mistakes listesinden bir kelimeyi sil (3 doğru sonrası client çağırır)
CREATE OR REPLACE FUNCTION remove_from_mistakes_list(p_word_text TEXT, p_meaning_text TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_list_id UUID;
  v_removed INTEGER := 0;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not authenticated';
  END IF;

  SELECT id INTO v_list_id
    FROM lists
   WHERE user_id = v_user_id AND kind = 'mistakes'
   LIMIT 1;

  IF v_list_id IS NULL THEN
    RETURN false;
  END IF;

  WITH deleted AS (
    DELETE FROM words
     WHERE list_id = v_list_id
       AND word = p_word_text
       AND meaning = p_meaning_text
    RETURNING 1
  )
  SELECT COUNT(*) INTO v_removed FROM deleted;

  RETURN v_removed > 0;
END;
$$;

GRANT EXECUTE ON FUNCTION remove_from_mistakes_list(TEXT, TEXT) TO authenticated;
