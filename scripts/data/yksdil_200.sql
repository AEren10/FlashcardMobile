-- BEGIN YKSDIL PACK
-- 5 public lists, 200 words total for YKS-DİL (YDT) — high school to university entrance English exam
-- Levels: Kolay (A2-B1), Orta (B1-B2), İleri (B2)

-- ============================================================
-- LIST 1: YKS-DİL · Tanışma — 25 kelime — Kolay (A2-B1)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YKS-DİL · Tanışma', 'YKS-DİL için hızlı başlangıç — 25 temel kelime', 'Kolay', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'accept', 'kabul etmek, onaylamak', 'She decided to accept the offer from the university in Ankara.', 'Ankara''daki üniversiteden gelen teklifi kabul etmeye karar verdi.', 1, NOW()),
    (v_list_id, 'achieve', 'başarmak, elde etmek', 'You can achieve great results if you study every day.', 'Her gün çalışırsan harika sonuçlar elde edebilirsin.', 2, NOW()),
    (v_list_id, 'ancient', 'antik, çok eski', 'We visited an ancient city during our school trip last spring.', 'Geçen bahar okul gezimizde antik bir şehri ziyaret ettik.', 3, NOW()),
    (v_list_id, 'announce', 'duyurmak, ilan etmek', 'The teacher will announce the exam results on Friday morning.', 'Öğretmen sınav sonuçlarını cuma sabahı duyuracak.', 4, NOW()),
    (v_list_id, 'appreciate', 'takdir etmek, değer vermek', 'I really appreciate your help with my chemistry homework.', 'Kimya ödevimde yardımın için sana gerçekten minnettarım.', 5, NOW()),
    (v_list_id, 'approach', 'yaklaşmak, yaklaşım', 'As the exam day approached, students became more nervous.', 'Sınav günü yaklaştıkça öğrenciler daha gergin oldu.', 6, NOW()),
    (v_list_id, 'arrange', 'düzenlemek, ayarlamak', 'Our teacher arranged a meeting with the school counselor.', 'Öğretmenimiz rehber öğretmenle bir görüşme ayarladı.', 7, NOW()),
    (v_list_id, 'attempt', 'denemek, girişim', 'This is my second attempt to solve the difficult math problem.', 'Bu, zor matematik problemini çözmek için ikinci girişimim.', 8, NOW()),
    (v_list_id, 'attend', 'katılmak, devam etmek', 'Students must attend every class to pass the course.', 'Öğrenciler dersi geçmek için her derse katılmak zorundadır.', 9, NOW()),
    (v_list_id, 'attitude', 'tutum, davranış', 'A positive attitude helps you succeed in school and life.', 'Olumlu bir tutum okulda ve hayatta başarılı olmana yardım eder.', 10, NOW()),
    (v_list_id, 'attract', 'çekmek, cezbetmek', 'The science fair attracted hundreds of curious high school students.', 'Bilim fuarı yüzlerce meraklı lise öğrencisini çekti.', 11, NOW()),
    (v_list_id, 'available', 'mevcut, müsait', 'The library books are available for all students every day.', 'Kütüphane kitapları her gün tüm öğrenciler için mevcuttur.', 12, NOW()),
    (v_list_id, 'avoid', 'kaçınmak, sakınmak', 'Try to avoid using your phone during the study sessions.', 'Çalışma saatleri sırasında telefonunu kullanmaktan kaçınmaya çalış.', 13, NOW()),
    (v_list_id, 'behavior', 'davranış, tutum', 'Her behavior in class was kind and respectful to everyone.', 'Sınıftaki davranışı herkese karşı kibar ve saygılıydı.', 14, NOW()),
    (v_list_id, 'beneficial', 'yararlı, faydalı', 'Reading English books daily is beneficial for your vocabulary.', 'Her gün İngilizce kitap okumak kelime hazinene faydalıdır.', 15, NOW()),
    (v_list_id, 'beyond', 'ötesinde, dışında', 'Her knowledge of grammar is beyond what we expected.', 'Onun gramer bilgisi beklediğimizin ötesindedir.', 16, NOW()),
    (v_list_id, 'brief', 'kısa, özet', 'The teacher gave a brief explanation of the lesson topic.', 'Öğretmen ders konusu hakkında kısa bir açıklama yaptı.', 17, NOW()),
    (v_list_id, 'capable', 'yetenekli, muktedir', 'You are capable of getting a high score in the exam.', 'Sınavda yüksek puan almaya yeteneklisin.', 18, NOW()),
    (v_list_id, 'careful', 'dikkatli, özenli', 'Be careful when you answer the multiple choice questions.', 'Çoktan seçmeli soruları cevaplarken dikkatli ol.', 19, NOW()),
    (v_list_id, 'ceremony', 'tören, merasim', 'Our school holds a graduation ceremony at the end of June.', 'Okulumuz haziran sonunda bir mezuniyet töreni düzenler.', 20, NOW()),
    (v_list_id, 'challenge', 'meydan okuma, zorluk', 'Preparing for YKS-DİL is a real challenge for many students.', 'YKS-DİL''e hazırlanmak birçok öğrenci için gerçek bir zorluktur.', 21, NOW()),
    (v_list_id, 'chance', 'şans, fırsat', 'Every student deserves a fair chance to succeed.', 'Her öğrenci başarılı olmak için adil bir şansı hak eder.', 22, NOW()),
    (v_list_id, 'choice', 'seçim, tercih', 'Choosing the right university is an important choice.', 'Doğru üniversiteyi seçmek önemli bir tercihtir.', 23, NOW()),
    (v_list_id, 'clear', 'açık, net', 'The teacher gave us a clear example of the new grammar rule.', 'Öğretmen bize yeni gramer kuralının açık bir örneğini verdi.', 24, NOW()),
    (v_list_id, 'common', 'yaygın, ortak', 'Making spelling mistakes is common when you start learning.', 'Öğrenmeye başladığında yazım hataları yapmak yaygındır.', 25, NOW());
