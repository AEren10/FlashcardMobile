-- ============================================================================
-- FlashcardMobile — 200 yeni kelime / 15 yeni liste
--
-- Kategoriler (9): nature, emotions, sports, transportation, arts, home,
--                   social, news, shopping
-- Her liste max 15 kelime kuralına uygun.
-- Süpabase SQL Editor'da bir bütün olarak çalıştır.
-- ============================================================================

DO $$
DECLARE
  list_id UUID;
BEGIN

-- ============================================================================
-- 1) DOĞA & MANZARA — 15 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Doğa · Manzara', 'nature', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'forest', 'orman', 'We hiked through a dense forest.', 'Yoğun bir ormanda yürüyüş yaptık.', 0),
  (list_id, 'mountain', 'dağ', 'The mountain was covered in snow.', 'Dağ karla kaplıydı.', 1),
  (list_id, 'river', 'nehir', 'The river flows into the sea.', 'Nehir denize akar.', 2),
  (list_id, 'lake', 'göl', 'We swam in the calm lake.', 'Sakin gölde yüzdük.', 3),
  (list_id, 'ocean', 'okyanus', 'The ocean is vast and deep.', 'Okyanus geniş ve derindir.', 4),
  (list_id, 'desert', 'çöl', 'The desert is hot during the day.', 'Çöl gündüz çok sıcaktır.', 5),
  (list_id, 'valley', 'vadi', 'A small village lies in the valley.', 'Vadide küçük bir köy var.', 6),
  (list_id, 'cliff', 'uçurum', 'The lighthouse stood on a cliff.', 'Deniz feneri bir uçurumun üzerindeydi.', 7),
  (list_id, 'waterfall', 'şelale', 'The waterfall was breathtaking.', 'Şelale nefes kesiciydi.', 8),
  (list_id, 'meadow', 'çayır', 'Wildflowers covered the meadow.', 'Kır çiçekleri çayırı kapladı.', 9),
  (list_id, 'shore', 'kıyı', 'We walked along the shore.', 'Kıyı boyunca yürüdük.', 10),
  (list_id, 'peak', 'zirve', 'We finally reached the peak.', 'Sonunda zirveye ulaştık.', 11),
  (list_id, 'island', 'ada', 'The island is famous for beaches.', 'Ada plajlarıyla ünlüdür.', 12),
  (list_id, 'cave', 'mağara', 'Ancient drawings cover the cave.', 'Antik çizimler mağarayı kaplıyor.', 13),
  (list_id, 'horizon', 'ufuk', 'The sun set below the horizon.', 'Güneş ufkun altında battı.', 14);

-- ============================================================================
-- 2) HAYVANLAR · VAHŞİ & EVCİL — 15 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Hayvanlar · Vahşi & Evcil', 'nature', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'wolf', 'kurt', 'A wolf howled in the distance.', 'Uzakta bir kurt uludu.', 0),
  (list_id, 'eagle', 'kartal', 'The eagle soared above the cliffs.', 'Kartal uçurumların üzerinde süzüldü.', 1),
  (list_id, 'dolphin', 'yunus', 'Dolphins are very intelligent.', 'Yunuslar çok zekidir.', 2),
  (list_id, 'tiger', 'kaplan', 'The tiger is a fierce predator.', 'Kaplan vahşi bir avcıdır.', 3),
  (list_id, 'elephant', 'fil', 'Elephants have great memories.', 'Fillerin hafızası çok güçlüdür.', 4),
  (list_id, 'squirrel', 'sincap', 'A squirrel ran up the tree.', 'Bir sincap ağaca tırmandı.', 5),
  (list_id, 'owl', 'baykuş', 'An owl hooted in the night.', 'Geceleyin bir baykuş öttü.', 6),
  (list_id, 'fox', 'tilki', 'The fox is known for its cunning.', 'Tilki kurnazlığıyla bilinir.', 7),
  (list_id, 'shark', 'köpekbalığı', 'The shark patrolled the reef.', 'Köpekbalığı resifin etrafında dolaştı.', 8),
  (list_id, 'butterfly', 'kelebek', 'A butterfly landed on the flower.', 'Bir kelebek çiçeğin üzerine kondu.', 9),
  (list_id, 'lion', 'aslan', 'The lion is called king of the jungle.', 'Aslana ormanların kralı denir.', 10),
  (list_id, 'parrot', 'papağan', 'My parrot can say hello.', 'Papağanım merhaba diyebilir.', 11),
  (list_id, 'hedgehog', 'kirpi', 'A hedgehog rolled into a ball.', 'Bir kirpi top gibi kıvrıldı.', 12),
  (list_id, 'raccoon', 'rakun', 'A raccoon got into the trash.', 'Bir rakun çöpe girdi.', 13),
  (list_id, 'spider', 'örümcek', 'A spider built a web in the corner.', 'Köşede bir örümcek ağ ördü.', 14);

