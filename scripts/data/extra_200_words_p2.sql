-- ============================================================================
-- FlashcardMobile — Ekstra 200 kelime (Part 2) / 7 yeni liste
-- Kategoriler: travel, daily(health), emotions, sports, arts, home, business
-- Süpabase SQL Editor'da çalıştır.
-- ============================================================================

DO $$
DECLARE
  l1 UUID; l2 UUID; l3 UUID; l4 UUID; l5 UUID; l6 UUID; l7 UUID;
BEGIN

-- ============================================================================
-- 8) HAVAALANI DİYALOĞU — 15 kelime (travel)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Havaalanı · Check-in & Uçuş', 'travel', 'Orta', true, NOW())
RETURNING id INTO l1;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l1, 'boarding', 'biniş', 'Boarding starts in ten minutes.', 'Biniş on dakika içinde başlıyor.', 0),
  (l1, 'passport', 'pasaport', 'Show your passport at the gate.', 'Kapıda pasaportunu göster.', 1),
  (l1, 'luggage', 'bagaj', 'My luggage is too heavy.', 'Bagajım çok ağır.', 2),
  (l1, 'gate', 'kapı', 'Our flight leaves from gate seven.', 'Uçuşumuz yedi numaralı kapıdan kalkıyor.', 3),
  (l1, 'departure', 'kalkış', 'Departure was delayed by an hour.', 'Kalkış bir saat ertelendi.', 4),
  (l1, 'arrival', 'varış', 'Arrival time is at noon.', 'Varış saati öğlen.', 5),
  (l1, 'delay', 'gecikme', 'A short delay is expected.', 'Kısa bir gecikme bekleniyor.', 6),
  (l1, 'connection', 'aktarma', 'I have a connection in Paris.', 'Paris''te aktarmam var.', 7),
  (l1, 'security', 'güvenlik', 'Security checks took ages.', 'Güvenlik kontrolleri çok uzun sürdü.', 8),
  (l1, 'customs', 'gümrük', 'Customs officers checked my bag.', 'Gümrük memurları çantamı kontrol etti.', 9),
  (l1, 'aisle', 'koridor (koltuk)', 'I prefer an aisle seat.', 'Koridor koltuğunu tercih ederim.', 10),
  (l1, 'window', 'pencere (koltuk)', 'She loves window seats.', 'Pencere koltuklarını çok sever.', 11),
  (l1, 'turbulence', 'türbülans', 'We had heavy turbulence today.', 'Bugün ciddi türbülans yaşadık.', 12),
  (l1, 'crew', 'mürettebat', 'The crew was very friendly.', 'Mürettebat çok güler yüzlüydü.', 13),
  (l1, 'transit', 'transit', 'I am only in transit here.', 'Burada sadece transit halindeyim.', 14);

-- ============================================================================
-- 9) SAĞLIK & HASTALIK — 14 kelime (daily)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Sağlık · Hastalık & Tedavi', 'daily', 'Orta', true, NOW())
RETURNING id INTO l2;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l2, 'fever', 'ateş', 'She has a high fever.', 'Yüksek ateşi var.', 0),
  (l2, 'cough', 'öksürük', 'My cough won''t go away.', 'Öksürüğüm bir türlü geçmiyor.', 1),
  (l2, 'sneeze', 'hapşırmak', 'Cover your mouth when you sneeze.', 'Hapşırırken ağzını kapat.', 2),
  (l2, 'headache', 'baş ağrısı', 'I have a terrible headache.', 'Korkunç bir baş ağrım var.', 3),
  (l2, 'pill', 'hap', 'Take one pill after meals.', 'Yemeklerden sonra bir hap al.', 4),
  (l2, 'syrup', 'şurup', 'The doctor prescribed cough syrup.', 'Doktor öksürük şurubu yazdı.', 5),
  (l2, 'allergy', 'alerji', 'I have a pollen allergy.', 'Polen alerjim var.', 6),
  (l2, 'infection', 'enfeksiyon', 'The wound has an infection.', 'Yarada enfeksiyon var.', 7),
  (l2, 'pharmacy', 'eczane', 'Is there a pharmacy nearby?', 'Yakında eczane var mı?', 8),
  (l2, 'clinic', 'klinik', 'I visited a small clinic.', 'Küçük bir kliniği ziyaret ettim.', 9),
  (l2, 'recover', 'iyileşmek', 'He recovered after a week.', 'Bir haftada iyileşti.', 10),
  (l2, 'symptom', 'belirti', 'Watch for any new symptoms.', 'Yeni belirtilere dikkat et.', 11),
  (l2, 'vaccine', 'aşı', 'The vaccine prevents the disease.', 'Aşı hastalığı önler.', 12),
  (l2, 'rest', 'dinlenme', 'You need plenty of rest.', 'Bolca dinlenmeye ihtiyacın var.', 13);

