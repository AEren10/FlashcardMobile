-- Sözlük listesi oluştur (is_public=false, kullanıcı görmez)
-- Bu liste sadece backend referansı — appe yüklenmez

INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES (
  'Sözlük · 5000 En Yaygın Kelime',
  'dictionary',
  'Sözlük',
  false,
  NOW()
)
RETURNING id, title;