-- ============================================================================
-- 3) DUYGULAR · POZİTİF — 13 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Duygular · Pozitif', 'emotions', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'joyful', 'neşeli', 'She felt joyful on her birthday.', 'Doğum gününde neşeli hissetti.', 0),
  (list_id, 'grateful', 'minnettar', 'I am grateful for your help.', 'Yardımın için minnettarım.', 1),
  (list_id, 'excited', 'heyecanlı', 'The kids were excited about the trip.', 'Çocuklar gezi için heyecanlıydı.', 2),
  (list_id, 'peaceful', 'huzurlu', 'The garden looked peaceful at dawn.', 'Bahçe şafakta huzurlu görünüyordu.', 3),
  (list_id, 'confident', 'kendinden emin', 'He gave a confident speech.', 'Kendinden emin bir konuşma yaptı.', 4),
  (list_id, 'proud', 'gururlu', 'I am proud of your achievement.', 'Başarınla gurur duyuyorum.', 5),
  (list_id, 'amused', 'eğlenen', 'The audience was amused by the joke.', 'Seyirci şakayı eğlenceli buldu.', 6),
  (list_id, 'inspired', 'ilham almış', 'I felt inspired after the talk.', 'Konuşmadan sonra ilham aldım.', 7),
  (list_id, 'delighted', 'memnun', 'She was delighted to see her friend.', 'Arkadaşını görünce çok memnun oldu.', 8),
  (list_id, 'cheerful', 'neşe dolu', 'He greeted us with a cheerful smile.', 'Bizi neşe dolu bir gülümsemeyle karşıladı.', 9),
  (list_id, 'content', 'tatmin olmuş', 'I feel content with my life.', 'Hayatımdan tatmin hissediyorum.', 10),
  (list_id, 'relieved', 'rahatlamış', 'I felt relieved after the exam.', 'Sınavdan sonra rahatladım.', 11),
  (list_id, 'eager', 'istekli', 'She was eager to learn more.', 'Daha fazlasını öğrenmeye istekliydi.', 12);

-- ============================================================================
-- 4) DUYGULAR · KARMAŞIK — 12 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Duygular · Karmaşık', 'emotions', 'İleri', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'anxious', 'kaygılı', 'I felt anxious before the interview.', 'Mülakat öncesi kaygılı hissettim.', 0),
  (list_id, 'confused', 'kafası karışık', 'I am confused about the directions.', 'Yön tariflerinde kafam karıştı.', 1),
  (list_id, 'nostalgic', 'nostaljik', 'Old songs make me nostalgic.', 'Eski şarkılar beni nostaljik yapar.', 2),
  (list_id, 'envious', 'kıskanç', 'I am a bit envious of your trip.', 'Geziniz için biraz kıskancım.', 3),
  (list_id, 'lonely', 'yalnız', 'He felt lonely after moving away.', 'Taşındıktan sonra yalnız hissetti.', 4),
  (list_id, 'overwhelmed', 'bunalmış', 'She was overwhelmed by the workload.', 'İş yükü altında bunaldı.', 5),
  (list_id, 'embarrassed', 'utanmış', 'I was embarrassed by my mistake.', 'Hatamdan utandım.', 6),
  (list_id, 'disappointed', 'hayal kırıklığına uğramış', 'He was disappointed with the result.', 'Sonuçtan hayal kırıklığına uğradı.', 7),
  (list_id, 'resentful', 'kırgın', 'She is still resentful about the past.', 'Hâlâ geçmişe kırgın.', 8),
  (list_id, 'hesitant', 'tereddütlü', 'He was hesitant to answer.', 'Cevap vermekte tereddütlüydü.', 9),
  (list_id, 'melancholy', 'melankolik', 'Rainy days make me melancholy.', 'Yağmurlu günler beni melankolik yapar.', 10),
  (list_id, 'apprehensive', 'endişeli', 'She felt apprehensive about flying.', 'Uçma konusunda endişeliydi.', 11);

