DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YDS · Temel Akademik', 'YDS akademik temel kelime havuzu — 45 sık kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'abolish', 'kaldırmak, yürürlükten kaldırmak', 'Many countries have abolished capital punishment over the past few decades.', 'Birçok ülke, son birkaç on yılda idam cezasını kaldırmıştır.', 1, NOW()),
    (v_list_id, 'accommodate', 'yerleştirmek, uyum sağlamak', 'The new policy aims to accommodate the needs of disabled students at universities.', 'Yeni politika, üniversitelerde engelli öğrencilerin ihtiyaçlarına yanıt vermeyi amaçlıyor.', 2, NOW()),
    (v_list_id, 'accomplish', 'başarmak, tamamlamak', 'The research team accomplished its goals despite limited funding and resources.', 'Araştırma ekibi, kısıtlı fon ve kaynaklara rağmen hedeflerine ulaştı.', 3, NOW()),
    (v_list_id, 'accordingly', 'buna göre, dolayısıyla', 'Market conditions have shifted, and investors should adjust their strategies accordingly.', 'Piyasa koşulları değişti ve yatırımcılar stratejilerini buna göre uyarlamalıdır.', 4, NOW()),
    (v_list_id, 'acknowledge', 'kabul etmek, itiraf etmek', 'The author acknowledges the limitations of the study in the concluding chapter.', 'Yazar, çalışmanın sınırlamalarını sonuç bölümünde kabul etmektedir.', 5, NOW()),
    (v_list_id, 'adapt', 'uyarlamak, uyum sağlamak', 'Organisms that fail to adapt to environmental changes risk extinction.', 'Çevresel değişimlere uyum sağlayamayan canlılar yok olma riskiyle karşılaşır.', 6, NOW()),
    (v_list_id, 'address', 'ele almak, hitap etmek', 'The government must urgently address the rising levels of youth unemployment.', 'Hükümet, artan genç işsizliği sorununu acilen ele almalıdır.', 7, NOW()),
    (v_list_id, 'adjust', 'ayarlamak, uyarlamak', 'Central banks adjust interest rates in response to inflation expectations.', 'Merkez bankaları, enflasyon beklentilerine göre faiz oranlarını ayarlar.', 8, NOW()),
    (v_list_id, 'allege', 'iddia etmek, ileri sürmek', 'Several journalists alleged that the company had violated environmental regulations.', 'Bazı gazeteciler, şirketin çevre düzenlemelerini ihlal ettiğini iddia etti.', 9, NOW()),
    (v_list_id, 'allocate', 'tahsis etmek, ayırmak', 'The ministry will allocate additional funds to underprivileged regions next year.', 'Bakanlık, gelecek yıl dezavantajlı bölgelere ek fon ayıracaktır.', 10, NOW()),
    (v_list_id, 'alter', 'değiştirmek, başkalaştırmak', 'Climate change is altering ecosystems at an unprecedented rate.', 'İklim değişikliği, ekosistemleri benzeri görülmemiş bir hızda değiştirmektedir.', 11, NOW()),
    (v_list_id, 'analyze', 'analiz etmek, çözümlemek', 'Researchers analyzed thousands of survey responses to identify behavioral patterns.', 'Araştırmacılar, davranış kalıplarını belirlemek için binlerce anketi analiz etti.', 12, NOW()),
    (v_list_id, 'approximate', 'yaklaşık; tahmin etmek', 'The approximate cost of the project exceeded initial budget estimates considerably.', 'Projenin yaklaşık maliyeti, başlangıç bütçe tahminlerini önemli ölçüde aştı.', 13, NOW()),
    (v_list_id, 'arbitrary', 'keyfi, gelişigüzel', 'Arbitrary decisions by management often undermine employee morale and productivity.', 'Yönetimin keyfi kararları, çalışan moralini ve verimliliği sık sık zayıflatır.', 14, NOW()),
    (v_list_id, 'arouse', 'uyandırmak, harekete geçirmek', 'The novel arouses strong emotions about the moral dilemmas of modern society.', 'Roman, modern toplumun ahlaki ikilemlerine ilişkin güçlü duygular uyandırır.', 15, NOW()),
    (v_list_id, 'assert', 'iddia etmek, savunmak', 'The scholar asserts that economic inequality is the root of social unrest.', 'Akademisyen, ekonomik eşitsizliğin toplumsal huzursuzluğun kökeni olduğunu savunur.', 16, NOW()),
    (v_list_id, 'assign', 'atamak, görevlendirmek', 'Each researcher was assigned a specific topic within the broader project framework.', 'Her araştırmacıya geniş proje çerçevesi içinde belirli bir konu atandı.', 17, NOW()),
    (v_list_id, 'assist', 'yardım etmek', 'The new software is designed to assist scientists in processing complex data sets.', 'Yeni yazılım, bilim insanlarına karmaşık veri setlerini işlemede yardımcı olmak için tasarlandı.', 18, NOW()),
    (v_list_id, 'awareness', 'farkındalık, bilinç', 'Public awareness of environmental issues has grown rapidly in the past decade.', 'Çevre sorunlarına ilişkin kamu farkındalığı son on yılda hızla arttı.', 19, NOW()),
    (v_list_id, 'breakthrough', 'çığır açıcı gelişme', 'Recent breakthroughs in gene therapy may transform the treatment of rare diseases.', 'Gen terapisindeki son çığır açıcı gelişmeler, nadir hastalıkların tedavisini dönüştürebilir.', 20, NOW()),
    (v_list_id, 'capability', 'yetenek, kapasite', 'The country has expanded its scientific capability through international cooperation.', 'Ülke, uluslararası iş birliği yoluyla bilimsel kapasitesini genişletmiştir.', 21, NOW()),
    (v_list_id, 'cease', 'son vermek, durdurmak', 'The factory ceased operations after failing to meet emission standards.', 'Fabrika, emisyon standartlarını karşılayamadığı için faaliyetlerini durdurdu.', 22, NOW()),
    (v_list_id, 'circumstance', 'durum, koşul', 'Under no circumstances should personal data be shared without explicit consent.', 'Hiçbir koşulda kişisel veriler açık rıza alınmadan paylaşılmamalıdır.', 23, NOW()),
    (v_list_id, 'cite', 'alıntı yapmak, atıfta bulunmak', 'The article cites several recent studies to support its main argument.', 'Makale, ana savını desteklemek için yakın tarihli birçok çalışmaya atıfta bulunur.', 24, NOW()),
    (v_list_id, 'claim', 'iddia etmek; talep', 'The author claims that globalization has reshaped national identities significantly.', 'Yazar, küreselleşmenin ulusal kimlikleri önemli ölçüde yeniden şekillendirdiğini iddia eder.', 25, NOW()),
    (v_list_id, 'coincide', 'çakışmak, aynı zamana denk gelmek', 'The economic crisis coincided with a sharp decline in consumer confidence.', 'Ekonomik kriz, tüketici güveninin keskin düşüşüyle aynı döneme denk geldi.', 26, NOW()),
    (v_list_id, 'compel', 'zorlamak, mecbur bırakmak', 'New regulations compel companies to disclose their environmental impact annually.', 'Yeni düzenlemeler, şirketleri çevresel etkilerini her yıl açıklamaya zorlamaktadır.', 27, NOW()),
    (v_list_id, 'compensate', 'telafi etmek, tazmin etmek', 'The court ordered the firm to compensate workers for unpaid overtime hours.', 'Mahkeme, ödenmeyen fazla mesai saatleri için firmaya işçileri tazmin emri verdi.', 28, NOW()),
    (v_list_id, 'compile', 'derlemek, toplamak', 'Researchers compiled data from twenty countries to identify global education trends.', 'Araştırmacılar, küresel eğitim eğilimlerini belirlemek için yirmi ülkeden veri derledi.', 29, NOW()),
    (v_list_id, 'comply', 'uymak, riayet etmek', 'All firms must comply with the new data protection law by the end of the year.', 'Tüm firmalar, yıl sonuna kadar yeni veri koruma yasasına uymak zorundadır.', 30, NOW()),
    (v_list_id, 'concede', 'kabul etmek, taviz vermek', 'The minister conceded that the original timeline had been overly ambitious.', 'Bakan, başlangıçtaki takvimin aşırı iddialı olduğunu kabul etti.', 31, NOW()),
    (v_list_id, 'conclude', 'sonuçlandırmak, sonuç çıkarmak', 'The author concludes that further empirical research is needed in this area.', 'Yazar, bu alanda daha fazla görgül araştırmaya ihtiyaç olduğunu sonuç olarak belirtir.', 32, NOW()),
    (v_list_id, 'confine', 'sınırlamak, kısıtlamak', 'The study is confined to urban areas of three major industrial cities.', 'Çalışma, üç büyük sanayi kentinin yalnızca kentsel alanlarıyla sınırlıdır.', 33, NOW()),
    (v_list_id, 'consequence', 'sonuç, netice', 'Failing to address inequality may have serious consequences for social stability.', 'Eşitsizliği ele almamak, toplumsal istikrar için ciddi sonuçlar doğurabilir.', 34, NOW()),
    (v_list_id, 'considerable', 'önemli ölçüde, büyük', 'A considerable number of students struggle with academic writing in their first year.', 'Önemli sayıda öğrenci, ilk yılında akademik yazımla zorluk yaşar.', 35, NOW()),
    (v_list_id, 'consistent', 'tutarlı, sürekli', 'The findings are consistent with previous research on bilingual education.', 'Bulgular, iki dilli eğitim üzerine önceki araştırmalarla tutarlıdır.', 36, NOW()),
    (v_list_id, 'constitute', 'oluşturmak, teşkil etmek', 'Women constitute nearly half of the workforce in most developed economies.', 'Kadınlar, çoğu gelişmiş ekonomide iş gücünün neredeyse yarısını oluşturur.', 37, NOW()),
    (v_list_id, 'constrain', 'kısıtlamak, sınırlamak', 'Limited resources constrain the government''s ability to expand public services.', 'Sınırlı kaynaklar, hükümetin kamu hizmetlerini genişletme kabiliyetini kısıtlar.', 38, NOW()),
    (v_list_id, 'consume', 'tüketmek', 'Households in developed countries consume vastly more energy than those elsewhere.', 'Gelişmiş ülkelerdeki haneler, diğer yerlerdekilere göre çok daha fazla enerji tüketir.', 39, NOW()),
    (v_list_id, 'convey', 'iletmek, aktarmak', 'The painting conveys a sense of solitude that reflects the artist''s personal life.', 'Tablo, sanatçının kişisel yaşamını yansıtan bir yalnızlık duygusunu aktarır.', 40, NOW()),
    (v_list_id, 'correspond', 'karşılık gelmek; yazışmak', 'The figures in the report do not correspond to those provided by the ministry.', 'Rapordaki rakamlar, bakanlığın sağladıklarıyla örtüşmemektedir.', 41, NOW()),
    (v_list_id, 'cultivate', 'yetiştirmek, geliştirmek', 'Universities should cultivate critical thinking rather than mere memorization.', 'Üniversiteler, salt ezber yerine eleştirel düşünmeyi geliştirmelidir.', 42, NOW()),
    (v_list_id, 'deceive', 'aldatmak, kandırmak', 'Advertisers sometimes use misleading images that deceive consumers about product quality.', 'Reklamcılar bazen ürün kalitesi hakkında tüketicileri yanıltan görseller kullanır.', 43, NOW()),
    (v_list_id, 'decline', 'azalmak; gerilemek; reddetmek', 'Birth rates have declined steadily in industrialized nations over recent decades.', 'Sanayileşmiş ülkelerde doğum oranları son on yıllarda istikrarlı biçimde azaldı.', 44, NOW()),
    (v_list_id, 'dedicate', 'adamak, ithaf etmek', 'She dedicated her entire career to studying the linguistic roots of ancient civilizations.', 'Tüm kariyerini eski medeniyetlerin dilsel köklerini incelemeye adadı.', 45, NOW());
END $$;
