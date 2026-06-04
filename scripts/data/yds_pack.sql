-- BEGIN YDS PACK

DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YDS · Tanışma', 'YDS sınavına hızlı başlangıç — en sık çıkan 25 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'abundant', 'bol, çok miktarda', 'The region has abundant natural resources that contribute to its economic growth.', 'Bölge, ekonomik büyümesine katkı sağlayan bol doğal kaynaklara sahiptir.', 1, NOW()),
    (v_list_id, 'accelerate', 'hızlandırmak, ivme kazandırmak', 'Recent technological advances have accelerated the pace of scientific discovery.', 'Son teknolojik gelişmeler, bilimsel keşfin hızını artırmıştır.', 2, NOW()),
    (v_list_id, 'accurate', 'doğru, kesin, isabetli', 'Researchers must rely on accurate data to draw meaningful conclusions.', 'Araştırmacılar, anlamlı sonuçlar çıkarmak için doğru verilere güvenmelidir.', 3, NOW()),
    (v_list_id, 'achieve', 'başarmak, elde etmek', 'Few students achieve high scores without consistent and disciplined study habits.', 'Çok az öğrenci, düzenli ve disiplinli çalışmadan yüksek puan elde eder.', 4, NOW()),
    (v_list_id, 'acquire', 'edinmek, kazanmak, elde etmek', 'Children acquire language skills more rapidly than adults in immersive environments.', 'Çocuklar, yoğun ortamlarda dil becerilerini yetişkinlerden daha hızlı edinir.', 5, NOW()),
    (v_list_id, 'adequate', 'yeterli, uygun', 'Adequate funding is essential for the success of long-term research projects.', 'Uzun vadeli araştırma projelerinin başarısı için yeterli fon esastır.', 6, NOW()),
    (v_list_id, 'advocate', 'savunmak; savunucu', 'Many economists advocate stricter regulation of international financial markets.', 'Birçok ekonomist, uluslararası finans piyasalarının daha sıkı düzenlenmesini savunur.', 7, NOW()),
    (v_list_id, 'ambiguous', 'belirsiz, muğlak', 'The wording of the contract was ambiguous and led to a legal dispute.', 'Sözleşmenin ifadesi muğlaktı ve hukuki bir anlaşmazlığa yol açtı.', 8, NOW()),
    (v_list_id, 'anticipate', 'öngörmek, beklemek', 'Analysts anticipate further fluctuations in global energy prices this year.', 'Analistler, bu yıl küresel enerji fiyatlarında daha fazla dalgalanma öngörüyor.', 9, NOW()),
    (v_list_id, 'apparent', 'belli, açıkça görülen', 'It soon became apparent that the proposed policy would not solve the issue.', 'Önerilen politikanın sorunu çözmeyeceği kısa sürede açıkça ortaya çıktı.', 10, NOW()),
    (v_list_id, 'assess', 'değerlendirmek, ölçmek', 'The committee will assess the long-term impact of the new educational reform.', 'Komite, yeni eğitim reformunun uzun vadeli etkisini değerlendirecektir.', 11, NOW()),
    (v_list_id, 'assume', 'varsaymak, üstlenmek', 'Many people assume that economic growth automatically leads to social welfare.', 'Birçok insan, ekonomik büyümenin kendiliğinden sosyal refaha yol açtığını varsayar.', 12, NOW()),
    (v_list_id, 'attain', 'ulaşmak, erişmek, elde etmek', 'Only a small percentage of researchers attain international recognition in their field.', 'Araştırmacıların yalnızca küçük bir kısmı alanında uluslararası tanınırlığa ulaşır.', 13, NOW()),
    (v_list_id, 'attempt', 'denemek, girişimde bulunmak', 'Several governments have attempted to reduce carbon emissions through new taxes.', 'Çeşitli hükümetler, yeni vergilerle karbon emisyonlarını azaltmaya çalışmıştır.', 14, NOW()),
    (v_list_id, 'attribute', 'atfetmek; özellik', 'Historians attribute the empire''s decline to a combination of internal factors.', 'Tarihçiler, imparatorluğun çöküşünü iç etkenlerin bir bileşimine bağlar.', 15, NOW()),
    (v_list_id, 'beneficial', 'yararlı, faydalı', 'Regular exercise has been shown to be beneficial for cognitive performance.', 'Düzenli egzersizin bilişsel performans için faydalı olduğu gösterilmiştir.', 16, NOW()),
    (v_list_id, 'comprehensive', 'kapsamlı, geniş', 'The report offers a comprehensive analysis of current labor market trends.', 'Rapor, mevcut işgücü piyasası eğilimlerinin kapsamlı bir analizini sunmaktadır.', 17, NOW()),
    (v_list_id, 'conduct', 'yürütmek, gerçekleştirmek', 'The institute will conduct a large-scale survey on public attitudes toward technology.', 'Enstitü, teknolojiye yönelik kamu tutumları üzerine geniş çaplı bir anket yürütecek.', 18, NOW()),
    (v_list_id, 'contemporary', 'çağdaş, günümüz', 'Contemporary philosophers often revisit questions raised by classical thinkers.', 'Çağdaş filozoflar, klasik düşünürlerin gündeme getirdiği soruları sıkça yeniden ele alır.', 19, NOW()),
    (v_list_id, 'contradict', 'çelişmek, aksini söylemek', 'The witness''s statement clearly contradicted the evidence presented in court.', 'Tanığın ifadesi, mahkemede sunulan delillerle açıkça çelişiyordu.', 20, NOW()),
    (v_list_id, 'contribute', 'katkıda bulunmak', 'Industrial emissions significantly contribute to the deterioration of air quality.', 'Sanayi emisyonları, hava kalitesinin bozulmasına önemli ölçüde katkıda bulunur.', 21, NOW()),
    (v_list_id, 'controversial', 'tartışmalı', 'The minister''s proposal has proven controversial among economists and the public.', 'Bakanın önerisi, ekonomistler ve halk arasında tartışmalı olduğunu kanıtlamıştır.', 22, NOW()),
    (v_list_id, 'crucial', 'çok önemli, kritik', 'Public trust is crucial for the effective implementation of health policies.', 'Sağlık politikalarının etkin uygulanması için kamu güveni çok önemlidir.', 23, NOW()),
    (v_list_id, 'demonstrate', 'göstermek, kanıtlamak', 'The experiment demonstrated a clear link between sleep deprivation and memory loss.', 'Deney, uyku yoksunluğu ile bellek kaybı arasında açık bir bağ olduğunu gösterdi.', 24, NOW()),
    (v_list_id, 'derive', 'türetmek, elde etmek; kaynaklanmak', 'Many English words derive from Latin and Greek roots used in academic discourse.', 'Birçok İngilizce sözcük, akademik söylemde kullanılan Latince ve Yunanca köklerden türer.', 25, NOW());