END $$;

-- ============================================================
-- LIST 2: YKS-DİL · Lise Temel — 35 kelime — Orta (B1)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YKS-DİL · Lise Temel', 'B1 seviye günlük ve okul İngilizcesi — 35 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'achievement', 'başarı, kazanım', 'Winning the science contest was her biggest achievement this year.', 'Bilim yarışmasını kazanmak onun bu yılki en büyük başarısıydı.', 1, NOW()),
    (v_list_id, 'admire', 'hayran olmak, takdir etmek', 'I admire my English teacher for her patience and kindness.', 'İngilizce öğretmenime sabrı ve nezaketi için hayranım.', 2, NOW()),
    (v_list_id, 'allow', 'izin vermek, müsaade etmek', 'My parents allow me to study with friends on weekends.', 'Ailem hafta sonları arkadaşlarımla çalışmama izin veriyor.', 3, NOW()),
    (v_list_id, 'argue', 'tartışmak, iddia etmek', 'Some students argue that homework is not really useful.', 'Bazı öğrenciler ödevin gerçekten yararlı olmadığını iddia eder.', 4, NOW()),
    (v_list_id, 'assignment', 'ödev, görev', 'I have a long English assignment due next Monday morning.', 'Önümüzdeki pazartesi sabahı teslim edilecek uzun bir İngilizce ödevim var.', 5, NOW()),
    (v_list_id, 'borrow', 'ödünç almak', 'May I borrow your dictionary for the writing class?', 'Yazma dersi için sözlüğünü ödünç alabilir miyim?', 6, NOW()),
    (v_list_id, 'character', 'karakter, kişilik', 'The main character in the story is a brave young girl.', 'Hikâyedeki ana karakter cesur genç bir kızdır.', 7, NOW()),
    (v_list_id, 'choose', 'seçmek, tercih etmek', 'Students must choose between science and social studies tracks.', 'Öğrenciler fen ve sosyal bilimler yolları arasında seçim yapmalı.', 8, NOW()),
    (v_list_id, 'claim', 'iddia etmek, talep etmek', 'He claims that his method of memorizing words is the best.', 'Kelime ezberleme yönteminin en iyisi olduğunu iddia ediyor.', 9, NOW()),
    (v_list_id, 'community', 'topluluk, cemiyet', 'Our school community organizes a charity event every spring.', 'Okul topluluğumuz her bahar bir yardım etkinliği düzenler.', 10, NOW()),
    (v_list_id, 'compare', 'karşılaştırmak', 'Let''s compare our test results to see who studied harder.', 'Test sonuçlarımızı karşılaştıralım, kimin daha çok çalıştığını görelim.', 11, NOW()),
    (v_list_id, 'complete', 'tamamlamak, eksiksiz', 'Please complete the exercise before the next English class.', 'Lütfen alıştırmayı bir sonraki İngilizce dersinden önce tamamla.', 12, NOW()),
    (v_list_id, 'concentrate', 'odaklanmak, yoğunlaşmak', 'It is hard to concentrate when your phone keeps ringing.', 'Telefonun sürekli çaldığında odaklanmak zordur.', 13, NOW()),
    (v_list_id, 'concern', 'endişe, ilgilendirmek', 'My parents'' main concern is my performance in the exam.', 'Annemle babamın asıl endişesi benim sınavdaki performansım.', 14, NOW()),
    (v_list_id, 'condition', 'durum, koşul', 'Studying in good condition helps you remember information better.', 'İyi koşullarda çalışmak bilgiyi daha iyi hatırlamana yardımcı olur.', 15, NOW()),
    (v_list_id, 'conflict', 'çatışma, anlaşmazlık', 'Try to solve any conflict with your classmates calmly.', 'Sınıf arkadaşlarınla herhangi bir anlaşmazlığı sakince çözmeye çalış.', 16, NOW()),
    (v_list_id, 'confuse', 'kafa karıştırmak, şaşırtmak', 'These two grammar rules often confuse high school students.', 'Bu iki gramer kuralı sık sık lise öğrencilerinin kafasını karıştırır.', 17, NOW()),
    (v_list_id, 'connect', 'bağlanmak, ilişkilendirmek', 'Try to connect new words with sentences from your daily life.', 'Yeni kelimeleri günlük hayatından cümlelerle ilişkilendirmeye çalış.', 18, NOW()),
    (v_list_id, 'conscious', 'bilinçli, farkında', 'You should be conscious of how much time you spend online.', 'İnternette ne kadar zaman geçirdiğinin farkında olmalısın.', 19, NOW()),
    (v_list_id, 'consider', 'düşünmek, göz önüne almak', 'You should consider studying abroad after high school.', 'Liseden sonra yurtdışında okumayı düşünmelisin.', 20, NOW()),
    (v_list_id, 'consume', 'tüketmek, harcamak', 'Social media can consume hours of your study time daily.', 'Sosyal medya günlük çalışma zamanından saatler tüketebilir.', 21, NOW()),
    (v_list_id, 'contain', 'içermek, kapsamak', 'This textbook contains all the topics needed for the exam.', 'Bu ders kitabı sınav için gereken tüm konuları içerir.', 22, NOW()),
    (v_list_id, 'contemporary', 'çağdaş, modern', 'We read both classic and contemporary novels in literature class.', 'Edebiyat dersinde hem klasik hem çağdaş romanlar okuyoruz.', 23, NOW()),
    (v_list_id, 'contribute', 'katkıda bulunmak', 'Each student should contribute ideas to the class project.', 'Her öğrenci sınıf projesine fikir katkısında bulunmalı.', 24, NOW()),
    (v_list_id, 'create', 'yaratmak, oluşturmak', 'Our teacher asked us to create a poster about famous writers.', 'Öğretmenimiz bizden ünlü yazarlar hakkında bir poster oluşturmamızı istedi.', 25, NOW()),
    (v_list_id, 'depend', 'bağlı olmak, güvenmek', 'Your exam score depends on regular study and good sleep.', 'Sınav puanın düzenli çalışmaya ve iyi uykuya bağlıdır.', 26, NOW()),
    (v_list_id, 'describe', 'tanımlamak, betimlemek', 'Can you describe your dream school in three sentences?', 'Hayalindeki okulu üç cümleyle tanımlayabilir misin?', 27, NOW()),
    (v_list_id, 'develop', 'geliştirmek, gelişmek', 'Reading novels helps students develop strong English skills.', 'Roman okumak öğrencilerin güçlü İngilizce becerileri geliştirmesine yardım eder.', 28, NOW()),
    (v_list_id, 'discuss', 'tartışmak, görüşmek', 'In English class, we often discuss social issues together.', 'İngilizce dersinde sık sık sosyal konuları birlikte tartışıyoruz.', 29, NOW()),
    (v_list_id, 'educate', 'eğitmek, öğretmek', 'Teachers educate students for both exams and real life.', 'Öğretmenler öğrencileri hem sınavlar hem gerçek hayat için eğitir.', 30, NOW()),
    (v_list_id, 'effort', 'çaba, gayret', 'Real success comes only with constant effort and patience.', 'Gerçek başarı ancak sürekli çaba ve sabırla gelir.', 31, NOW()),
    (v_list_id, 'either', 'her ikisi de, ya da', 'You can either join the math club or the drama club.', 'Ya matematik kulübüne ya da tiyatro kulübüne katılabilirsin.', 32, NOW()),
    (v_list_id, 'enough', 'yeterli, kâfi', 'I did not study enough for the last vocabulary quiz.', 'Son kelime sınavı için yeterince çalışmadım.', 33, NOW()),
    (v_list_id, 'enter', 'girmek, kayıt olmak', 'Many students hope to enter a top university after YKS.', 'Birçok öğrenci YKS''den sonra iyi bir üniversiteye girmeyi umuyor.', 34, NOW()),
    (v_list_id, 'expect', 'beklemek, ummak', 'Our teacher expects us to read one English book each month.', 'Öğretmenimiz her ay bir İngilizce kitap okumamızı bekliyor.', 35, NOW());
