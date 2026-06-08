-- 0007_profile_goal_level.sql
-- Onboarding'de seçilen hedef + seviye için 2 kolon.
-- Goal: kullanıcı hedefi (sınav, kariyer, seyahat, hobi)
-- Level: kendine biçtiği seviye (beginner, intermediate, advanced)
-- HomeScreen liste önerisini bu 2 kolona göre filtreler.

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS goal TEXT,
  ADD COLUMN IF NOT EXISTS level TEXT;

-- CHECK constraint — yalnız bilinen değerler kabul edilir
ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_goal_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_goal_check
  CHECK (goal IS NULL OR goal IN ('exam', 'career', 'travel', 'hobby'));

ALTER TABLE profiles
  DROP CONSTRAINT IF EXISTS profiles_level_check;
ALTER TABLE profiles
  ADD CONSTRAINT profiles_level_check
  CHECK (level IS NULL OR level IN ('beginner', 'intermediate', 'advanced'));

-- Discovery için index — goal+level kombosuyla sık sorgu
CREATE INDEX IF NOT EXISTS idx_profiles_goal_level
  ON profiles(goal, level)
  WHERE goal IS NOT NULL AND level IS NOT NULL;

COMMENT ON COLUMN profiles.goal IS 'Onboarding: exam | career | travel | hobby';
COMMENT ON COLUMN profiles.level IS 'Onboarding: beginner (A1-A2) | intermediate (B1-B2) | advanced (C1+)';