-- ============================================================================
-- 10) AŞK & İLİŞKİ — 14 kelime (emotions)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Aşk · İlişki & Duygular', 'emotions', 'Orta', true, NOW())
RETURNING id INTO l3;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l3, 'crush', 'platonik aşk', 'I had a crush on her in school.', 'Okulda ona karşı platonik bir aşkım vardı.', 0),
  (l3, 'flirt', 'flört etmek', 'He flirts with everyone.', 'Herkesle flört eder.', 1),
  (l3, 'date', 'randevu', 'We had a romantic date.', 'Romantik bir randevumuz oldu.', 2),
  (l3, 'engaged', 'nişanlı', 'They got engaged last month.', 'Geçen ay nişanlandılar.', 3),
  (l3, 'married', 'evli', 'My sister is married now.', 'Kız kardeşim artık evli.', 4),
  (l3, 'jealous', 'kıskanç', 'Don''t be jealous of others.', 'Başkalarını kıskanma.', 5),
  (l3, 'breakup', 'ayrılık', 'The breakup was painful.', 'Ayrılık acı vericiydi.', 6),
  (l3, 'commit', 'bağlanmak', 'He is afraid to commit.', 'Bağlanmaktan korkuyor.', 7),
  (l3, 'trust', 'güven', 'Trust is the basis of love.', 'Güven, sevginin temelidir.', 8),
  (l3, 'tender', 'şefkatli', 'She gave him a tender hug.', 'Ona şefkatli bir sarılma verdi.', 9),
  (l3, 'longing', 'özlem', 'I felt a deep longing for home.', 'Eve karşı derin bir özlem hissettim.', 10),
  (l3, 'devoted', 'sadık', 'He is a devoted partner.', 'O sadık bir partner.', 11),
  (l3, 'romance', 'romantizm', 'Their romance lasted years.', 'Aşkları yıllarca sürdü.', 12),
  (l3, 'soulmate', 'ruh eşi', 'I believe I found my soulmate.', 'Ruh eşimi bulduğuma inanıyorum.', 13);