-- ============================================================================
-- 5) SPOR · FUTBOL & BASKETBOL — 13 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Spor · Futbol & Basketbol', 'sports', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'defender', 'defans oyuncusu', 'The defender blocked the shot.', 'Defans şutu engelledi.', 0),
  (list_id, 'midfielder', 'orta saha', 'The midfielder controls the game.', 'Orta saha oyunu yönetir.', 1),
  (list_id, 'striker', 'forvet', 'Their striker scored twice.', 'Forvetleri iki gol attı.', 2),
  (list_id, 'goalkeeper', 'kaleci', 'The goalkeeper made a great save.', 'Kaleci muhteşem bir kurtarış yaptı.', 3),
  (list_id, 'coach', 'antrenör', 'The coach gave clear instructions.', 'Antrenör net talimatlar verdi.', 4),
  (list_id, 'tournament', 'turnuva', 'They won the tournament.', 'Turnuvayı kazandılar.', 5),
  (list_id, 'dribble', 'top sürmek', 'She dribbled past two defenders.', 'İki defansı top sürerek geçti.', 6),
  (list_id, 'tackle', 'top kapma', 'He made a clean tackle.', 'Temiz bir top kapma yaptı.', 7),
  (list_id, 'penalty', 'penaltı', 'The referee awarded a penalty.', 'Hakem penaltıya hükmetti.', 8),
  (list_id, 'referee', 'hakem', 'The referee blew the whistle.', 'Hakem düdüğünü çaldı.', 9),
  (list_id, 'substitution', 'oyuncu değişikliği', 'The coach made a substitution.', 'Antrenör oyuncu değişikliği yaptı.', 10),
  (list_id, 'arena', 'arena', 'The arena was packed with fans.', 'Arena taraftarla doluydu.', 11),
  (list_id, 'quarter', 'çeyrek (devre)', 'We scored in the final quarter.', 'Son çeyrekte sayı kaydettik.', 12);

-- ============================================================================
-- 6) SPOR · GENEL & EGZERSİZ — 12 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Spor · Genel & Egzersiz', 'sports', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'workout', 'antrenman', 'I had an intense workout today.', 'Bugün yoğun bir antrenman yaptım.', 0),
  (list_id, 'stretch', 'esneme', 'Don''t forget to stretch.', 'Esnemeyi unutma.', 1),
  (list_id, 'endurance', 'dayanıklılık', 'Long runs build endurance.', 'Uzun koşular dayanıklılık kazandırır.', 2),
  (list_id, 'flexibility', 'esneklik', 'Yoga improves flexibility.', 'Yoga esnekliği artırır.', 3),
  (list_id, 'strength', 'güç', 'He trained for upper body strength.', 'Üst vücut gücü için çalıştı.', 4),
  (list_id, 'cardio', 'kardiyo', 'I do cardio three times a week.', 'Haftada üç kez kardiyo yapıyorum.', 5),
  (list_id, 'recovery', 'toparlanma', 'Rest is key to recovery.', 'Dinlenmek toparlanma için kritiktir.', 6),
  (list_id, 'injury', 'sakatlık', 'He missed the game due to injury.', 'Sakatlık nedeniyle maçı kaçırdı.', 7),
  (list_id, 'warm-up', 'ısınma', 'Always start with a warm-up.', 'Her zaman ısınma ile başla.', 8),
  (list_id, 'champion', 'şampiyon', 'She became the world champion.', 'Dünya şampiyonu oldu.', 9),
  (list_id, 'trophy', 'kupa', 'They lifted the trophy together.', 'Kupayı birlikte kaldırdılar.', 10),
  (list_id, 'medal', 'madalya', 'He won a gold medal.', 'Altın madalya kazandı.', 11);

