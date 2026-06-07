-- ============================================================================
-- FlashcardMobile — Ekstra 200 kelime (Part 1) / 7 yeni liste
-- Kategoriler: daily, social, food (x2), tech, academic, travel
-- Süpabase SQL Editor'da çalıştır.
-- ============================================================================

DO $$
DECLARE
  l1 UUID; l2 UUID; l3 UUID; l4 UUID; l5 UUID; l6 UUID; l7 UUID;
BEGIN

-- ============================================================================
-- 1) GÜNLÜK DİYALOG KALIPLARI — 14 kelime (daily)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Diyalog Kalıpları · Günlük', 'daily', 'Kolay', true, NOW())
RETURNING id INTO l1;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l1, 'pardon', 'affedersin', 'Pardon, could you repeat that?', 'Pardon, tekrar eder misin?', 0),
  (l1, 'sure', 'tabii', 'Sure, I can help you.', 'Tabii, sana yardım edebilirim.', 1),
  (l1, 'maybe', 'belki', 'Maybe we should leave early.', 'Belki erken çıkmalıyız.', 2),
  (l1, 'really', 'gerçekten', 'I really enjoyed the movie.', 'Filmden gerçekten hoşlandım.', 3),
  (l1, 'exactly', 'aynen', 'That is exactly what I meant.', 'Tam olarak demek istediğim buydu.', 4),
  (l1, 'definitely', 'kesinlikle', 'I will definitely call you.', 'Seni kesinlikle arayacağım.', 5),
  (l1, 'whatever', 'her neyse', 'Whatever you decide is fine.', 'Ne karar verirsen olur.', 6),
  (l1, 'anyway', 'her neyse', 'Anyway, let''s move on.', 'Her neyse, devam edelim.', 7),
  (l1, 'somehow', 'bir şekilde', 'Somehow he managed to win.', 'Bir şekilde kazanmayı başardı.', 8),
  (l1, 'instead', 'yerine', 'Let''s have tea instead of coffee.', 'Kahve yerine çay içelim.', 9),
  (l1, 'besides', 'ayrıca', 'Besides, it is too late now.', 'Ayrıca artık çok geç.', 10),
  (l1, 'though', 'gerçi', 'It is cold, though sunny.', 'Soğuk, gerçi güneşli.', 11),
  (l1, 'unless', 'sürece', 'I won''t go unless you come.', 'Sen gelmedikçe gitmem.', 12),
  (l1, 'whenever', 'ne zaman olursa', 'Call me whenever you want.', 'Ne zaman istersen ara.', 13);

-- ============================================================================
-- 2) HAVA DURUMU & SOHBET — 14 kelime (daily)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Hava Durumu · Sohbet', 'daily', 'Kolay', true, NOW())
RETURNING id INTO l2;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l2, 'sunny', 'güneşli', 'It is a sunny morning.', 'Güneşli bir sabah.', 0),
  (l2, 'cloudy', 'bulutlu', 'The sky looks cloudy today.', 'Gökyüzü bugün bulutlu görünüyor.', 1),
  (l2, 'rainy', 'yağmurlu', 'It is rainy outside.', 'Dışarısı yağmurlu.', 2),
  (l2, 'foggy', 'sisli', 'The road is foggy this morning.', 'Yol bu sabah sisli.', 3),
  (l2, 'humid', 'nemli', 'Summers here are very humid.', 'Buradaki yazlar çok nemli.', 4),
  (l2, 'breeze', 'esinti', 'A cool breeze touched my face.', 'Yüzüme serin bir esinti dokundu.', 5),
  (l2, 'thunder', 'gök gürültüsü', 'I heard thunder last night.', 'Dün gece gök gürültüsü duydum.', 6),
  (l2, 'lightning', 'şimşek', 'Lightning lit up the sky.', 'Şimşek gökyüzünü aydınlattı.', 7),
  (l2, 'snowfall', 'kar yağışı', 'Heavy snowfall closed the roads.', 'Yoğun kar yağışı yolları kapattı.', 8),
  (l2, 'hailstone', 'dolu tanesi', 'A hailstone hit the window.', 'Bir dolu tanesi pencereye çarptı.', 9),
  (l2, 'forecast', 'tahmin', 'The forecast says rain tomorrow.', 'Tahmin yarın yağmur diyor.', 10),
  (l2, 'temperature', 'sıcaklık', 'The temperature dropped suddenly.', 'Sıcaklık aniden düştü.', 11),
  (l2, 'umbrella', 'şemsiye', 'Don''t forget your umbrella.', 'Şemsiyeni unutma.', 12),
  (l2, 'sunset', 'gün batımı', 'The sunset was beautiful tonight.', 'Bu akşam gün batımı çok güzeldi.', 13);

