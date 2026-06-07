-- Liste Bölme v2 — array_agg ile word_ids'i ÖNCE topla, sonra dilimle
-- Önceki versiyonda CTE her iterasyonda yeniden numaralandırıyordu, bug vardı.

DO $$
DECLARE
  lst RECORD;
  word_count_val INT;
  chunks_count INT;
  chunk_size_val INT;
  i INT;
  new_list_id UUID;
  word_ids UUID[];
  start_idx INT;
  end_idx INT;
BEGIN
  FOR lst IN
    SELECT l.id, l.title, l.category, l.level
    FROM lists l
    WHERE l.is_public = true
      AND (SELECT COUNT(*) FROM words w WHERE w.list_id = l.id) > 15
    ORDER BY l.title
  LOOP
    SELECT array_agg(id ORDER BY position, id) INTO word_ids
    FROM words WHERE list_id = lst.id;

    word_count_val := array_length(word_ids, 1);
    chunks_count := CEIL(word_count_val::FLOAT / 15);
    chunk_size_val := CEIL(word_count_val::FLOAT / chunks_count);

    FOR i IN 1..chunks_count LOOP
      INSERT INTO lists (title, category, level, is_public, inserted_at)
      VALUES (
        lst.title || ' · ' || i || '/' || chunks_count,
        lst.category,
        lst.level,
        true,
        NOW()
      )
      RETURNING id INTO new_list_id;

      start_idx := (i - 1) * chunk_size_val + 1;
      end_idx := LEAST(i * chunk_size_val, word_count_val);

      UPDATE words
      SET list_id = new_list_id,
          position = sub.rn - 1
      FROM (
        SELECT unnest(word_ids[start_idx:end_idx]) AS wid,
               generate_series(0, end_idx - start_idx) AS rn
      ) sub
      WHERE words.id = sub.wid;
    END LOOP;

    DELETE FROM lists WHERE id = lst.id;
  END LOOP;
END $$;

SELECT
  COUNT(*) FILTER (WHERE wc > 15) AS still_too_large,
  COUNT(*) AS total_public_lists,
  SUM(wc) AS total_words
FROM (
  SELECT (SELECT COUNT(*) FROM words w WHERE w.list_id = l.id) AS wc
  FROM lists l WHERE l.is_public = true
) sub;