-- ============================================================================
-- 7) ULAŞIM · ŞEHİR İÇİ — 13 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Ulaşım · Şehir İçi', 'transportation', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'subway', 'metro', 'I take the subway to work.', 'İşe metroyla gidiyorum.', 0),
  (list_id, 'tram', 'tramvay', 'The tram is a quick option.', 'Tramvay hızlı bir seçenek.', 1),
  (list_id, 'crosswalk', 'yaya geçidi', 'Cross only at the crosswalk.', 'Sadece yaya geçidinden geç.', 2),
  (list_id, 'roundabout', 'kavşak (göbek)', 'Take the second exit at the roundabout.', 'Kavşaktan ikinci çıkışı al.', 3),
  (list_id, 'lane', 'şerit', 'Stay in the right lane.', 'Sağ şeritte kal.', 4),
  (list_id, 'pedestrian', 'yaya', 'Pedestrians have the right of way.', 'Geçiş önceliği yayalarındır.', 5),
  (list_id, 'fuel', 'yakıt', 'We need to get fuel soon.', 'Yakında yakıt almamız lazım.', 6),
  (list_id, 'plate', 'plaka', 'I memorized the car plate.', 'Arabanın plakasını ezberledim.', 7),
  (list_id, 'license', 'ehliyet', 'I just got my driver''s license.', 'Yeni ehliyetimi aldım.', 8),
  (list_id, 'honk', 'korna çalmak', 'Don''t honk in the neighborhood.', 'Mahallede korna çalma.', 9),
  (list_id, 'parking', 'park', 'Finding parking is difficult here.', 'Burada park yeri bulmak zor.', 10),
  (list_id, 'fare', 'ücret (bilet)', 'The bus fare went up.', 'Otobüs ücreti zamlandı.', 11),
  (list_id, 'commute', 'işe gidip gelmek', 'My commute takes an hour.', 'İşe gidip gelmem bir saat sürüyor.', 12);

-- ============================================================================
-- 8) ULAŞIM · YOLCULUK — 12 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Ulaşım · Yolculuk', 'transportation', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'boarding', 'biniş', 'Boarding starts in 20 minutes.', 'Biniş 20 dakika sonra başlar.', 0),
  (list_id, 'luggage', 'bagaj', 'My luggage is missing.', 'Bagajım kayboldu.', 1),
  (list_id, 'customs', 'gümrük', 'You must pass through customs.', 'Gümrükten geçmen gerekiyor.', 2),
  (list_id, 'terminal', 'terminal', 'Our flight leaves from terminal 2.', 'Uçağımız 2. terminalden kalkıyor.', 3),
  (list_id, 'delay', 'gecikme', 'There is a two-hour delay.', 'İki saatlik gecikme var.', 4),
  (list_id, 'departure', 'kalkış', 'The departure time has changed.', 'Kalkış saati değişti.', 5),
  (list_id, 'arrival', 'varış', 'Check the arrival board.', 'Varış panosunu kontrol et.', 6),
  (list_id, 'layover', 'aktarma', 'We have a long layover in Istanbul.', 'İstanbul''da uzun bir aktarmamız var.', 7),
  (list_id, 'visa', 'vize', 'Do you need a visa?', 'Vizeye ihtiyacın var mı?', 8),
  (list_id, 'itinerary', 'seyahat planı', 'Send me your itinerary.', 'Seyahat planını bana gönder.', 9),
  (list_id, 'carry-on', 'el bagajı', 'You can take one carry-on bag.', 'Bir el bagajı alabilirsin.', 10),
  (list_id, 'boarding pass', 'biniş kartı', 'Have your boarding pass ready.', 'Biniş kartını hazır bulundur.', 11);

-- ============================================================================
-- 9) MÜZİK · ENSTRÜMAN & TÜR — 10 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Müzik · Enstrüman & Tür', 'arts', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'melody', 'melodi', 'I love the melody of this song.', 'Bu şarkının melodisini seviyorum.', 0),
  (list_id, 'rhythm', 'ritim', 'The rhythm makes you want to dance.', 'Ritim seni dans ettirir.', 1),
  (list_id, 'chord', 'akor', 'He played a sad chord on the guitar.', 'Gitarda hüzünlü bir akor çaldı.', 2),
  (list_id, 'lyrics', 'şarkı sözü', 'The lyrics are very meaningful.', 'Şarkı sözleri çok anlamlı.', 3),
  (list_id, 'genre', 'tür', 'Jazz is my favorite music genre.', 'Jazz en sevdiğim müzik türü.', 4),
  (list_id, 'concert', 'konser', 'The concert sold out quickly.', 'Konser hızla tükendi.', 5),
  (list_id, 'studio', 'stüdyo', 'They recorded the album in a studio.', 'Albümü bir stüdyoda kaydettiler.', 6),
  (list_id, 'drummer', 'davulcu', 'The drummer kept the beat.', 'Davulcu ritmi korudu.', 7),
  (list_id, 'composer', 'besteci', 'Mozart was a famous composer.', 'Mozart ünlü bir besteciydi.', 8),
  (list_id, 'acoustic', 'akustik', 'I prefer acoustic guitar.', 'Akustik gitarı tercih ediyorum.', 9);