-- ============================================================================
-- 3) TARTIŞMA & GÖRÜŞ — 14 kelime (social)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Tartışma · Görüş Belirtme', 'social', 'Orta', true, NOW())
RETURNING id INTO l3;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l3, 'agree', 'katılmak', 'I agree with your opinion.', 'Görüşüne katılıyorum.', 0),
  (l3, 'disagree', 'katılmamak', 'I disagree with that idea.', 'Bu fikre katılmıyorum.', 1),
  (l3, 'argue', 'tartışmak', 'They argue about politics often.', 'Sık sık siyaset hakkında tartışırlar.', 2),
  (l3, 'debate', 'müzakere', 'The debate lasted two hours.', 'Müzakere iki saat sürdü.', 3),
  (l3, 'opinion', 'görüş', 'In my opinion, he is right.', 'Bence o haklı.', 4),
  (l3, 'perspective', 'bakış açısı', 'Try to see her perspective.', 'Onun bakış açısını görmeye çalış.', 5),
  (l3, 'convince', 'ikna etmek', 'You can''t convince me easily.', 'Beni kolayca ikna edemezsin.', 6),
  (l3, 'persuade', 'razı etmek', 'She persuaded me to stay.', 'Beni kalmaya razı etti.', 7),
  (l3, 'suggest', 'önermek', 'I suggest we wait a while.', 'Biraz beklemeyi öneriyorum.', 8),
  (l3, 'oppose', 'karşı çıkmak', 'Many people oppose the law.', 'Birçok insan yasaya karşı çıkıyor.', 9),
  (l3, 'support', 'desteklemek', 'I support your decision.', 'Kararını destekliyorum.', 10),
  (l3, 'claim', 'iddia etmek', 'He claims to be innocent.', 'Masum olduğunu iddia ediyor.', 11),
  (l3, 'admit', 'kabullenmek', 'I admit I was wrong.', 'Yanıldığımı kabul ediyorum.', 12),
  (l3, 'deny', 'inkar etmek', 'She denies the accusation.', 'Suçlamayı inkar ediyor.', 13);

-- ============================================================================
-- 4) KAHVALTI ÇEŞİTLERİ — 14 kelime (food)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Kahvaltı · Mutfak', 'food', 'Kolay', true, NOW())
RETURNING id INTO l4;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l4, 'omelette', 'omlet', 'I made cheese omelette for breakfast.', 'Kahvaltıya peynirli omlet yaptım.', 0),
  (l4, 'pancake', 'krep', 'She loves pancakes with honey.', 'Ballı krepleri çok seviyor.', 1),
  (l4, 'cereal', 'gevrek', 'I eat cereal every morning.', 'Her sabah gevrek yerim.', 2),
  (l4, 'toast', 'kızarmış ekmek', 'Would you like butter on your toast?', 'Kızarmış ekmeğine tereyağ ister misin?', 3),
  (l4, 'yogurt', 'yoğurt', 'Yogurt is good for digestion.', 'Yoğurt sindirim için iyidir.', 4),
  (l4, 'honey', 'bal', 'Honey is sweeter than sugar.', 'Bal şekerden daha tatlıdır.', 5),
  (l4, 'jam', 'reçel', 'I spread jam on my bread.', 'Ekmeğime reçel sürdüm.', 6),
  (l4, 'sausage', 'sosis', 'He fried sausages for breakfast.', 'Kahvaltıya sosis kızarttı.', 7),
  (l4, 'pastry', 'hamur işi', 'Fresh pastries smell amazing.', 'Taze hamur işleri harika kokar.', 8),
  (l4, 'olive', 'zeytin', 'Black olives are my favorite.', 'Siyah zeytin en sevdiğim.', 9),
  (l4, 'feta', 'beyaz peynir', 'Feta cheese goes well with tomatoes.', 'Beyaz peynir domatesle çok iyi gider.', 10),
  (l4, 'bagel', 'simit benzeri ekmek', 'I had a bagel and cream cheese.', 'Krem peynirli bir bagel yedim.', 11),
  (l4, 'porridge', 'lapa', 'Porridge keeps me full till noon.', 'Lapa beni öğleye kadar tok tutar.', 12),
  (l4, 'muffin', 'kek mafin', 'These blueberry muffins are delicious.', 'Bu yaban mersinli muffinler nefis.', 13);