END $$;

-- ============================================================
-- LIST 3: YKS-DİL · Sınav Pratiği 1 — 45 kelime — Orta (B1-B2)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YKS-DİL · Sınav Pratiği 1', 'B1-B2 seviye sınav kelimeleri — 45 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'ability', 'yetenek, kabiliyet', 'Reading regularly improves your ability to understand long passages.', 'Düzenli okumak uzun parçaları anlama yeteneğini geliştirir.', 1, NOW()),
    (v_list_id, 'achieve', 'başarmak, ulaşmak', 'To achieve your dreams, you need a clear plan and discipline.', 'Hayallerine ulaşmak için net bir plana ve disipline ihtiyacın var.', 2, NOW()),
    (v_list_id, 'admit', 'kabul etmek, itiraf etmek', 'He had to admit that he did not study for the test.', 'Sınav için çalışmadığını kabul etmek zorunda kaldı.', 3, NOW()),
    (v_list_id, 'aim', 'amaç, hedeflemek', 'My main aim this year is to pass the YKS-DİL exam.', 'Bu yıl ana hedefim YKS-DİL sınavını geçmek.', 4, NOW()),
    (v_list_id, 'allow', 'izin vermek, olanak sağlamak', 'This method allows you to learn new words quickly and effectively.', 'Bu yöntem yeni kelimeleri hızlı ve etkili öğrenmeni sağlar.', 5, NOW()),
    (v_list_id, 'amount', 'miktar, tutar', 'A small amount of daily study is better than long sessions.', 'Az miktarda günlük çalışma uzun seanslardan daha iyidir.', 6, NOW()),
    (v_list_id, 'announce', 'duyurmak, açıklamak', 'The principal will announce the schedule next week.', 'Müdür, programı önümüzdeki hafta açıklayacak.', 7, NOW()),
    (v_list_id, 'apply', 'başvurmak, uygulamak', 'Many students apply to universities abroad each year.', 'Her yıl birçok öğrenci yurtdışı üniversitelere başvuruyor.', 8, NOW()),
    (v_list_id, 'approach', 'yaklaşım, yöntem', 'Her approach to learning grammar is creative and very useful.', 'Onun gramer öğrenme yaklaşımı yaratıcı ve çok faydalı.', 9, NOW()),
    (v_list_id, 'argue', 'tartışmak, savunmak', 'The author argues that hard work matters more than talent.', 'Yazar, çok çalışmanın yetenekten daha önemli olduğunu savunur.', 10, NOW()),
    (v_list_id, 'arrive', 'varmak, ulaşmak', 'Students must arrive at the exam hall at least an hour early.', 'Öğrenciler sınav salonuna en az bir saat önce varmalı.', 11, NOW()),
    (v_list_id, 'aware', 'farkında, bilinçli', 'Be aware of the time when you are doing reading questions.', 'Okuma sorularını çözerken zamanın farkında ol.', 12, NOW()),
    (v_list_id, 'benefit', 'fayda, yararlanmak', 'Every student can benefit from a daily review of new vocabulary.', 'Her öğrenci yeni kelimelerin günlük tekrarından faydalanabilir.', 13, NOW()),
    (v_list_id, 'cause', 'neden olmak, sebep', 'Stress can cause students to perform poorly during exams.', 'Stres, öğrencilerin sınavlarda kötü performans göstermesine neden olabilir.', 14, NOW()),
    (v_list_id, 'choice', 'seçenek, tercih', 'Smart choices during preparation lead to better exam results.', 'Hazırlık sırasındaki akıllı seçimler daha iyi sınav sonuçlarına götürür.', 15, NOW()),
    (v_list_id, 'convince', 'ikna etmek', 'My teacher convinced me to take English classes more seriously.', 'Öğretmenim, İngilizce dersleri daha ciddiye almam için beni ikna etti.', 16, NOW()),
    (v_list_id, 'courage', 'cesaret, yüreklilik', 'It takes courage to speak in English in front of the class.', 'Sınıfın önünde İngilizce konuşmak cesaret ister.', 17, NOW()),
    (v_list_id, 'current', 'güncel, akım', 'Reading the current news helps your vocabulary grow naturally.', 'Güncel haberleri okumak kelime hazinenin doğal şekilde büyümesine yardım eder.', 18, NOW()),
    (v_list_id, 'curious', 'meraklı', 'Curious students often learn faster than the others.', 'Meraklı öğrenciler genellikle diğerlerinden daha hızlı öğrenir.', 19, NOW()),
    (v_list_id, 'custom', 'gelenek, alışkanlık', 'It is a custom in our school to wear uniforms every day.', 'Okulumuzda her gün üniforma giymek bir gelenektir.', 20, NOW()),
    (v_list_id, 'damage', 'zarar, hasar', 'Lack of sleep can damage your concentration during the test.', 'Uyku eksikliği sınav sırasında konsantrasyonuna zarar verebilir.', 21, NOW()),
    (v_list_id, 'declare', 'ilan etmek, beyan etmek', 'The teacher declared that the homework was due on Monday.', 'Öğretmen ödevin pazartesi teslim edileceğini ilan etti.', 22, NOW()),
    (v_list_id, 'decrease', 'azalmak, düşmek', 'My anxiety decreased after I started studying with a plan.', 'Planlı çalışmaya başladıktan sonra kaygım azaldı.', 23, NOW()),
    (v_list_id, 'defeat', 'yenmek, yenilgi', 'Do not let one bad test defeat your motivation to study.', 'Bir kötü testin çalışma motivasyonunu yenmesine izin verme.', 24, NOW()),
    (v_list_id, 'define', 'tanımlamak', 'Can you define this word in your own simple words?', 'Bu kelimeyi kendi basit kelimelerinle tanımlayabilir misin?', 25, NOW()),
    (v_list_id, 'deliver', 'teslim etmek, sunmak', 'Each student must deliver their project before the deadline.', 'Her öğrenci projesini son tarihten önce teslim etmeli.', 26, NOW()),
    (v_list_id, 'demand', 'talep, talep etmek', 'Some teachers demand a lot of work from their students.', 'Bazı öğretmenler öğrencilerinden çok fazla iş talep eder.', 27, NOW()),
    (v_list_id, 'depend', 'bağlı olmak', 'Your future depends largely on the decisions you make now.', 'Geleceğin büyük ölçüde şimdi yaptığın seçimlere bağlı.', 28, NOW()),
    (v_list_id, 'deserve', 'hak etmek', 'Students who work hard deserve to enter good universities.', 'Çok çalışan öğrenciler iyi üniversitelere girmeyi hak eder.', 29, NOW()),
    (v_list_id, 'despite', 'rağmen', 'Despite the difficulties, she finished her project on time.', 'Zorluklara rağmen projesini zamanında bitirdi.', 30, NOW()),
    (v_list_id, 'destroy', 'yok etmek, mahvetmek', 'Negative thoughts can destroy your confidence before the exam.', 'Olumsuz düşünceler sınavdan önce öz güvenini mahvedebilir.', 31, NOW()),
    (v_list_id, 'determined', 'kararlı, azimli', 'She is determined to get the highest score in her class.', 'Sınıfında en yüksek puanı almaya kararlı.', 32, NOW()),
    (v_list_id, 'devote', 'adamak, ayırmak', 'I devote two hours every evening to English practice.', 'Her akşam iki saatimi İngilizce pratiğine ayırıyorum.', 33, NOW()),
    (v_list_id, 'difficulty', 'zorluk, güçlük', 'Many students have difficulty with reading comprehension questions.', 'Birçok öğrenci okuduğunu anlama sorularında zorluk yaşıyor.', 34, NOW()),
    (v_list_id, 'dignity', 'onur, saygınlık', 'Treat every classmate with kindness and dignity always.', 'Her sınıf arkadaşına her zaman nezaket ve onurla davran.', 35, NOW()),
    (v_list_id, 'doubt', 'şüphe, kuşku', 'I have no doubt that you will pass the exam.', 'Sınavı geçeceğinden hiç şüphem yok.', 36, NOW()),
    (v_list_id, 'eager', 'istekli, hevesli', 'New students are eager to make friends on the first day.', 'Yeni öğrenciler ilk gün arkadaş edinmeye heveslidir.', 37, NOW()),
    (v_list_id, 'earn', 'kazanmak, hak etmek', 'Hard work helps you earn the respect of your teachers.', 'Çok çalışmak öğretmenlerinin saygısını kazanmana yardım eder.', 38, NOW()),
    (v_list_id, 'effort', 'çaba, emek', 'Putting effort into vocabulary practice always pays off later.', 'Kelime pratiğine emek vermek sonradan her zaman karşılığını verir.', 39, NOW()),
    (v_list_id, 'emerge', 'ortaya çıkmak', 'New study trends emerge every year among high school students.', 'Her yıl lise öğrencileri arasında yeni çalışma trendleri ortaya çıkıyor.', 40, NOW()),
    (v_list_id, 'employ', 'kullanmak, istihdam etmek', 'You can employ different techniques to memorize difficult words.', 'Zor kelimeleri ezberlemek için farklı teknikler kullanabilirsin.', 41, NOW()),
    (v_list_id, 'enable', 'olanak vermek, etkinleştirmek', 'Mobile apps enable students to study English anytime and anywhere.', 'Mobil uygulamalar öğrencilerin her zaman ve her yerde İngilizce çalışmasına olanak verir.', 42, NOW()),
    (v_list_id, 'encounter', 'karşılaşmak, rastlamak', 'You may encounter unknown words while reading academic texts.', 'Akademik metinleri okurken bilinmeyen kelimelerle karşılaşabilirsin.', 43, NOW()),
    (v_list_id, 'engage', 'meşgul olmak, katılmak', 'The teacher tries to engage every student in the discussion.', 'Öğretmen her öğrenciyi tartışmaya katmaya çalışıyor.', 44, NOW()),
    (v_list_id, 'enjoy', 'keyif almak, hoşlanmak', 'I really enjoy reading short stories in English before sleeping.', 'Uyumadan önce İngilizce kısa hikâyeler okumaktan gerçekten keyif alıyorum.', 45, NOW());