-- ============================================================================
-- 10) SANAT · GÖRSEL & SAHNE — 10 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Sanat · Görsel & Sahne', 'arts', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'portrait', 'portre', 'She painted a portrait of her father.', 'Babasının portresini yaptı.', 0),
  (list_id, 'sculpture', 'heykel', 'The sculpture is made of marble.', 'Heykel mermerden yapılmıştır.', 1),
  (list_id, 'exhibition', 'sergi', 'The exhibition opens tomorrow.', 'Sergi yarın açılıyor.', 2),
  (list_id, 'canvas', 'tuval', 'He stretched a fresh canvas.', 'Yeni bir tuval gerdi.', 3),
  (list_id, 'gallery', 'galeri', 'Let''s visit the art gallery.', 'Sanat galerisini ziyaret edelim.', 4),
  (list_id, 'masterpiece', 'başyapıt', 'This painting is a true masterpiece.', 'Bu tablo gerçek bir başyapıt.', 5),
  (list_id, 'theatre', 'tiyatro', 'We went to the theatre last night.', 'Dün akşam tiyatroya gittik.', 6),
  (list_id, 'audience', 'seyirci', 'The audience clapped loudly.', 'Seyirci yüksek sesle alkışladı.', 7),
  (list_id, 'director', 'yönetmen', 'The director won an award.', 'Yönetmen bir ödül kazandı.', 8),
  (list_id, 'screenplay', 'senaryo', 'She wrote the screenplay herself.', 'Senaryoyu kendisi yazdı.', 9);

-- ============================================================================
-- 11) EV · ODA & EŞYA — 10 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Ev · Oda & Eşya', 'home', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'wardrobe', 'gardırop', 'The wardrobe is full of clothes.', 'Gardırop kıyafetle dolu.', 0),
  (list_id, 'drawer', 'çekmece', 'The keys are in the top drawer.', 'Anahtarlar üst çekmecede.', 1),
  (list_id, 'ceiling', 'tavan', 'The ceiling was freshly painted.', 'Tavan yeni boyanmıştı.', 2),
  (list_id, 'balcony', 'balkon', 'We have coffee on the balcony.', 'Balkonda kahve içeriz.', 3),
  (list_id, 'hallway', 'koridor', 'Pictures hang in the hallway.', 'Koridorda fotoğraflar asılı.', 4),
  (list_id, 'attic', 'tavan arası', 'Old boxes are stored in the attic.', 'Eski kutular tavan arasında.', 5),
  (list_id, 'basement', 'bodrum', 'They turned the basement into a studio.', 'Bodrumu stüdyoya çevirdiler.', 6),
  (list_id, 'faucet', 'musluk', 'The faucet is dripping again.', 'Musluk yine damlıyor.', 7),
  (list_id, 'mattress', 'şilte', 'I need a new mattress.', 'Yeni bir şilteye ihtiyacım var.', 8),
  (list_id, 'cushion', 'yastık (koltuk)', 'These cushions are very soft.', 'Bu yastıklar çok yumuşak.', 9);

-- ============================================================================
-- 12) AİLE · AKRABALAR & İLİŞKİLER — 10 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Aile · Akrabalar & İlişkiler', 'home', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'cousin', 'kuzen', 'My cousin lives in another city.', 'Kuzenim başka bir şehirde yaşıyor.', 0),
  (list_id, 'nephew', 'erkek yeğen', 'My nephew turned five today.', 'Yeğenim bugün beş yaşına bastı.', 1),
  (list_id, 'niece', 'kız yeğen', 'My niece loves reading.', 'Kız yeğenim okumayı sever.', 2),
  (list_id, 'spouse', 'eş', 'My spouse and I share everything.', 'Eşim ve ben her şeyi paylaşırız.', 3),
  (list_id, 'sibling', 'kardeş', 'How many siblings do you have?', 'Kaç kardeşin var?', 4),
  (list_id, 'ancestor', 'ata', 'Her ancestors came from Anatolia.', 'Ataları Anadolu''dan geldi.', 5),
  (list_id, 'relative', 'akraba', 'We have relatives in Germany.', 'Almanya''da akrabalarımız var.', 6),
  (list_id, 'household', 'hane', 'Our household has four members.', 'Hanemizde dört kişi var.', 7),
  (list_id, 'heritage', 'miras', 'They are proud of their heritage.', 'Miraslarıyla gurur duyarlar.', 8),
  (list_id, 'upbringing', 'yetiştirme', 'His upbringing was very strict.', 'Yetiştirilme tarzı çok katıydı.', 9);