-- ============================================================================
-- 5) İÇECEKLER — 14 kelime (food)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('İçecekler · Sıcak & Soğuk', 'food', 'Kolay', true, NOW())
RETURNING id INTO l5;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l5, 'espresso', 'espresso', 'I take my espresso with no sugar.', 'Espressomu şekersiz içerim.', 0),
  (l5, 'latte', 'latte', 'A vanilla latte, please.', 'Bir vanilyalı latte lütfen.', 1),
  (l5, 'cocoa', 'kakao', 'Hot cocoa warms me up.', 'Sıcak kakao beni ısıtır.', 2),
  (l5, 'smoothie', 'smoothie', 'I made a banana smoothie.', 'Muzlu smoothie yaptım.', 3),
  (l5, 'lemonade', 'limonata', 'Fresh lemonade tastes amazing.', 'Taze limonata harika tat verir.', 4),
  (l5, 'juice', 'meyve suyu', 'Orange juice is rich in vitamin C.', 'Portakal suyu C vitamini açısından zengindir.', 5),
  (l5, 'soda', 'gazoz', 'I rarely drink soda anymore.', 'Artık nadiren gazoz içerim.', 6),
  (l5, 'sparkling', 'gazlı', 'Sparkling water tickles my throat.', 'Gazlı su boğazımı gıdıklar.', 7),
  (l5, 'herbal', 'bitkisel', 'Herbal tea helps me sleep.', 'Bitki çayı uykuma yardımcı oluyor.', 8),
  (l5, 'brew', 'demlemek', 'I brew coffee every morning.', 'Her sabah kahve demlerim.', 9),
  (l5, 'ginger', 'zencefil', 'Ginger tea is good for colds.', 'Zencefil çayı soğuk algınlığına iyi gelir.', 10),
  (l5, 'minty', 'naneli', 'I love minty cold drinks.', 'Naneli soğuk içecekleri seviyorum.', 11),
  (l5, 'caffeine', 'kafein', 'Caffeine keeps me awake at night.', 'Kafein geceleri uyumama izin vermez.', 12),
  (l5, 'cocktail', 'kokteyl', 'They served fruit cocktails by the pool.', 'Havuz başında meyve kokteyli servis ettiler.', 13);