END $$;

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

DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YDS · Genişletilmiş', 'YDS orta-ileri akademik kelime havuzu — 45 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'deduce', 'çıkarsama yapmak, sonuç çıkarmak', 'From the available evidence, scientists deduced that the artifact dated back centuries.', 'Mevcut kanıtlardan bilim insanları, eserin yüzyıllar öncesine ait olduğunu çıkardı.', 1, NOW()),
    (v_list_id, 'defy', 'meydan okumak, karşı koymak', 'The findings defy conventional wisdom about how children acquire abstract concepts.', 'Bulgular, çocukların soyut kavramları nasıl edindiğine dair yerleşik görüşe meydan okur.', 2, NOW()),
    (v_list_id, 'deliberate', 'kasıtlı; tartışmak', 'The committee deliberated for hours before reaching a unanimous decision on policy.', 'Komite, politika konusunda oybirliğine varmadan önce saatlerce müzakere etti.', 3, NOW()),
    (v_list_id, 'denote', 'belirtmek, göstermek', 'In scientific texts, this symbol denotes the average value of the variable.', 'Bilimsel metinlerde bu sembol, değişkenin ortalama değerini gösterir.', 4, NOW()),
    (v_list_id, 'depict', 'tasvir etmek, betimlemek', 'The novel depicts urban poverty in nineteenth-century European industrial cities.', 'Roman, on dokuzuncu yüzyıl Avrupa sanayi şehirlerindeki kent yoksulluğunu tasvir eder.', 5, NOW()),
    (v_list_id, 'deplete', 'tüketmek, azaltmak', 'Overfishing has rapidly depleted fish stocks in many parts of the world.', 'Aşırı avlanma, dünyanın birçok bölgesinde balık stoklarını hızla tüketmiştir.', 6, NOW()),
    (v_list_id, 'deprive', 'mahrum bırakmak', 'War deprived an entire generation of access to quality education and healthcare.', 'Savaş, bütün bir kuşağı nitelikli eğitim ve sağlık hizmetine erişimden mahrum bıraktı.', 7, NOW()),
    (v_list_id, 'designate', 'belirlemek, atamak', 'The area has been designated a protected zone for endangered bird species.', 'Bölge, nesli tükenmekte olan kuş türleri için koruma alanı olarak belirlenmiştir.', 8, NOW()),
    (v_list_id, 'detect', 'tespit etmek, saptamak', 'New sensors can detect microscopic pollutants in drinking water within seconds.', 'Yeni sensörler, içme suyundaki mikroskobik kirleticileri saniyeler içinde saptayabiliyor.', 9, NOW()),
    (v_list_id, 'deteriorate', 'kötüleşmek, bozulmak', 'Diplomatic relations between the two nations have deteriorated since last summer.', 'İki ulus arasındaki diplomatik ilişkiler, geçen yazdan beri kötüleşmiştir.', 10, NOW()),
    (v_list_id, 'devote', 'adamak, ayırmak', 'Many scholars have devoted their lives to understanding the origins of language.', 'Birçok akademisyen yaşamını, dilin kökenini anlamaya adamıştır.', 11, NOW()),
    (v_list_id, 'diminish', 'azaltmak, küçültmek', 'Repeated exposure to misinformation can diminish public trust in scientific authorities.', 'Yanlış bilgiye sürekli maruz kalmak, bilimsel otoritelere kamu güvenini azaltabilir.', 12, NOW()),
    (v_list_id, 'discard', 'atmak, elden çıkarmak', 'Outdated theories are gradually discarded as new empirical evidence accumulates.', 'Geçersizleşen teoriler, yeni görgül kanıtlar biriktikçe yavaş yavaş terk edilir.', 13, NOW()),
    (v_list_id, 'discern', 'fark etmek, ayırt etmek', 'It is difficult to discern subtle shifts in public opinion from a single survey.', 'Tek bir anketten kamuoyundaki ince kaymaları ayırt etmek zordur.', 14, NOW()),
    (v_list_id, 'disclose', 'açıklamak, ifşa etmek', 'The company refused to disclose details of its negotiations with foreign partners.', 'Şirket, yabancı ortaklarıyla yaptığı görüşmelerin ayrıntılarını açıklamayı reddetti.', 15, NOW()),
    (v_list_id, 'discourage', 'cesaretini kırmak, vazgeçirmek', 'High registration fees may discourage students from applying to graduate programs.', 'Yüksek kayıt ücretleri, öğrencileri lisansüstü programlara başvurmaktan caydırabilir.', 16, NOW()),
    (v_list_id, 'disregard', 'görmezden gelmek, dikkate almamak', 'The committee disregarded several warnings issued by independent safety inspectors.', 'Komite, bağımsız güvenlik müfettişlerinin yaptığı çeşitli uyarıları görmezden geldi.', 17, NOW()),
    (v_list_id, 'distinguish', 'ayırt etmek', 'Students must learn to distinguish reliable sources from unreliable ones online.', 'Öğrenciler, çevrimiçi güvenilir kaynakları güvenilmez olanlardan ayırt etmeyi öğrenmelidir.', 18, NOW()),
    (v_list_id, 'diverse', 'çeşitli, farklı', 'The university hosts students from highly diverse cultural and linguistic backgrounds.', 'Üniversite, son derece çeşitli kültürel ve dilsel geçmişlerden öğrenciler barındırır.', 19, NOW()),
    (v_list_id, 'dominant', 'baskın, hakim', 'English remains the dominant language of international academic publishing today.', 'İngilizce, günümüzde uluslararası akademik yayıncılığın baskın dili olmayı sürdürür.', 20, NOW()),
    (v_list_id, 'elaborate', 'ayrıntılı; ayrıntılarıyla anlatmak', 'The author elaborated on the social implications of artificial intelligence at length.', 'Yazar, yapay zekânın toplumsal sonuçlarını uzun uzadıya ayrıntılarıyla ele aldı.', 21, NOW()),
    (v_list_id, 'eliminate', 'ortadan kaldırmak, elemek', 'New treatments could eventually eliminate certain genetic diseases altogether.', 'Yeni tedaviler, nihayetinde bazı genetik hastalıkları tamamen ortadan kaldırabilir.', 22, NOW()),
    (v_list_id, 'embrace', 'benimsemek; kucaklamak', 'Many institutions have embraced digital transformation to remain competitive globally.', 'Birçok kurum, küresel ölçekte rekabetçi kalmak için dijital dönüşümü benimsemiştir.', 23, NOW()),
    (v_list_id, 'emerge', 'ortaya çıkmak, belirmek', 'New evidence has emerged suggesting that the species adapts faster than expected.', 'Türün beklenenden hızlı uyum sağladığına işaret eden yeni kanıtlar ortaya çıktı.', 24, NOW()),
    (v_list_id, 'emphasize', 'vurgulamak, önemini belirtmek', 'The author emphasizes the role of education in reducing long-term social inequality.', 'Yazar, eğitimin uzun vadeli toplumsal eşitsizliği azaltmadaki rolünü vurgular.', 25, NOW()),
    (v_list_id, 'enable', 'olanaklı kılmak, mümkün kılmak', 'New imaging techniques enable scientists to study brain activity in real time.', 'Yeni görüntüleme teknikleri, bilim insanlarının beyin aktivitesini gerçek zamanlı incelemesine olanak tanır.', 26, NOW()),
    (v_list_id, 'endure', 'katlanmak, dayanmak', 'Many migrants endure harsh conditions in pursuit of better economic opportunities.', 'Birçok göçmen, daha iyi ekonomik fırsatlar uğruna ağır koşullara katlanır.', 27, NOW()),
    (v_list_id, 'enforce', 'yürürlüğe koymak, uygulamak', 'Local authorities must enforce regulations consistently to maintain public trust.', 'Yerel yetkililer, kamu güvenini korumak için düzenlemeleri tutarlı biçimde uygulamalıdır.', 28, NOW()),
    (v_list_id, 'enhance', 'artırmak, geliştirmek, iyileştirmek', 'Collaboration between universities and industry can significantly enhance research outcomes.', 'Üniversite-sanayi iş birliği, araştırma sonuçlarını önemli ölçüde iyileştirebilir.', 29, NOW()),
    (v_list_id, 'entail', 'gerektirmek, içermek', 'The new role entails extensive travel and considerable administrative responsibility.', 'Yeni görev, kapsamlı seyahat ve önemli ölçüde idari sorumluluk gerektiriyor.', 30, NOW()),
    (v_list_id, 'envisage', 'tasavvur etmek, öngörmek', 'Economists envisage modest growth in the service sector over the next decade.', 'Ekonomistler, önümüzdeki on yılda hizmet sektöründe ılımlı bir büyüme öngörüyor.', 31, NOW()),
    (v_list_id, 'establish', 'kurmak; saptamak', 'Researchers have established a clear link between physical activity and mental health.', 'Araştırmacılar, fiziksel aktivite ile ruh sağlığı arasında net bir bağ kurmuştur.', 32, NOW()),
    (v_list_id, 'evaluate', 'değerlendirmek', 'The agency evaluates funding proposals based on innovation, feasibility, and impact.', 'Kurum, fon başvurularını yenilik, uygulanabilirlik ve etki açısından değerlendirir.', 33, NOW()),
    (v_list_id, 'exceed', 'aşmak, geçmek', 'The cost of the project has already exceeded the initial budget by twenty percent.', 'Proje maliyeti, başlangıç bütçesini şimdiden yüzde yirmi oranında aşmıştır.', 34, NOW()),
    (v_list_id, 'exclude', 'dışlamak, hariç tutmak', 'The survey excluded participants under the age of eighteen for ethical reasons.', 'Anket, etik nedenlerle on sekiz yaşın altındaki katılımcıları kapsam dışında bıraktı.', 35, NOW()),
    (v_list_id, 'exert', 'uygulamak, göstermek', 'Pressure groups exert considerable influence over policy debates in many democracies.', 'Baskı grupları, birçok demokraside politika tartışmaları üzerinde önemli bir etki uygular.', 36, NOW()),
    (v_list_id, 'exhibit', 'sergilemek, göstermek', 'Patients with the condition often exhibit symptoms that resemble common allergies.', 'Hastalığa sahip hastalar, sıklıkla yaygın alerjilere benzer belirtiler sergiler.', 37, NOW()),
    (v_list_id, 'expand', 'genişletmek, büyütmek', 'The company plans to expand its operations into three additional emerging markets.', 'Şirket, faaliyetlerini üç ek gelişmekte olan pazara genişletmeyi planlıyor.', 38, NOW()),
    (v_list_id, 'exploit', 'sömürmek; yararlanmak', 'Colonial powers exploited the natural resources of conquered territories for centuries.', 'Sömürgeci güçler, fethettikleri toprakların doğal kaynaklarını yüzyıllarca sömürdü.', 39, NOW()),
    (v_list_id, 'expose', 'maruz bırakmak; ifşa etmek', 'Children should not be exposed to advertising that targets unhealthy eating habits.', 'Çocuklar, sağlıksız beslenmeyi hedefleyen reklamlara maruz bırakılmamalıdır.', 40, NOW()),
    (v_list_id, 'extend', 'uzatmak, genişletmek', 'The deadline for submission has been extended by two additional weeks.', 'Başvuru için son tarih, ek olarak iki hafta daha uzatılmıştır.', 41, NOW()),
    (v_list_id, 'facilitate', 'kolaylaştırmak', 'International trade agreements facilitate the exchange of goods between nations.', 'Uluslararası ticaret anlaşmaları, ülkeler arasındaki mal alışverişini kolaylaştırır.', 42, NOW()),
    (v_list_id, 'fallacy', 'yanılgı, safsata', 'It is a common fallacy to assume that wealth automatically guarantees personal happiness.', 'Zenginliğin otomatik olarak kişisel mutluluğu garantilediğini varsaymak yaygın bir yanılgıdır.', 43, NOW()),
    (v_list_id, 'feasible', 'uygulanabilir, yapılabilir', 'Many experts question whether the proposed climate targets are economically feasible.', 'Birçok uzman, önerilen iklim hedeflerinin ekonomik olarak uygulanabilir olup olmadığını sorgulamaktadır.', 44, NOW()),
    (v_list_id, 'fluctuate', 'dalgalanmak, değişmek', 'Currency exchange rates fluctuate based on numerous economic and political factors.', 'Döviz kurları, çok sayıda ekonomik ve siyasi faktöre bağlı olarak dalgalanır.', 45, NOW());
