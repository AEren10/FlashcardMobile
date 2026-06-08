-- =============================================================
-- list_ratings — kullanıcı bazlı liste puanları (1-5 yıldız)
-- Her kullanıcı bir liste için tek puan verebilir.
-- lists tablosunda avg_rating + rating_count cached tutulur,
-- trigger ile rating değişiminde otomatik güncellenir.
-- RLS: okuma herkese açık, yazma sadece kendi kaydına.
-- =============================================================

-- 1) Cached kolonlar (idempotent)
ALTER TABLE lists ADD COLUMN IF NOT EXISTS avg_rating NUMERIC(3,2) DEFAULT 0;
ALTER TABLE lists ADD COLUMN IF NOT EXISTS rating_count INT DEFAULT 0;

-- 2) Tablo
CREATE TABLE IF NOT EXISTS list_ratings (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, list_id)
);

CREATE INDEX IF NOT EXISTS idx_list_ratings_list ON list_ratings (list_id);
CREATE INDEX IF NOT EXISTS idx_lists_avg_rating ON lists (avg_rating DESC, rating_count DESC);

-- 3) Cache senkron trigger — lists.avg_rating ve rating_count yenile
CREATE OR REPLACE FUNCTION sync_list_rating_cache()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_list_id UUID;
  v_avg NUMERIC(3,2);
  v_count INT;
BEGIN
  IF TG_OP = 'DELETE' THEN
    v_list_id := OLD.list_id;
  ELSE
    v_list_id := NEW.list_id;
  END IF;

  SELECT COALESCE(ROUND(AVG(lr.rating)::NUMERIC, 2), 0), COUNT(*)
    INTO v_avg, v_count
    FROM list_ratings lr
   WHERE lr.list_id = v_list_id;

  UPDATE lists
     SET avg_rating = v_avg,
         rating_count = v_count
   WHERE lists.id = v_list_id;

  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS trg_list_ratings_sync ON list_ratings;
CREATE TRIGGER trg_list_ratings_sync
AFTER INSERT OR UPDATE OR DELETE ON list_ratings
FOR EACH ROW EXECUTE FUNCTION sync_list_rating_cache();

-- 4) rate_list(list_id, rating) — INSERT veya UPDATE (upsert)
CREATE OR REPLACE FUNCTION rate_list(p_list_id UUID, p_rating INT)
RETURNS TABLE (avg NUMERIC, count INT)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;
  IF p_rating < 1 OR p_rating > 5 THEN
    RAISE EXCEPTION 'invalid_rating';
  END IF;

  INSERT INTO list_ratings (user_id, list_id, rating)
       VALUES (v_user_id, p_list_id, p_rating)
  ON CONFLICT (user_id, list_id)
  DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW();

  RETURN QUERY
  SELECT l.avg_rating::NUMERIC, l.rating_count
    FROM lists l
   WHERE l.id = p_list_id;
END;
$$;
GRANT EXECUTE ON FUNCTION rate_list(UUID, INT) TO authenticated;

-- 5) get_list_rating(list_id) → {avg, count, user_rating}
CREATE OR REPLACE FUNCTION get_list_rating(p_list_id UUID)
RETURNS TABLE (avg NUMERIC, count INT, user_rating INT)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  RETURN QUERY
  SELECT l.avg_rating::NUMERIC,
         l.rating_count,
         (SELECT lr.rating FROM list_ratings lr
           WHERE lr.list_id = p_list_id AND lr.user_id = v_user_id
           LIMIT 1)
    FROM lists l
   WHERE l.id = p_list_id;
END;
$$;
GRANT EXECUTE ON FUNCTION get_list_rating(UUID) TO anon, authenticated;

-- 6) top_rated_lists(limit) → en yüksek ortalama, min 3 oy
CREATE OR REPLACE FUNCTION top_rated_lists(p_limit INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  title TEXT,
  level TEXT,
  category TEXT,
  avg_rating NUMERIC,
  rating_count INT
)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT l.id, l.title, l.level, l.category, l.avg_rating::NUMERIC, l.rating_count
    FROM lists l
   WHERE l.rating_count >= 3
     AND COALESCE(l.is_public, FALSE) = TRUE
   ORDER BY l.avg_rating DESC, l.rating_count DESC
   LIMIT GREATEST(p_limit, 1);
END;
$$;
GRANT EXECUTE ON FUNCTION top_rated_lists(INT) TO anon, authenticated;

-- 7) RLS
ALTER TABLE list_ratings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ratings_read_all" ON list_ratings;
CREATE POLICY "ratings_read_all" ON list_ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "ratings_insert_own" ON list_ratings;
CREATE POLICY "ratings_insert_own" ON list_ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_update_own" ON list_ratings;
CREATE POLICY "ratings_update_own" ON list_ratings
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "ratings_delete_own" ON list_ratings;
CREATE POLICY "ratings_delete_own" ON list_ratings
  FOR DELETE USING (auth.uid() = user_id);