-- ============================================================================
-- 11) OLİMPİK SPORLAR — 14 kelime (sports)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Olimpik Sporlar', 'sports', 'Orta', true, NOW())
RETURNING id INTO l4;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l4, 'gymnastics', 'jimnastik', 'Gymnastics requires great balance.', 'Jimnastik harika denge gerektirir.', 0),
  (l4, 'athletics', 'atletizm', 'Athletics is the heart of the Games.', 'Atletizm, oyunların kalbidir.', 1),
  (l4, 'swimming', 'yüzme', 'Swimming improves stamina.', 'Yüzme dayanıklılığı arttırır.', 2),
  (l4, 'rowing', 'kürek çekme', 'Rowing builds upper body strength.', 'Kürek çekmek üst vücudu güçlendirir.', 3),
  (l4, 'fencing', 'eskrim', 'Fencing is a fast-paced sport.', 'Eskrim hızlı tempolu bir spordur.', 4),
  (l4, 'archery', 'okçuluk', 'Archery demands focus.', 'Okçuluk odaklanma ister.', 5),
  (l4, 'sprint', 'sürat koşusu', 'He won the hundred-meter sprint.', 'Yüz metre sürat koşusunu kazandı.', 6),
  (l4, 'medal', 'madalya', 'She earned a gold medal.', 'Altın madalya kazandı.', 7),
  (l4, 'podium', 'kürsü', 'The athlete stood on the podium.', 'Atlet kürsüye çıktı.', 8),
  (l4, 'coach', 'antrenör', 'Her coach trained her for years.', 'Antrenörü onu yıllarca çalıştırdı.', 9),
  (l4, 'record', 'rekor', 'He broke the world record.', 'Dünya rekorunu kırdı.', 10),
  (l4, 'rival', 'rakip', 'Her main rival quit the race.', 'Ana rakibi yarıştan çekildi.', 11),
  (l4, 'champion', 'şampiyon', 'She is the reigning champion.', 'O mevcut şampiyon.', 12),
  (l4, 'qualify', 'eleme geçmek', 'She qualified for the final.', 'Finale kalmayı başardı.', 13);

-- ============================================================================
-- 12) FİLM & SİNEMA — 14 kelime (arts)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Film · Sinema Sözlüğü', 'arts', 'Orta', true, NOW())
RETURNING id INTO l5;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l5, 'director', 'yönetmen', 'The director won an Oscar.', 'Yönetmen Oscar kazandı.', 0),
  (l5, 'actor', 'aktör', 'He is my favorite actor.', 'O en sevdiğim aktör.', 1),
  (l5, 'actress', 'aktris', 'The actress played the lead role.', 'Aktris başrolü oynadı.', 2),
  (l5, 'screenplay', 'senaryo', 'The screenplay was brilliant.', 'Senaryo harikaydı.', 3),
  (l5, 'sequel', 'devam filmi', 'I can''t wait for the sequel.', 'Devam filmini iple çekiyorum.', 4),
  (l5, 'trailer', 'fragman', 'The trailer looks amazing.', 'Fragman muhteşem görünüyor.', 5),
  (l5, 'plot', 'olay örgüsü', 'The plot has many twists.', 'Olay örgüsünde birçok sürpriz var.', 6),
  (l5, 'scene', 'sahne', 'The final scene was emotional.', 'Son sahne duygusaldı.', 7),
  (l5, 'subtitle', 'altyazı', 'I always watch with subtitles.', 'Her zaman altyazı ile izlerim.', 8),
  (l5, 'genre', 'tür', 'Horror is not my favorite genre.', 'Korku en sevdiğim tür değil.', 9),
  (l5, 'cast', 'oyuncu kadrosu', 'The cast was outstanding.', 'Oyuncu kadrosu olağanüstüydü.', 10),
  (l5, 'soundtrack', 'film müziği', 'The soundtrack stayed in my head.', 'Film müziği aklımdan çıkmadı.', 11),
  (l5, 'box office', 'gişe', 'The movie was a box office hit.', 'Film gişe rekoru kırdı.', 12),
  (l5, 'release', 'vizyona girmek', 'The film releases next week.', 'Film haftaya vizyona giriyor.', 13);