END $$;

DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YDS · İleri Düzey', 'YDS C1 akademik kelime havuzu — 45 ileri kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'abstain', 'çekimser kalmak, kaçınmak', 'Several committee members abstained from voting on the controversial new proposal.', 'Birkaç komite üyesi, tartışmalı yeni öneri üzerindeki oylamada çekimser kaldı.', 1, NOW()),
    (v_list_id, 'adamant', 'kararlı, ısrarcı, taviz vermez', 'The minister remained adamant that the reforms would proceed despite public opposition.', 'Bakan, kamuoyu muhalefetine rağmen reformların süreceği konusunda kararlı kaldı.', 2, NOW()),
    (v_list_id, 'adhere', 'bağlı kalmak, uymak', 'Researchers must strictly adhere to ethical guidelines when conducting clinical trials.', 'Araştırmacılar, klinik araştırmalar yürütürken etik kurallara titizlikle uymak zorundadır.', 3, NOW()),
    (v_list_id, 'aggravate', 'kötüleştirmek, şiddetlendirmek', 'Austerity measures may aggravate existing tensions between social and political groups.', 'Kemer sıkma önlemleri, toplumsal ve siyasi gruplar arasındaki gerilimleri şiddetlendirebilir.', 4, NOW()),
    (v_list_id, 'allude', 'ima etmek, dolaylı değinmek', 'The author alludes to several classical philosophers without naming them explicitly.', 'Yazar, birkaç klasik filozofa açıkça ad vermeden ima yoluyla atıfta bulunur.', 5, NOW()),
    (v_list_id, 'ascribe', 'atfetmek, yüklemek', 'Some historians ascribe the empire''s collapse to a combination of climatic and economic shocks.', 'Bazı tarihçiler, imparatorluğun çöküşünü iklimsel ve ekonomik şokların bileşimine atfeder.', 6, NOW()),
    (v_list_id, 'augment', 'artırmak, çoğaltmak', 'The grant will augment existing funding for cancer research at the institute.', 'Hibe, enstitüdeki kanser araştırmasına yönelik mevcut fonu artıracaktır.', 7, NOW()),
    (v_list_id, 'avert', 'önlemek, savuşturmak', 'Quick action by negotiators averted a prolonged strike across the manufacturing sector.', 'Müzakerecilerin hızlı eylemi, imalat sektöründe uzun süreli bir grevi önledi.', 8, NOW()),
    (v_list_id, 'belittle', 'küçümsemek, hafife almak', 'Critics should never belittle the contributions of early researchers in the field.', 'Eleştirmenler, alandaki erken dönem araştırmacıların katkılarını asla küçümsememelidir.', 9, NOW()),
    (v_list_id, 'bolster', 'desteklemek, güçlendirmek', 'New data bolsters the argument that bilingual education enhances cognitive flexibility.', 'Yeni veriler, iki dilli eğitimin bilişsel esnekliği artırdığı savını güçlendiriyor.', 10, NOW()),
    (v_list_id, 'circumvent', 'atlatmak, etrafından dolanmak', 'Some firms attempt to circumvent environmental regulations through complex legal arrangements.', 'Bazı firmalar, karmaşık hukuki düzenlemelerle çevre mevzuatını dolanmaya çalışmaktadır.', 11, NOW()),
    (v_list_id, 'coerce', 'zorlamak, baskıyla yaptırmak', 'Witnesses claimed that they had been coerced into signing the original statement.', 'Tanıklar, ilk ifadeyi imzalamaya zorlandıklarını ileri sürdü.', 12, NOW()),
    (v_list_id, 'cogent', 'inandırıcı, ikna edici', 'The lawyer presented a cogent argument that few jurors could ignore.', 'Avukat, çok az jüri üyesinin görmezden gelebileceği inandırıcı bir sav sundu.', 13, NOW()),
    (v_list_id, 'concur', 'aynı fikirde olmak, mutabık kalmak', 'Most economists concur that monetary policy alone cannot resolve structural inequality.', 'Çoğu ekonomist, yalnızca para politikasının yapısal eşitsizliği çözemeyeceğinde mutabıktır.', 14, NOW()),
    (v_list_id, 'condone', 'göz yummak, hoş görmek', 'No civilized society should condone violence as a legitimate political tool.', 'Hiçbir uygar toplum, şiddeti meşru bir siyasi araç olarak hoş görmemelidir.', 15, NOW()),
    (v_list_id, 'conjecture', 'tahmin, varsayım', 'Without firmer evidence, his claims remain mere conjecture rather than scientific fact.', 'Daha güçlü kanıt olmadan iddiaları, bilimsel olgudan çok salt bir tahmin olarak kalır.', 16, NOW()),
    (v_list_id, 'consolidate', 'pekiştirmek, birleştirmek', 'The merger will consolidate the company''s position in the regional energy market.', 'Birleşme, şirketin bölgesel enerji pazarındaki konumunu pekiştirecektir.', 17, NOW()),
    (v_list_id, 'contend', 'iddia etmek, mücadele etmek', 'Several philosophers contend that moral values are largely shaped by cultural contexts.', 'Birkaç filozof, ahlaki değerlerin büyük ölçüde kültürel bağlamlarca şekillendiğini ileri sürer.', 18, NOW()),
    (v_list_id, 'corroborate', 'doğrulamak, desteklemek', 'Independent witnesses corroborated the main findings of the official investigation report.', 'Bağımsız tanıklar, resmi soruşturma raporunun temel bulgularını doğruladı.', 19, NOW()),
    (v_list_id, 'curtail', 'kısaltmak, kısıtlamak', 'The pandemic forced governments to curtail civil liberties in unprecedented ways.', 'Pandemi, hükümetleri benzeri görülmemiş biçimde sivil özgürlükleri kısıtlamaya zorladı.', 20, NOW()),
    (v_list_id, 'denounce', 'kınamak, açıkça eleştirmek', 'World leaders publicly denounced the attack as a grave violation of international law.', 'Dünya liderleri, saldırıyı uluslararası hukukun ağır bir ihlali olarak açıkça kınadı.', 21, NOW()),
    (v_list_id, 'deride', 'alay etmek, küçümsemek', 'Early critics derided the theory but later evidence has largely vindicated it.', 'Erken eleştirmenler teoriyle alay etti, ancak sonraki kanıtlar onu büyük ölçüde haklı çıkardı.', 22, NOW()),
    (v_list_id, 'discredit', 'gözden düşürmek, itibarsızlaştırmak', 'The opposition attempted to discredit the report by questioning its methodology.', 'Muhalefet, raporu yöntemini sorgulayarak itibarsızlaştırmaya çalıştı.', 23, NOW()),
    (v_list_id, 'disseminate', 'yaymak, dağıtmak', 'Social media has made it easier to disseminate research findings to broader audiences.', 'Sosyal medya, araştırma bulgularının daha geniş kitlelere yayılmasını kolaylaştırmıştır.', 24, NOW()),
    (v_list_id, 'divulge', 'açıklamak, ifşa etmek', 'The journalist refused to divulge the identity of her sources, citing professional ethics.', 'Gazeteci, mesleki etiği gerekçesiyle kaynaklarının kimliğini açıklamayı reddetti.', 25, NOW()),
    (v_list_id, 'emanate', 'yayılmak, çıkmak, kaynaklanmak', 'Strong public criticism began to emanate from communities affected by the new policy.', 'Yeni politikadan etkilenen toplulukların güçlü eleştirileri yayılmaya başladı.', 26, NOW()),
    (v_list_id, 'encompass', 'kapsamak, içine almak', 'The new curriculum encompasses social sciences, languages, and basic computational thinking.', 'Yeni müfredat; sosyal bilimleri, dilleri ve temel hesaplamalı düşünmeyi kapsar.', 27, NOW()),
    (v_list_id, 'endorse', 'desteklemek, onaylamak', 'Several leading scholars publicly endorsed the proposal for educational reform.', 'Önde gelen birçok akademisyen, eğitim reformu önerisini açıkça destekledi.', 28, NOW()),
    (v_list_id, 'entrench', 'kökleştirmek, sağlamlaştırmak', 'Discriminatory practices remain deeply entrenched in many institutional structures today.', 'Ayrımcı uygulamalar, birçok kurumsal yapıda hâlâ derinden kökleşmiş durumdadır.', 29, NOW()),
    (v_list_id, 'envision', 'tasavvur etmek, hayal etmek', 'The committee envisions a more equitable distribution of academic resources across regions.', 'Komite, akademik kaynakların bölgeler arasında daha adil bir dağılımını tasavvur etmektedir.', 30, NOW()),
    (v_list_id, 'extol', 'methetmek, övmek', 'Reviewers extolled the novel for its insightful portrayal of human suffering.', 'Eleştirmenler, romanı insan acısının derinlikli betimlemesi nedeniyle övdü.', 31, NOW()),
    (v_list_id, 'forge', 'oluşturmak, kurmak; sahte üretmek', 'The two universities have forged a lasting partnership in clinical research.', 'İki üniversite, klinik araştırmada kalıcı bir ortaklık kurmuştur.', 32, NOW()),
    (v_list_id, 'foster', 'beslemek, teşvik etmek', 'Inclusive policies can foster a sense of belonging among minority students.', 'Kapsayıcı politikalar, azınlık öğrencileri arasında aidiyet duygusunu besleyebilir.', 33, NOW()),
    (v_list_id, 'hinder', 'engellemek, ket vurmak', 'Bureaucratic obstacles continue to hinder progress in interdisciplinary research projects.', 'Bürokratik engeller, disiplinler arası araştırma projelerindeki ilerlemeyi engellemeye devam ediyor.', 34, NOW()),
    (v_list_id, 'impede', 'engellemek, sekteye uğratmak', 'Poor infrastructure may impede economic development in remote rural areas.', 'Yetersiz altyapı, uzak kırsal alanlarda ekonomik kalkınmayı sekteye uğratabilir.', 35, NOW()),
    (v_list_id, 'incite', 'kışkırtmak, tahrik etmek', 'The speech was widely condemned for inciting violence against ethnic minorities.', 'Konuşma, etnik azınlıklara karşı şiddeti kışkırttığı için geniş çapta kınandı.', 36, NOW()),
    (v_list_id, 'inculcate', 'aşılamak, zihne yerleştirmek', 'Schools should inculcate values of empathy and critical reasoning from an early age.', 'Okullar, erken yaşlardan itibaren empati ve eleştirel akıl yürütme değerlerini aşılamalıdır.', 37, NOW()),
    (v_list_id, 'indulge', 'kendini kaptırmak, izin vermek', 'Modern consumers often indulge in habits that prove harmful in the long run.', 'Modern tüketiciler, uzun vadede zararlı çıkan alışkanlıklara sıkça kapılır.', 38, NOW()),
    (v_list_id, 'inhibit', 'engellemek, ket vurmak', 'Excessive regulation may inhibit innovation in technology-driven industries.', 'Aşırı düzenleme, teknoloji odaklı sektörlerde inovasyonu engelleyebilir.', 39, NOW()),
    (v_list_id, 'instigate', 'kışkırtmak, başlatmak', 'The reform was instigated by years of public protest against systemic corruption.', 'Reform, sistemik yolsuzluğa karşı yıllarca süren kamu protestosuyla başlatıldı.', 40, NOW()),
    (v_list_id, 'jeopardize', 'tehlikeye atmak', 'Skipping safety procedures could seriously jeopardize the success of the entire project.', 'Güvenlik prosedürlerini atlamak, tüm projenin başarısını ciddi biçimde tehlikeye atabilir.', 41, NOW()),
    (v_list_id, 'meticulous', 'titiz, dikkatli', 'The historian is known for her meticulous analysis of nineteenth-century legal documents.', 'Tarihçi, on dokuzuncu yüzyıl hukuki belgelerine yönelik titiz çözümlemesiyle tanınır.', 42, NOW()),
    (v_list_id, 'overhaul', 'köklü değişiklik, elden geçirmek', 'The government plans to overhaul the public health system over the next decade.', 'Hükümet, kamu sağlığı sistemini önümüzdeki on yılda baştan elden geçirmeyi planlıyor.', 43, NOW()),
    (v_list_id, 'rationale', 'gerekçe, mantık', 'The committee provided a detailed rationale for the proposed legislative changes.', 'Komite, önerilen yasal değişiklikler için ayrıntılı bir gerekçe sundu.', 44, NOW()),
    (v_list_id, 'refute', 'çürütmek, reddetmek', 'The scholar attempted to refute the prevailing theories about cultural development.', 'Bilim insanı, kültürel gelişim hakkında yaygın olan teorileri çürütmeye çalıştı.', 45, NOW());