-- ============================================================================
-- 13) SOSYAL MEDYA · PLATFORM DİLİ — 13 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Sosyal Medya · Platform Dili', 'social', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'follower', 'takipçi', 'She has a million followers.', 'Bir milyon takipçisi var.', 0),
  (list_id, 'caption', 'altyazı (paylaşım)', 'The caption was witty.', 'Altyazı esprili idi.', 1),
  (list_id, 'influencer', 'influencer', 'He is a famous tech influencer.', 'O ünlü bir teknoloji influencer.', 2),
  (list_id, 'trending', 'trend olan', 'This topic is trending today.', 'Bu konu bugün trend.', 3),
  (list_id, 'viral', 'viral', 'The video went viral overnight.', 'Video bir gecede viral oldu.', 4),
  (list_id, 'hashtag', 'etiket', 'Use a trending hashtag.', 'Trend olan bir etiket kullan.', 5),
  (list_id, 'comment', 'yorum', 'I left a positive comment.', 'Olumlu bir yorum bıraktım.', 6),
  (list_id, 'share', 'paylaşmak', 'Please share this post.', 'Lütfen bu gönderiyi paylaş.', 7),
  (list_id, 'profile', 'profil', 'I updated my profile picture.', 'Profil fotoğrafımı güncelledim.', 8),
  (list_id, 'feed', 'akış', 'My feed is full of cat videos.', 'Akışım kedi videolarıyla dolu.', 9),
  (list_id, 'reel', 'kısa video (reel)', 'I made a quick reel today.', 'Bugün hızlı bir reel yaptım.', 10),
  (list_id, 'mention', 'bahsetmek', 'She mentioned me in her story.', 'Hikayesinde benden bahsetti.', 11),
  (list_id, 'block', 'engellemek', 'I had to block the spammer.', 'Spam atanı engellemek zorunda kaldım.', 12);

-- ============================================================================
-- 14) INTERNET · MESAJLAŞMA — 12 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Internet · Mesajlaşma', 'social', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'emoji', 'emoji', 'She replied with a smiling emoji.', 'Gülen emojiyle cevap verdi.', 0),
  (list_id, 'chat', 'sohbet', 'We had a long chat last night.', 'Dün gece uzun bir sohbet ettik.', 1),
  (list_id, 'forward', 'iletmek', 'Forward this message to your friend.', 'Bu mesajı arkadaşına ilet.', 2),
  (list_id, 'reply', 'cevap vermek', 'I will reply when I''m free.', 'Boş olduğumda cevap veririm.', 3),
  (list_id, 'notification', 'bildirim', 'I muted notifications during work.', 'Çalışırken bildirimleri sessize aldım.', 4),
  (list_id, 'inbox', 'gelen kutusu', 'My inbox is full of emails.', 'Gelen kutum e-postalarla dolu.', 5),
  (list_id, 'typing', 'yazıyor', 'I can see you''re typing.', 'Yazdığını görebiliyorum.', 6),
  (list_id, 'seen', 'görüldü', 'My message says seen but no reply.', 'Mesajım görüldü diyor ama cevap yok.', 7),
  (list_id, 'group', 'grup', 'Add me to the group chat.', 'Beni grup sohbetine ekle.', 8),
  (list_id, 'mute', 'sessize almak', 'I muted the noisy group.', 'Gürültülü grubu sessize aldım.', 9),
  (list_id, 'spam', 'spam', 'This email is just spam.', 'Bu e-posta sadece spam.', 10),
  (list_id, 'attachment', 'ek (dosya)', 'Don''t forget the attachment.', 'Eki unutma.', 11);