END $$;

-- ============================================================
-- LIST 4: YKS-DİL · Sınav Pratiği 2 — 45 kelime — Orta (B1-B2)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YKS-DİL · Sınav Pratiği 2', 'B1-B2 seviye sınav kelimeleri (devamı) — 45 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'enormous', 'çok büyük, devasa', 'There is an enormous difference between knowing and applying knowledge.', 'Bilmekle bilgiyi uygulamak arasında çok büyük bir fark vardır.', 1, NOW()),
    (v_list_id, 'ensure', 'sağlamak, garantilemek', 'Good preparation will ensure a calm exam day.', 'İyi hazırlık sakin bir sınav gününü garantileyecektir.', 2, NOW()),
    (v_list_id, 'environment', 'çevre, ortam', 'A quiet environment helps you study more efficiently every day.', 'Sessiz bir ortam her gün daha verimli çalışmana yardımcı olur.', 3, NOW()),
    (v_list_id, 'equal', 'eşit, eşitlik', 'All students deserve equal chances to succeed in school.', 'Tüm öğrenciler okulda başarılı olmak için eşit şansı hak eder.', 4, NOW()),
    (v_list_id, 'escape', 'kaçmak, kurtulmak', 'Reading novels is a great way to escape from daily stress.', 'Roman okumak günlük stresten kaçmak için harika bir yoldur.', 5, NOW()),
    (v_list_id, 'essential', 'önemli, gerekli', 'Practice is essential if you want to improve your speaking skills.', 'Konuşma becerini geliştirmek istiyorsan pratik gereklidir.', 6, NOW()),
    (v_list_id, 'establish', 'kurmak, oluşturmak', 'Try to establish a regular study schedule from the start.', 'Baştan itibaren düzenli bir çalışma programı kurmaya çalış.', 7, NOW()),
    (v_list_id, 'estimate', 'tahmin etmek', 'I estimate that I need about three months to finish this book.', 'Bu kitabı bitirmek için yaklaşık üç aya ihtiyacım olduğunu tahmin ediyorum.', 8, NOW()),
    (v_list_id, 'evidence', 'kanıt, delil', 'Her improved grades are clear evidence of her hard work.', 'Yükselen notları onun çok çalıştığının açık kanıtı.', 9, NOW()),
    (v_list_id, 'examine', 'incelemek, sınamak', 'The teacher will examine our essays carefully this weekend.', 'Öğretmen bu hafta sonu yazılarımızı dikkatlice inceleyecek.', 10, NOW()),
    (v_list_id, 'expand', 'genişletmek, büyütmek', 'Reading widely will expand your vocabulary in a natural way.', 'Çok okumak kelime hazineni doğal bir şekilde genişletecektir.', 11, NOW()),
    (v_list_id, 'experience', 'deneyim, yaşamak', 'Taking a mock exam is a valuable learning experience.', 'Deneme sınavı yapmak değerli bir öğrenme deneyimidir.', 12, NOW()),
    (v_list_id, 'expert', 'uzman, ehil', 'Our coach is an expert in YKS-DİL strategies.', 'Hocamız YKS-DİL stratejilerinde bir uzmandır.', 13, NOW()),
    (v_list_id, 'explain', 'açıklamak', 'Can you explain this question to me in a simpler way?', 'Bu soruyu bana daha basit bir şekilde açıklayabilir misin?', 14, NOW()),
    (v_list_id, 'explore', 'keşfetmek, araştırmak', 'I want to explore different methods of learning new languages.', 'Yeni dil öğrenmenin farklı yöntemlerini keşfetmek istiyorum.', 15, NOW()),
    (v_list_id, 'express', 'ifade etmek, dile getirmek', 'It is hard to express complex ideas in a foreign language.', 'Yabancı bir dilde karmaşık fikirleri ifade etmek zordur.', 16, NOW()),
    (v_list_id, 'fail', 'başaramamak, başarısız olmak', 'Many students fail the test because they manage time poorly.', 'Birçok öğrenci zamanı kötü yönettiği için sınavda başarısız olur.', 17, NOW()),
    (v_list_id, 'famous', 'ünlü, meşhur', 'Many famous authors write about high school life in their books.', 'Birçok ünlü yazar kitaplarında lise hayatı hakkında yazar.', 18, NOW()),
    (v_list_id, 'fault', 'hata, kusur', 'It was not your fault that the exam was so difficult.', 'Sınavın bu kadar zor olması senin hatan değildi.', 19, NOW()),
    (v_list_id, 'favor', 'iyilik, kayırmak', 'Could you do me a favor and check my English essay?', 'Bana bir iyilik yapıp İngilizce yazımı kontrol eder misin?', 20, NOW()),
    (v_list_id, 'feature', 'özellik, içermek', 'Each chapter features a useful list of new exam words.', 'Her bölüm faydalı bir yeni sınav kelimeleri listesi içerir.', 21, NOW()),
    (v_list_id, 'figure', 'rakam, şekil, çözmek', 'Try to figure out the meaning from the rest of the sentence.', 'Anlamı cümlenin geri kalanından çözmeye çalış.', 22, NOW()),
    (v_list_id, 'focus', 'odaklanmak, odak', 'My main focus this semester is on reading comprehension.', 'Bu dönem ana odağım okuduğunu anlama becerisi.', 23, NOW()),
    (v_list_id, 'force', 'zorlamak, güç', 'Do not force yourself to study when you are extremely tired.', 'Çok yorgunken çalışmaya kendini zorlama.', 24, NOW()),
    (v_list_id, 'forget', 'unutmak', 'Do not forget to review your notes before going to sleep.', 'Yatmadan önce notlarını gözden geçirmeyi unutma.', 25, NOW()),
    (v_list_id, 'gain', 'kazanmak, elde etmek', 'You will gain confidence after solving many practice tests.', 'Birçok deneme sınavı çözdükten sonra öz güven kazanacaksın.', 26, NOW()),
    (v_list_id, 'gather', 'toplanmak, toplamak', 'Students gather in the library to study before final exams.', 'Öğrenciler dönem sonu sınavlarından önce kütüphanede toplanır.', 27, NOW()),
    (v_list_id, 'goal', 'hedef, amaç', 'Set a clear goal and follow a simple, realistic plan.', 'Net bir hedef belirle ve basit, gerçekçi bir plan izle.', 28, NOW()),
    (v_list_id, 'grateful', 'minnettar, müteşekkir', 'I am very grateful to my teachers for their patience.', 'Öğretmenlerime sabırları için çok minnettarım.', 29, NOW()),
    (v_list_id, 'guess', 'tahmin etmek', 'Sometimes you have to guess the meaning of a new word.', 'Bazen yeni bir kelimenin anlamını tahmin etmek zorundasın.', 30, NOW()),
    (v_list_id, 'habit', 'alışkanlık', 'Reading every night has become a great habit for me.', 'Her gece okumak benim için harika bir alışkanlık oldu.', 31, NOW()),
    (v_list_id, 'handle', 'üstesinden gelmek, idare etmek', 'Learning to handle exam pressure is part of growing up.', 'Sınav baskısının üstesinden gelmeyi öğrenmek büyümenin bir parçası.', 32, NOW()),
    (v_list_id, 'harm', 'zarar, zarar vermek', 'Skipping breakfast may harm your performance in long exams.', 'Kahvaltıyı atlamak uzun sınavlardaki performansına zarar verebilir.', 33, NOW()),
    (v_list_id, 'honest', 'dürüst, samimi', 'Be honest with yourself about how much you really study.', 'Gerçekten ne kadar çalıştığın konusunda kendine karşı dürüst ol.', 34, NOW()),
    (v_list_id, 'huge', 'büyük, kocaman', 'Practice tests make a huge difference in your final score.', 'Deneme sınavları nihai puanında büyük bir fark yaratır.', 35, NOW()),
    (v_list_id, 'identify', 'tanımak, belirlemek', 'You should identify your weak topics and work on them first.', 'Zayıf konularını belirlemeli ve önce onlara çalışmalısın.', 36, NOW()),
    (v_list_id, 'ignore', 'görmezden gelmek, yok saymak', 'Do not ignore small mistakes; they often become big ones.', 'Küçük hataları görmezden gelme; çoğu zaman büyük hatalara dönüşür.', 37, NOW()),
    (v_list_id, 'imagine', 'hayal etmek, düşünmek', 'Imagine yourself entering your dream university next September.', 'Önümüzdeki eylülde hayalindeki üniversiteye girdiğini hayal et.', 38, NOW()),
    (v_list_id, 'improve', 'geliştirmek, iyileştirmek', 'Listening to English podcasts will improve your understanding fast.', 'İngilizce podcast dinlemek anlamanı hızla geliştirecek.', 39, NOW()),
    (v_list_id, 'include', 'dahil etmek, içermek', 'The exam will include reading, grammar, and vocabulary sections.', 'Sınav okuma, gramer ve kelime bölümlerini içerecek.', 40, NOW()),
    (v_list_id, 'increase', 'artmak, artırmak', 'Daily practice will increase your speed in the reading section.', 'Günlük pratik okuma bölümündeki hızını artıracaktır.', 41, NOW()),
    (v_list_id, 'influence', 'etkilemek, etki', 'My older sister had a strong influence on my study habits.', 'Ablamın çalışma alışkanlıklarım üzerinde güçlü bir etkisi oldu.', 42, NOW()),
    (v_list_id, 'involve', 'içermek, dahil etmek', 'The project will involve teamwork and creative problem solving.', 'Proje takım çalışması ve yaratıcı problem çözmeyi içerecek.', 43, NOW()),
    (v_list_id, 'judge', 'yargılamak, hâkim', 'Do not judge your progress only by your test scores.', 'İlerlemeni sadece test puanlarınla yargılama.', 44, NOW()),
    (v_list_id, 'knowledge', 'bilgi, malumat', 'Knowledge of common roots helps you understand new words.', 'Yaygın kelime köklerini bilmek yeni kelimeleri anlamana yardım eder.', 45, NOW());