END $$;

DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YDS · Uzman', 'YDS uzman seviye C1+ kelime havuzu — en zor 40 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'alleviate', 'hafifletmek, azaltmak', 'New social programs aim to alleviate the burden of poverty on working-class families.', 'Yeni sosyal programlar, yoksulluğun işçi sınıfı aileleri üzerindeki yükünü hafifletmeyi amaçlar.', 1, NOW()),
    (v_list_id, 'articulate', 'açıkça ifade etmek; ifade gücü yüksek', 'The candidate articulated her policy vision with remarkable clarity and conviction.', 'Aday, politika vizyonunu dikkat çekici bir berraklık ve inançla açıkça ifade etti.', 2, NOW()),
    (v_list_id, 'austere', 'sade, sert, çileci', 'The philosopher led an austere life devoted entirely to scholarship and reflection.', 'Filozof, tamamen bilime ve düşünmeye adanmış sade bir yaşam sürdürdü.', 3, NOW()),
    (v_list_id, 'capricious', 'değişken, kaprisli', 'Capricious changes in policy can severely undermine investor confidence in any economy.', 'Politikadaki kaprisli değişiklikler, herhangi bir ekonomide yatırımcı güvenini ciddi biçimde sarsabilir.', 4, NOW()),
    (v_list_id, 'clandestine', 'gizli, el altından yürütülen', 'Investigators uncovered clandestine financial transactions linked to several offshore accounts.', 'Müfettişler, birkaç açık deniz hesabıyla bağlantılı gizli mali işlemleri ortaya çıkardı.', 5, NOW()),
    (v_list_id, 'contemplate', 'derin derin düşünmek, üzerinde düşünmek', 'Philosophers have long contemplated the relationship between free will and moral responsibility.', 'Filozoflar uzun süredir özgür irade ile ahlaki sorumluluk arasındaki ilişki üzerine düşünmüştür.', 6, NOW()),
    (v_list_id, 'cumbersome', 'hantal, kullanışsız', 'The current bureaucratic procedure is too cumbersome for small businesses to manage efficiently.', 'Mevcut bürokratik prosedür, küçük işletmelerin verimli yönetmesi için fazla hantaldır.', 7, NOW()),
    (v_list_id, 'deleterious', 'zararlı, kötü etkili', 'Long-term exposure to noise pollution has deleterious effects on cardiovascular health.', 'Gürültü kirliliğine uzun süreli maruz kalmanın kardiyovasküler sağlık üzerinde zararlı etkileri vardır.', 8, NOW()),
    (v_list_id, 'dichotomy', 'ikilik, ikiye bölünme', 'The dichotomy between theory and practice is often exaggerated in academic debates.', 'Kuram ile uygulama arasındaki ikilik, akademik tartışmalarda sıkça abartılır.', 9, NOW()),
    (v_list_id, 'dogmatic', 'dogmatik, körü körüne inanan', 'Dogmatic thinking tends to discourage open inquiry in scientific communities.', 'Dogmatik düşünme, bilim çevrelerinde açık sorgulamayı caydırma eğilimindedir.', 10, NOW()),
    (v_list_id, 'eloquent', 'belagatli, etkileyici konuşan', 'Her eloquent defense of human rights moved even the most skeptical members of the panel.', 'İnsan haklarına ilişkin etkili savunması, panelin en şüpheci üyelerini bile etkiledi.', 11, NOW()),
    (v_list_id, 'eradicate', 'kökünü kazımak, yok etmek', 'International cooperation is essential to eradicate diseases that still threaten poorer regions.', 'Hâlâ yoksul bölgeleri tehdit eden hastalıkları kökünden silmek için uluslararası iş birliği şarttır.', 12, NOW()),
    (v_list_id, 'esoteric', 'ezoterik, sadece uzmanlarca anlaşılır', 'The lecture proved too esoteric for an audience without a background in formal logic.', 'Ders, biçimsel mantık altyapısı olmayan bir izleyici için fazla ezoterik kaldı.', 13, NOW()),
    (v_list_id, 'exacerbate', 'kötüleştirmek, ağırlaştırmak', 'Cuts to public health spending could exacerbate inequalities already evident in society.', 'Kamu sağlık harcamalarındaki kesintiler, toplumda zaten görülen eşitsizlikleri daha da derinleştirebilir.', 14, NOW()),
    (v_list_id, 'fastidious', 'titiz, müşkülpesent', 'The editor was fastidious about every word, comma, and citation in the manuscript.', 'Editör, el yazmasındaki her sözcük, virgül ve atıf konusunda son derece titizdi.', 15, NOW()),
    (v_list_id, 'gregarious', 'sosyal, dışadönük', 'Gregarious individuals often find it easier to build extensive professional networks.', 'Sosyal bireyler, geniş mesleki ağlar kurmayı çoğu zaman daha kolay bulur.', 16, NOW()),
    (v_list_id, 'idiosyncratic', 'kendine özgü, ayırt edici', 'Each philosopher developed an idiosyncratic vocabulary that complicates comparison across schools.', 'Her filozof, ekoller arasında karşılaştırmayı zorlaştıran kendine özgü bir terminoloji geliştirmiştir.', 17, NOW()),
    (v_list_id, 'inadvertent', 'kasıtsız, istemeden', 'An inadvertent error in the data led to a misleading conclusion in the final report.', 'Verideki kasıtsız bir hata, nihai raporda yanıltıcı bir sonuca yol açtı.', 18, NOW()),
    (v_list_id, 'indelible', 'silinmez, kalıcı', 'The events of that period left an indelible mark on the nation''s collective memory.', 'O dönemin olayları, ulusun ortak belleğinde silinmez bir iz bıraktı.', 19, NOW()),
    (v_list_id, 'inexorable', 'karşı konulamaz, durdurulamaz', 'The inexorable rise of automation will reshape labor markets across many industries.', 'Otomasyonun durdurulamaz yükselişi, birçok sektörde iş gücü piyasalarını yeniden şekillendirecek.', 20, NOW()),
    (v_list_id, 'innocuous', 'zararsız, masum', 'What seemed an innocuous remark turned out to have serious political implications.', 'Zararsız görünen bir söz, sonunda ciddi siyasi sonuçlar doğurduğu ortaya çıktı.', 21, NOW()),
    (v_list_id, 'insidious', 'sinsi, fark edilmeden zarar veren', 'The insidious effects of misinformation can erode public trust over many years.', 'Yanlış bilginin sinsi etkileri, kamu güvenini yıllar içinde aşındırabilir.', 22, NOW()),
    (v_list_id, 'intricate', 'karmaşık, girift', 'The brain has intricate networks that researchers are only beginning to understand.', 'Beyin, araştırmacıların ancak yeni yeni anlamaya başladığı girift ağlara sahiptir.', 23, NOW()),
    (v_list_id, 'mitigate', 'hafifletmek, azaltmak', 'Reforestation efforts aim to mitigate the long-term impact of greenhouse gas emissions.', 'Ağaçlandırma çabaları, sera gazı emisyonlarının uzun vadeli etkisini hafifletmeyi amaçlar.', 24, NOW()),
    (v_list_id, 'obsolete', 'eskimiş, kullanımdan kalkmış', 'Many traditional manufacturing techniques have become obsolete in the digital age.', 'Birçok geleneksel imalat tekniği, dijital çağda kullanımdan kalkmıştır.', 25, NOW()),
    (v_list_id, 'ostensible', 'görünürdeki, sözde', 'The ostensible reason for the policy change concealed deeper political motives.', 'Politika değişikliğinin görünürdeki gerekçesi, daha derin siyasi nedenleri gizliyordu.', 26, NOW()),
    (v_list_id, 'paradigm', 'paradigma, örnek model', 'The discovery represented a paradigm shift in our understanding of cellular biology.', 'Bu keşif, hücre biyolojisi anlayışımızda bir paradigma değişikliğini temsil ediyordu.', 27, NOW()),
    (v_list_id, 'paradox', 'paradoks, çelişki', 'It is a paradox that nations rich in resources often suffer the most severe poverty.', 'Kaynak bakımından zengin ülkelerin en ağır yoksulluğu yaşaması bir paradokstur.', 28, NOW()),
    (v_list_id, 'perpetuate', 'sürdürmek, devam ettirmek', 'Outdated stereotypes in textbooks perpetuate harmful assumptions about marginalized groups.', 'Ders kitaplarındaki eski klişeler, dışlanmış gruplara dair zararlı varsayımları sürdürür.', 29, NOW()),
    (v_list_id, 'plausible', 'akla yatkın, makul', 'The economist offered a plausible explanation for the recent surge in commodity prices.', 'Ekonomist, emtia fiyatlarındaki son artış için akla yatkın bir açıklama sundu.', 30, NOW()),
    (v_list_id, 'pragmatic', 'pragmatik, pratik düşünen', 'A pragmatic approach to environmental policy considers both economic and ecological factors.', 'Çevre politikasına pragmatik bir yaklaşım hem ekonomik hem ekolojik faktörleri dikkate alır.', 31, NOW()),
    (v_list_id, 'precarious', 'tehlikeli, güvensiz, dengesiz', 'Millions of workers remain in precarious employment with little legal protection.', 'Milyonlarca çalışan, çok az yasal koruma ile güvencesiz istihdamda kalmaya devam ediyor.', 32, NOW()),
    (v_list_id, 'preclude', 'önlemek, olanaksız kılmak', 'Lack of evidence does not preclude the possibility of future scientific discovery.', 'Kanıt eksikliği, gelecekteki bilimsel keşif olasılığını dışlamaz.', 33, NOW()),
    (v_list_id, 'prevalent', 'yaygın, hâkim', 'Cynicism toward political institutions has become increasingly prevalent among young voters.', 'Siyasi kurumlara karşı kuşkuculuk, genç seçmenler arasında giderek daha yaygın hale geldi.', 34, NOW()),
    (v_list_id, 'redundant', 'gereksiz, fazlalık', 'The committee removed several redundant clauses from the original draft legislation.', 'Komite, orijinal yasa taslağından birkaç gereksiz hükmü çıkardı.', 35, NOW()),
    (v_list_id, 'scrutinize', 'incelemek, didik didik etmek', 'Journalists scrutinize public officials to ensure transparency and democratic accountability.', 'Gazeteciler, şeffaflık ve demokratik hesap verebilirliği sağlamak için kamu görevlilerini didik didik inceler.', 36, NOW()),
    (v_list_id, 'staunch', 'sadık, sıkı; durdurmak', 'She has been a staunch advocate of educational equity throughout her political career.', 'O, tüm siyasi kariyeri boyunca eğitimde eşitliğin sıkı bir savunucusu olmuştur.', 37, NOW()),
    (v_list_id, 'tenacious', 'inatçı, azimli', 'Her tenacious pursuit of evidence eventually exposed a wide-ranging corruption network.', 'Onun kanıt peşindeki azimli takibi, geniş çaplı bir yolsuzluk ağını sonunda ortaya çıkardı.', 38, NOW()),
    (v_list_id, 'ubiquitous', 'her yerde bulunan, yaygın', 'Smartphones have become ubiquitous, transforming nearly every aspect of daily communication.', 'Akıllı telefonlar her yerde bulunur hale gelerek günlük iletişimin neredeyse her yönünü dönüştürdü.', 39, NOW()),
    (v_list_id, 'undermine', 'baltalamak, zayıflatmak', 'Persistent corruption can undermine public trust in democratic political institutions.', 'Süregelen yolsuzluk, demokratik siyasi kurumlara olan kamu güvenini zayıflatabilir.', 40, NOW());
END $$;

-- END YDS PACK
