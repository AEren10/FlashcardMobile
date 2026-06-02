-- ============================================================
-- 0001 — FlashcardMobile full schema (sıfırdan kurulum)
-- Supabase SQL Editor > bu dosyayı yapıştır > Run
-- ============================================================

-- ---------- 0) Extensions -----------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";    -- gen_random_uuid()

-- ============================================================
-- 1) PROFILES (auth.users mirror)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Yeni auth.users kaydında otomatik profil aç
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 2) LISTS (kelime listeleri — kullanıcının veya public)
-- ============================================================
CREATE TABLE IF NOT EXISTS lists (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  level         TEXT,                     -- Beginner / Intermediate / Advanced
  category      TEXT,
  image_url     TEXT,
  is_public     BOOLEAN NOT NULL DEFAULT false,
  study_count   INTEGER NOT NULL DEFAULT 0,
  inserted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_lists_user    ON lists (user_id);
CREATE INDEX IF NOT EXISTS idx_lists_public  ON lists (is_public) WHERE is_public = true;

-- ============================================================
-- 3) WORDS (listedeki kelimeler)
-- ============================================================
CREATE TABLE IF NOT EXISTS words (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id       UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  word          TEXT NOT NULL,
  meaning       TEXT NOT NULL,
  example       TEXT,
  position      INTEGER NOT NULL DEFAULT 0,
  inserted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_words_list    ON words (list_id);

-- ============================================================
-- 4) FAVORITES (kullanıcı ↔ liste)
-- ============================================================
CREATE TABLE IF NOT EXISTS favorites (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id       UUID NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
  inserted_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, list_id)
);

CREATE INDEX IF NOT EXISTS idx_fav_user      ON favorites (user_id);

-- ============================================================
-- 5) WORD_PROGRESS (SRS — kullanıcı × kelime)
-- ============================================================
CREATE TABLE IF NOT EXISTS word_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id         UUID NOT NULL REFERENCES words(id) ON DELETE CASCADE,
  ease            REAL NOT NULL DEFAULT 2.5,
  interval_days   INTEGER NOT NULL DEFAULT 0,
  repetitions     INTEGER NOT NULL DEFAULT 0,
  due_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_reviewed   TIMESTAMPTZ,
  lapses          INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, word_id)
);

CREATE INDEX IF NOT EXISTS idx_wp_due
  ON word_progress (user_id, due_at);

-- ============================================================
-- 6) STUDY_SESSIONS (her çalışma seansı)
-- ============================================================
CREATE TABLE IF NOT EXISTS study_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  list_id       UUID REFERENCES lists(id) ON DELETE SET NULL,
  mode          TEXT NOT NULL CHECK (mode IN ('flashcard','quiz','srs')),
  total_words   INTEGER NOT NULL DEFAULT 0,
  correct       INTEGER NOT NULL DEFAULT 0,
  duration_sec  INTEGER NOT NULL DEFAULT 0,
  started_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at   TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_ss_user
  ON study_sessions (user_id, started_at DESC);

-- ============================================================
-- 7) RLS'i tüm tablolarda aç
-- ============================================================
ALTER TABLE profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists           ENABLE ROW LEVEL SECURITY;
ALTER TABLE words           ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites       ENABLE ROW LEVEL SECURITY;
ALTER TABLE word_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions  ENABLE ROW LEVEL SECURITY;

-- ---------- 7.1 profiles -----------------------------------
DROP POLICY IF EXISTS profiles_select ON profiles;
CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (id = auth.uid());

DROP POLICY IF EXISTS profiles_update ON profiles;
CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ---------- 7.2 lists --------------------------------------
-- Public listeyi herkes görür; sahip her şey yapar
DROP POLICY IF EXISTS lists_select ON lists;
CREATE POLICY lists_select ON lists FOR SELECT
  USING (is_public = true OR user_id = auth.uid());

DROP POLICY IF EXISTS lists_insert ON lists;
CREATE POLICY lists_insert ON lists FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS lists_update ON lists;
CREATE POLICY lists_update ON lists FOR UPDATE
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS lists_delete ON lists;
CREATE POLICY lists_delete ON lists FOR DELETE
  USING (user_id = auth.uid());

-- ---------- 7.3 words --------------------------------------
-- Public liste ise herkes okur; sadece liste sahibi yazar
DROP POLICY IF EXISTS words_select ON words;
CREATE POLICY words_select ON words FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lists l
      WHERE l.id = words.list_id
        AND (l.is_public = true OR l.user_id = auth.uid())
    )
  );