-- ============================================================================
-- 13) MOBİLYA & DEKORASYON — 14 kelime (home)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Mobilya · Dekorasyon', 'home', 'Kolay', true, NOW())
RETURNING id INTO l6;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l6, 'sofa', 'kanepe', 'Our sofa is very comfortable.', 'Kanepemiz çok rahat.', 0),
  (l6, 'armchair', 'koltuk', 'I read in my favorite armchair.', 'En sevdiğim koltukta kitap okurum.', 1),
  (l6, 'wardrobe', 'gardırop', 'My wardrobe is overflowing.', 'Gardırobum taşıyor.', 2),
  (l6, 'drawer', 'çekmece', 'Keep the keys in the top drawer.', 'Anahtarları üst çekmecede sakla.', 3),
  (l6, 'shelf', 'raf', 'The shelf is full of books.', 'Raf kitaplarla dolu.', 4),
  (l6, 'curtain', 'perde', 'Please close the curtains.', 'Lütfen perdeleri kapat.', 5),
  (l6, 'carpet', 'halı', 'A soft carpet covers the floor.', 'Yumuşak bir halı yeri kaplıyor.', 6),
  (l6, 'mirror', 'ayna', 'There is a big mirror in the hall.', 'Holde büyük bir ayna var.', 7),
  (l6, 'lamp', 'lamba', 'The lamp on the desk is broken.', 'Masadaki lamba bozuk.', 8),
  (l6, 'cushion', 'minder', 'Add cushions for a cozy look.', 'Sıcak görünüm için minder ekle.', 9),
  (l6, 'rug', 'kilim', 'A vintage rug warms the room.', 'Vintage bir kilim odayı ısıtıyor.', 10),
  (l6, 'vase', 'vazo', 'Fresh flowers brighten the vase.', 'Taze çiçekler vazoyu canlandırıyor.', 11),
  (l6, 'frame', 'çerçeve', 'I hung the frame on the wall.', 'Çerçeveyi duvara astım.', 12),
  (l6, 'decor', 'dekor', 'Minimalist decor feels calming.', 'Minimalist dekor sakinleştirici.', 13);

-- ============================================================================
-- 14) TOPLANTI & SUNUM — 15 kelime (business)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Toplantı · Sunum & Ofis', 'business', 'Orta', true, NOW())
RETURNING id INTO l7;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l7, 'agenda', 'gündem', 'Let''s review today''s agenda.', 'Bugünkü gündemi gözden geçirelim.', 0),
  (l7, 'minutes', 'tutanak', 'Send me the meeting minutes.', 'Bana toplantı tutanaklarını gönder.', 1),
  (l7, 'deadline', 'son tarih', 'The deadline is next Friday.', 'Son tarih önümüzdeki cuma.', 2),
  (l7, 'feedback', 'geri bildirim', 'Your feedback is appreciated.', 'Geri bildiriminiz çok değerli.', 3),
  (l7, 'slide', 'slayt', 'Move to the next slide, please.', 'Lütfen bir sonraki slayta geç.', 4),
  (l7, 'presentation', 'sunum', 'Her presentation was clear.', 'Sunumu çok netti.', 5),
  (l7, 'proposal', 'teklif', 'We accepted their proposal.', 'Tekliflerini kabul ettik.', 6),
  (l7, 'client', 'müşteri', 'The client called this morning.', 'Müşteri bu sabah aradı.', 7),
  (l7, 'budget', 'bütçe', 'We are over budget this quarter.', 'Bu çeyrek bütçeyi aştık.', 8),
  (l7, 'invoice', 'fatura', 'I sent the invoice yesterday.', 'Faturayı dün gönderdim.', 9),
  (l7, 'report', 'rapor', 'Finish the quarterly report by Monday.', 'Çeyrek raporunu pazartesiye kadar bitir.', 10),
  (l7, 'colleague', 'iş arkadaşı', 'My colleague will join the call.', 'İş arkadaşım aramaya katılacak.', 11),
  (l7, 'remote', 'uzaktan', 'Many of us work remote now.', 'Çoğumuz artık uzaktan çalışıyor.', 12),
  (l7, 'hybrid', 'hibrit', 'Our team uses a hybrid model.', 'Ekibimiz hibrit model kullanıyor.', 13),
  (l7, 'follow-up', 'takip', 'I''ll send a follow-up email.', 'Takip e-postası göndereceğim.', 14);

END $$;
