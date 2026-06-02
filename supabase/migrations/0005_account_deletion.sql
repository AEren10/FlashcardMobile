-- ============================================================
-- 0005 — Account deletion RPC (Apple Guideline 5.1.1(v) zorunluluğu)
-- AuthContext.js → supabase.rpc("delete_user_account") çağırır.
-- SECURITY DEFINER ile auth.users satırını siler; CASCADE ile
-- profiles, lists, words, word_progress, favorites, favorite_words,
-- study_sessions hepsi otomatik temizlenir.
-- ============================================================

CREATE OR REPLACE FUNCTION delete_user_account()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id UUID := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  -- Önce kullanıcının verisini sil (CASCADE foreign key'ler tetiklenir,
  -- yine de açıkça siliyoruz ki sıralama net olsun)
  DELETE FROM favorite_words   WHERE user_id = v_user_id;
  DELETE FROM word_progress    WHERE user_id = v_user_id;
  DELETE FROM study_sessions   WHERE user_id = v_user_id;
  DELETE FROM favorites        WHERE user_id = v_user_id;
  DELETE FROM lists            WHERE user_id = v_user_id; -- words ON DELETE CASCADE
  DELETE FROM profiles         WHERE id = v_user_id;

  -- Son olarak auth.users — bu satır gidince session da kapanır
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

GRANT EXECUTE ON FUNCTION delete_user_account() TO authenticated;