-- ============================================================================
-- 6) AKILLI CİHAZLAR — 15 kelime (tech)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Akıllı Cihazlar · IoT', 'tech', 'Orta', true, NOW())
RETURNING id INTO l6;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l6, 'sensor', 'sensör', 'The sensor detects motion easily.', 'Sensör hareketi kolayca algılar.', 0),
  (l6, 'device', 'cihaz', 'This device runs on battery.', 'Bu cihaz pille çalışır.', 1),
  (l6, 'wearable', 'giyilebilir', 'My wearable tracks my heart rate.', 'Giyilebilir cihazım nabzımı takip eder.', 2),
  (l6, 'bluetooth', 'bluetooth', 'Connect via bluetooth to start.', 'Başlamak için bluetooth ile bağlan.', 3),
  (l6, 'firmware', 'aygıt yazılımı', 'Please update the firmware.', 'Lütfen aygıt yazılımını güncelle.', 4),
  (l6, 'voice', 'ses (komutu)', 'I control lights with voice commands.', 'Işıkları sesli komutla kontrol ediyorum.', 5),
  (l6, 'assistant', 'asistan', 'The voice assistant set my alarm.', 'Sesli asistan alarmımı kurdu.', 6),
  (l6, 'smart', 'akıllı', 'I bought a smart doorbell.', 'Akıllı kapı zili aldım.', 7),
  (l6, 'thermostat', 'termostat', 'The thermostat adjusts itself.', 'Termostat kendini ayarlar.', 8),
  (l6, 'router', 'modem yönlendirici', 'Restart the router if it lags.', 'Takılırsa modemi yeniden başlat.', 9),
  (l6, 'charger', 'şarj aleti', 'Where did I put my charger?', 'Şarj aletimi nereye koydum?', 10),
  (l6, 'speaker', 'hoparlör', 'The smart speaker plays my playlist.', 'Akıllı hoparlör çalma listemi oynatıyor.', 11),
  (l6, 'drone', 'drone', 'The drone captured aerial photos.', 'Drone havadan fotoğraflar çekti.', 12),
  (l6, 'pairing', 'eşleştirme', 'Pairing failed; try again.', 'Eşleştirme başarısız; tekrar dene.', 13),
  (l6, 'gadget', 'aygıt', 'He loves trying new gadgets.', 'Yeni aygıtları denemeyi seviyor.', 14);

-- ============================================================================
-- 7) BİLİM & DENEY — 15 kelime (academic)
-- ============================================================================
INSERT INTO lists (title, category, level, is_public, inserted_at)
VALUES ('Bilim · Deney & Laboratuvar', 'academic', 'İleri', true, NOW())
RETURNING id INTO l7;

INSERT INTO words (list_id, word, meaning, example, example_tr, position) VALUES
  (l7, 'hypothesis', 'hipotez', 'Our hypothesis was confirmed.', 'Hipotezimiz doğrulandı.', 0),
  (l7, 'experiment', 'deney', 'The experiment took two weeks.', 'Deney iki hafta sürdü.', 1),
  (l7, 'observation', 'gözlem', 'Make a careful observation first.', 'Önce dikkatli bir gözlem yap.', 2),
  (l7, 'variable', 'değişken', 'Identify the independent variable.', 'Bağımsız değişkeni belirle.', 3),
  (l7, 'result', 'sonuç', 'The results were surprising.', 'Sonuçlar şaşırtıcıydı.', 4),
  (l7, 'theory', 'teori', 'Her theory explains the data well.', 'Teorisi verileri iyi açıklıyor.', 5),
  (l7, 'analysis', 'analiz', 'The analysis took several days.', 'Analiz birkaç gün sürdü.', 6),
  (l7, 'sample', 'numune', 'We tested a small sample first.', 'Önce küçük bir numuneyi test ettik.', 7),
  (l7, 'measure', 'ölçmek', 'Measure the liquid precisely.', 'Sıvıyı hassas şekilde ölç.', 8),
  (l7, 'molecule', 'molekül', 'Water is a simple molecule.', 'Su basit bir moleküldür.', 9),
  (l7, 'atom', 'atom', 'Every atom has a nucleus.', 'Her atomun bir çekirdeği vardır.', 10),
  (l7, 'reaction', 'tepkime', 'The chemical reaction was fast.', 'Kimyasal tepkime hızlıydı.', 11),
  (l7, 'evidence', 'kanıt', 'There is strong evidence for it.', 'Bunun için güçlü kanıt var.', 12),
  (l7, 'conclude', 'sonuçlandırmak', 'We concluded the study yesterday.', 'Çalışmayı dün sonuçlandırdık.', 13),
  (l7, 'publish', 'yayınlamak', 'They will publish the paper soon.', 'Makaleyi yakında yayınlayacaklar.', 14);

END $$;