-- ============================================================================
-- 15) HABER · GÜNCEL KONULAR — 15 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Haber · Güncel Konular', 'news', 'Orta', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'headline', 'manşet', 'The headline caught my eye.', 'Manşet dikkatimi çekti.', 0),
  (list_id, 'journalist', 'gazeteci', 'The journalist asked tough questions.', 'Gazeteci zor sorular sordu.', 1),
  (list_id, 'broadcast', 'yayın', 'The match is broadcast live.', 'Maç canlı yayında.', 2),
  (list_id, 'interview', 'röportaj', 'She gave a long interview.', 'Uzun bir röportaj verdi.', 3),
  (list_id, 'column', 'köşe yazısı', 'I read his column every Sunday.', 'Pazarları onun köşe yazısını okurum.', 4),
  (list_id, 'coverage', 'haber yapma', 'The coverage was fair.', 'Haber tarafsızdı.', 5),
  (list_id, 'source', 'kaynak', 'They cited a reliable source.', 'Güvenilir bir kaynak gösterdiler.', 6),
  (list_id, 'update', 'güncelleme', 'Here is the latest update.', 'İşte en son güncelleme.', 7),
  (list_id, 'press', 'basın', 'The press waited outside.', 'Basın dışarıda bekledi.', 8),
  (list_id, 'media', 'medya', 'Social media changed the news.', 'Sosyal medya haberi değiştirdi.', 9),
  (list_id, 'controversy', 'tartışma', 'The decision caused controversy.', 'Karar tartışmaya yol açtı.', 10),
  (list_id, 'statement', 'açıklama', 'He made an official statement.', 'Resmi bir açıklama yaptı.', 11),
  (list_id, 'official', 'resmi', 'There is no official comment yet.', 'Henüz resmi yorum yok.', 12),
  (list_id, 'agenda', 'gündem', 'This is on the agenda today.', 'Bu bugünkü gündemde.', 13),
  (list_id, 'breakthrough', 'büyük gelişme', 'Scientists made a breakthrough.', 'Bilim insanları büyük gelişme kaydetti.', 14);

-- ============================================================================
-- 16) MARKET · ALIŞVERİŞ & ÜRÜN — 15 kelime
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Market · Alışveriş & Ürün', 'shopping', 'Kolay', true, NOW())
RETURNING id INTO list_id;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (list_id, 'cart', 'sepet (alışveriş)', 'Don''t forget to bring a cart.', 'Sepet getirmeyi unutma.', 0),
  (list_id, 'discount', 'indirim', 'There''s a huge discount today.', 'Bugün büyük bir indirim var.', 1),
  (list_id, 'receipt', 'fiş', 'Keep the receipt for returns.', 'İade için fişi sakla.', 2),
  (list_id, 'cashier', 'kasiyer', 'The cashier was very friendly.', 'Kasiyer çok arkadaş canlısıydı.', 3),
  (list_id, 'aisle', 'reyon arası', 'The pasta is in aisle three.', 'Makarna üçüncü reyonda.', 4),
  (list_id, 'checkout', 'kasa', 'The checkout line was long.', 'Kasa sırası uzundu.', 5),
  (list_id, 'shelf', 'raf', 'The top shelf has the cereals.', 'Üst rafta gevrekler var.', 6),
  (list_id, 'brand', 'marka', 'I prefer this brand of coffee.', 'Bu kahve markasını tercih ediyorum.', 7),
  (list_id, 'expiration', 'son kullanma', 'Check the expiration date.', 'Son kullanma tarihini kontrol et.', 8),
  (list_id, 'organic', 'organik', 'I buy organic vegetables.', 'Organik sebze alıyorum.', 9),
  (list_id, 'refund', 'iade', 'I asked for a refund.', 'İade talep ettim.', 10),
  (list_id, 'coupon', 'kupon', 'I have a coupon for milk.', 'Süt için bir kuponum var.', 11),
  (list_id, 'bargain', 'kelepir', 'This jacket was a real bargain.', 'Bu ceket gerçek bir kelepirdi.', 12),
  (list_id, 'retail', 'perakende', 'She works in retail.', 'Perakende sektöründe çalışıyor.', 13),
  (list_id, 'inventory', 'stok', 'They are doing inventory today.', 'Bugün stok sayımı yapıyorlar.', 14);

END $$;

-- ============================================================================
-- ✅ TAMAMLANDI: 16 yeni liste, 200 yeni kelime, 9 yeni kategori (slug):
--     nature, emotions, sports, transportation, arts, home, social, news, shopping
-- ============================================================================