END $$;

-- ============================================================
-- LIST 5: YKS-DİL · İleri Seviye — 50 kelime — İleri (B2)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YKS-DİL · İleri Seviye', 'B2 seviye zorlu YKS-DİL kelimeleri — 50 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'abandon', 'terk etmek, vazgeçmek', 'You should never abandon your dreams because of one bad result.', 'Bir kötü sonuç yüzünden hayallerinden asla vazgeçmemelisin.', 1, NOW()),
    (v_list_id, 'acknowledge', 'kabul etmek, onaylamak', 'It is important to acknowledge your mistakes and learn from them.', 'Hatalarını kabul etmek ve onlardan öğrenmek önemlidir.', 2, NOW()),
    (v_list_id, 'adequate', 'yeterli, uygun', 'Make sure you get adequate sleep before the exam day.', 'Sınav gününden önce yeterli uyku aldığından emin ol.', 3, NOW()),
    (v_list_id, 'adopt', 'benimsemek, kabul etmek', 'Many students adopt new study methods to improve their scores.', 'Birçok öğrenci puanlarını artırmak için yeni çalışma yöntemleri benimser.', 4, NOW()),
    (v_list_id, 'advance', 'ilerlemek, gelişme', 'Constant practice helps students advance in all language skills.', 'Sürekli pratik öğrencilerin tüm dil becerilerinde ilerlemesine yardım eder.', 5, NOW()),
    (v_list_id, 'affect', 'etkilemek', 'Lack of sleep can seriously affect your concentration in class.', 'Uyku eksikliği derste konsantrasyonunu ciddi şekilde etkileyebilir.', 6, NOW()),
    (v_list_id, 'allocate', 'tahsis etmek, ayırmak', 'Allocate enough time to each section during the practice exam.', 'Deneme sınavı sırasında her bölüme yeterli zaman ayır.', 7, NOW()),
    (v_list_id, 'assume', 'varsaymak, üstlenmek', 'Do not assume that easy questions will not appear in the test.', 'Kolay soruların testte yer almayacağını varsayma.', 8, NOW()),
    (v_list_id, 'attain', 'ulaşmak, elde etmek', 'With patience, you can attain very high scores in YKS-DİL.', 'Sabırla, YKS-DİL''de çok yüksek puanlara ulaşabilirsin.', 9, NOW()),
    (v_list_id, 'comprehensive', 'kapsamlı, geniş', 'Our teacher gave us a comprehensive review for the final exam.', 'Öğretmenimiz bize final sınavı için kapsamlı bir tekrar verdi.', 10, NOW()),
    (v_list_id, 'conclude', 'sonuçlandırmak, sonuca varmak', 'The author concludes that practice matters more than natural talent.', 'Yazar, pratiğin doğal yetenekten daha önemli olduğu sonucuna varır.', 11, NOW()),
    (v_list_id, 'consequence', 'sonuç, netice', 'Every choice you make today has a consequence in the future.', 'Bugün yaptığın her seçimin gelecekte bir sonucu vardır.', 12, NOW()),
    (v_list_id, 'considerable', 'önemli, hatırı sayılır', 'She has made considerable progress in English this semester.', 'Bu dönem İngilizcede hatırı sayılır bir ilerleme kaydetti.', 13, NOW()),
    (v_list_id, 'controversial', 'tartışmalı, ihtilaflı', 'The debate club discussed a controversial topic about education.', 'Münazara kulübü eğitim hakkında tartışmalı bir konuyu görüştü.', 14, NOW()),
    (v_list_id, 'crucial', 'çok önemli, kritik', 'Time management is crucial during multiple choice exams.', 'Çoktan seçmeli sınavlarda zaman yönetimi çok önemlidir.', 15, NOW()),
    (v_list_id, 'demonstrate', 'göstermek, kanıtlamak', 'Her essay demonstrates a deep understanding of the topic.', 'Yazısı konuya derin bir hâkimiyet olduğunu gösteriyor.', 16, NOW()),
    (v_list_id, 'derive', 'türetmek, çıkarmak', 'Many English words derive from Latin and ancient Greek.', 'Birçok İngilizce kelime Latince ve antik Yunancadan türetilmiştir.', 17, NOW()),
    (v_list_id, 'distinct', 'belirgin, ayrı', 'There is a distinct difference between knowing and applying.', 'Bilmekle uygulamak arasında belirgin bir fark vardır.', 18, NOW()),
    (v_list_id, 'distinguish', 'ayırt etmek, fark etmek', 'Learn to distinguish between similar words like affect and effect.', 'Affect ve effect gibi benzer kelimeleri ayırt etmeyi öğren.', 19, NOW()),
    (v_list_id, 'efficient', 'verimli, etkin', 'The most efficient students review their notes regularly each week.', 'En verimli öğrenciler her hafta notlarını düzenli olarak tekrar eder.', 20, NOW()),
    (v_list_id, 'elaborate', 'ayrıntılı, ayrıntıya girmek', 'Can you elaborate on your idea about studying with flashcards?', 'Flashcard''larla çalışma fikrini biraz daha ayrıntılı açıklar mısın?', 21, NOW()),
    (v_list_id, 'eliminate', 'elemek, yok etmek', 'In multiple choice tests, eliminate the obviously wrong answers first.', 'Çoktan seçmeli testlerde önce açıkça yanlış olan cevapları ele.', 22, NOW()),
    (v_list_id, 'emphasize', 'vurgulamak, önemini belirtmek', 'Our teacher always emphasizes the importance of daily practice.', 'Öğretmenimiz her zaman günlük pratiğin önemini vurgular.', 23, NOW()),
    (v_list_id, 'enhance', 'geliştirmek, artırmak', 'Listening to native speakers will enhance your pronunciation skills.', 'Anadili konuşanları dinlemek telaffuz becerilerini geliştirecek.', 24, NOW()),
    (v_list_id, 'estimate', 'tahmin etmek, kestirmek', 'Experts estimate that consistent study beats last-minute cramming.', 'Uzmanlar, tutarlı çalışmanın son dakika ezberi yenmesini öngörüyor.', 25, NOW()),
    (v_list_id, 'evaluate', 'değerlendirmek', 'Teachers evaluate students based on both effort and results.', 'Öğretmenler öğrencileri hem çaba hem de sonuçlara göre değerlendirir.', 26, NOW()),
    (v_list_id, 'evident', 'açık, belli', 'It is evident that hard work pays off in the long run.', 'Uzun vadede çok çalışmanın karşılığını verdiği açıktır.', 27, NOW()),
    (v_list_id, 'expose', 'maruz bırakmak, açığa çıkarmak', 'Reading English novels exposes you to natural sentence structures.', 'İngilizce roman okumak seni doğal cümle yapılarına maruz bırakır.', 28, NOW()),
    (v_list_id, 'extensive', 'geniş kapsamlı, geniş', 'The exam covers an extensive range of grammar topics.', 'Sınav geniş kapsamlı bir gramer konuları yelpazesini kapsar.', 29, NOW()),
    (v_list_id, 'fundamental', 'temel, esas', 'Grammar is a fundamental part of mastering any new language.', 'Gramer, herhangi bir yeni dilde ustalaşmanın temel bir parçasıdır.', 30, NOW()),
    (v_list_id, 'genuine', 'gerçek, samimi', 'A genuine interest in English will speed up your progress.', 'İngilizceye gerçek bir ilgi ilerlemeni hızlandıracaktır.', 31, NOW()),
    (v_list_id, 'illustrate', 'örneklendirmek, göstermek', 'These examples illustrate how to use the present perfect tense.', 'Bu örnekler present perfect zamanın nasıl kullanılacağını gösteriyor.', 32, NOW()),
    (v_list_id, 'implement', 'uygulamak, yürürlüğe koymak', 'It is time to implement the study plan you made last week.', 'Geçen hafta yaptığın çalışma planını uygulama zamanı.', 33, NOW()),
    (v_list_id, 'implication', 'ima, sonuç', 'The implication of his words was that more effort is needed.', 'Sözlerinin iması daha fazla çabaya ihtiyaç olduğuydu.', 34, NOW()),
    (v_list_id, 'inevitable', 'kaçınılmaz', 'Some mistakes are inevitable when you are learning a new language.', 'Yeni bir dil öğrenirken bazı hatalar kaçınılmazdır.', 35, NOW()),
    (v_list_id, 'intense', 'yoğun, şiddetli', 'The last month before YKS-DİL requires intense preparation.', 'YKS-DİL''den önceki son ay yoğun bir hazırlık gerektirir.', 36, NOW()),
    (v_list_id, 'maintain', 'sürdürmek, korumak', 'Try to maintain a balanced routine of study, sleep, and rest.', 'Çalışma, uyku ve dinlenmenin dengeli bir rutinini sürdürmeye çalış.', 37, NOW()),
    (v_list_id, 'modify', 'değiştirmek, düzenlemek', 'You may need to modify your plan when school schedule changes.', 'Okul programı değiştiğinde planını değiştirmen gerekebilir.', 38, NOW()),
    (v_list_id, 'obtain', 'elde etmek, edinmek', 'You can obtain free YKS-DİL materials from the school library.', 'Okul kütüphanesinden ücretsiz YKS-DİL materyalleri edinebilirsin.', 39, NOW()),
    (v_list_id, 'overcome', 'üstesinden gelmek, yenmek', 'With practice, you can overcome any fear of speaking English.', 'Pratikle, İngilizce konuşma korkusunun üstesinden gelebilirsin.', 40, NOW()),
    (v_list_id, 'persistent', 'inatçı, ısrarcı', 'Persistent students always achieve more than naturally gifted ones.', 'Israrcı öğrenciler her zaman doğuştan yetenekli olanlardan daha fazla başarır.', 41, NOW()),
    (v_list_id, 'precise', 'kesin, tam', 'Give a precise answer instead of a long, unclear explanation.', 'Uzun, belirsiz bir açıklama yerine kesin bir cevap ver.', 42, NOW()),
    (v_list_id, 'previous', 'önceki, geçmiş', 'Review questions from previous years to understand the exam style.', 'Sınav stilini anlamak için önceki yılların sorularını gözden geçir.', 43, NOW()),
    (v_list_id, 'reliable', 'güvenilir', 'Your friends and teachers should be a reliable source of help.', 'Arkadaşların ve öğretmenlerin güvenilir bir yardım kaynağı olmalı.', 44, NOW()),
    (v_list_id, 'reluctant', 'isteksiz, gönülsüz', 'Many students are reluctant to speak English in front of others.', 'Birçok öğrenci başkalarının önünde İngilizce konuşmaya isteksizdir.', 45, NOW()),
    (v_list_id, 'significant', 'önemli, kayda değer', 'There is a significant link between sleep and exam performance.', 'Uyku ile sınav performansı arasında önemli bir bağ vardır.', 46, NOW()),
    (v_list_id, 'sufficient', 'yeterli', 'One hour of daily reading is sufficient for steady progress.', 'Günde bir saat okuma istikrarlı bir ilerleme için yeterlidir.', 47, NOW()),
    (v_list_id, 'tend', 'eğiliminde olmak', 'Successful students tend to plan their time very carefully.', 'Başarılı öğrenciler zamanlarını çok dikkatli planlama eğilimindedir.', 48, NOW()),
    (v_list_id, 'thorough', 'kapsamlı, eksiksiz', 'A thorough review of mistakes is more useful than new questions.', 'Hataların kapsamlı bir tekrarı yeni sorulardan daha faydalıdır.', 49, NOW()),
    (v_list_id, 'utilize', 'kullanmak, faydalanmak', 'Utilize every free hour for short and focused study sessions.', 'Her boş saati kısa ve odaklı çalışma seansları için kullan.', 50, NOW());
END $$;

-- END YKSDIL PACK
