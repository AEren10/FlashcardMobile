-- ============================================================
-- 0003 — study_count sayacı için RPC
-- ============================================================

CREATE OR REPLACE FUNCTION increment_list_study_count(p_list_id UUID)
RETURNS VOID
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE lists SET study_count = COALESCE(study_count, 0) + 1 WHERE id = p_list_id;
$$;

GRANT EXECUTE ON FUNCTION increment_list_study_count(UUID) TO authenticated;