DROP POLICY IF EXISTS words_write ON words;
CREATE POLICY words_write ON words FOR ALL
  USING (
    EXISTS (SELECT 1 FROM lists l WHERE l.id = words.list_id AND l.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM lists l WHERE l.id = words.list_id AND l.user_id = auth.uid())
  );

-- ---------- 7.4 favorites ----------------------------------
DROP POLICY IF EXISTS favorites_all ON favorites;
CREATE POLICY favorites_all ON favorites FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------- 7.5 word_progress ------------------------------
DROP POLICY IF EXISTS wp_all ON word_progress;
CREATE POLICY wp_all ON word_progress FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ---------- 7.6 study_sessions -----------------------------
DROP POLICY IF EXISTS ss_all ON study_sessions;
CREATE POLICY ss_all ON study_sessions FOR ALL
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 8) Yardımcı view: kullanıcının due (çalışma vakti gelmiş) kelimeleri
-- ============================================================
CREATE OR REPLACE VIEW v_due_words AS
  SELECT w.*, wp.due_at, wp.ease, wp.interval_days, wp.repetitions
  FROM words w
  JOIN word_progress wp ON wp.word_id = w.id
  WHERE wp.user_id = auth.uid()
    AND wp.due_at <= NOW();

-- ============================================================
-- 9) Küratörlü public seed listeler
--    (user_id NULL → kimseye ait değil, herkese görünür)
-- ============================================================
DO $$
DECLARE
  lst_id UUID;
BEGIN
  -- Günlük İngilizce
  IF NOT EXISTS (SELECT 1 FROM lists WHERE title = 'Günlük İngilizce' AND user_id IS NULL) THEN
    INSERT INTO lists (user_id, title, description, level, category, is_public)
    VALUES (NULL, 'Günlük İngilizce', 'Günlük hayatta kullanılan temel kelimeler', 'Beginner', 'daily-life', true)
    RETURNING id INTO lst_id;

    INSERT INTO words (list_id, word, meaning, example, position) VALUES
      (lst_id, 'Hello',     'Merhaba',         'Hello, how are you?',            0),
      (lst_id, 'Thank you', 'Teşekkür ederim', 'Thank you for your help.',       1),
      (lst_id, 'Please',    'Lütfen',          'Please help me.',                2),
      (lst_id, 'Excuse me', 'Affedersiniz',    'Excuse me, where is the exit?',  3),
      (lst_id, 'Sorry',     'Özür dilerim',    'Sorry, I am late.',              4);
  END IF;

  -- Sayılar
  IF NOT EXISTS (SELECT 1 FROM lists WHERE title = 'Sayılar' AND user_id IS NULL) THEN
    INSERT INTO lists (user_id, title, description, level, category, is_public)
    VALUES (NULL, 'Sayılar', 'Temel sayılar', 'Beginner', 'learning', true)
    RETURNING id INTO lst_id;

    INSERT INTO words (list_id, word, meaning, example, position) VALUES
      (lst_id, 'One',   'Bir',  'I have one apple.',          0),
      (lst_id, 'Two',   'İki',  'Two plus two equals four.',  1),
      (lst_id, 'Three', 'Üç',   'I bought three books.',      2),
      (lst_id, 'Four',  'Dört', 'There are four seasons.',    3),
      (lst_id, 'Five',  'Beş',  'I have five fingers.',       4);
  END IF;

  -- Renkler
  IF NOT EXISTS (SELECT 1 FROM lists WHERE title = 'Renkler' AND user_id IS NULL) THEN
    INSERT INTO lists (user_id, title, description, level, category, is_public)
    VALUES (NULL, 'Renkler', 'Temel renkler', 'Beginner', 'learning', true)
    RETURNING id INTO lst_id;

    INSERT INTO words (list_id, word, meaning, example, position) VALUES
      (lst_id, 'Red',    'Kırmızı', 'The apple is red.',    0),
      (lst_id, 'Blue',   'Mavi',    'The sky is blue.',     1),
      (lst_id, 'Green',  'Yeşil',   'The grass is green.',  2),
      (lst_id, 'Yellow', 'Sarı',    'The sun is yellow.',   3),
      (lst_id, 'Black',  'Siyah',   'The cat is black.',    4);
  END IF;
END $$;

-- ============================================================
-- 10) words.list_id public-seed listeler için SELECT politikası
--     words policy'si lists.user_id = auth.uid() bakar;
--     public (user_id IS NULL) listeler için is_public kontrolü yeterli.
--     Yukarıdaki words_select zaten is_public=true şartını içeriyor ✓
-- ============================================================

-- BİTTİ. Sonuç: 6 tablo + 1 view + RLS + seed.
