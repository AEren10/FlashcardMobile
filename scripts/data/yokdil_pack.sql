-- BEGIN YOKDIL PACK
-- ============================================================
-- YÖKDİL Vocabulary Pack — 5 lists, 200 words total
-- Lists:
--   1) YÖKDİL · Tanışma            (20 words, Orta)
--   2) YÖKDİL · Genel Akademik     (30 words, Orta)
--   3) YÖKDİL · Bilim & Sağlık     (50 words, İleri)
--   4) YÖKDİL · Sosyal Bilimler    (50 words, İleri)
--   5) YÖKDİL · Methodology        (50 words, İleri)
-- ============================================================

-- ============================================================
-- LIST 1 / 5 — YÖKDİL · Tanışma (20 words)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YÖKDİL · Tanışma', 'YÖKDİL sınavına hızlı başlangıç — 20 temel akademik kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'academic', 'akademik, ilmi', 'The journal publishes academic research on emerging technologies each quarter.', 'Dergi, her çeyrekte gelişmekte olan teknolojiler üzerine akademik araştırmalar yayımlamaktadır.', 1, NOW()),
    (v_list_id, 'analyze', 'analiz etmek, çözümlemek', 'The committee will analyze the survey data before drafting its final report.', 'Komite, nihai raporunu hazırlamadan önce anket verilerini analiz edecektir.', 2, NOW()),
    (v_list_id, 'approach', 'yaklaşım, yöntem', 'A multidisciplinary approach is often required to solve complex social problems.', 'Karmaşık toplumsal sorunları çözmek için çoğu zaman çok disiplinli bir yaklaşım gereklidir.', 3, NOW()),
    (v_list_id, 'argue', 'iddia etmek, ileri sürmek', 'The author argues that economic growth alone cannot reduce inequality.', 'Yazar, yalnızca ekonomik büyümenin eşitsizliği azaltamayacağını ileri sürmektedir.', 4, NOW()),
    (v_list_id, 'aspect', 'yön, boyut', 'The study examines several aspects of urban migration in developing regions.', 'Çalışma, gelişmekte olan bölgelerdeki kentsel göçün birçok boyutunu incelemektedir.', 5, NOW()),
    (v_list_id, 'assume', 'varsaymak, üstlenmek', 'Researchers assume that participants answered the questionnaire honestly.', 'Araştırmacılar, katılımcıların ankete dürüstçe yanıt verdiğini varsaymaktadır.', 6, NOW()),
    (v_list_id, 'concept', 'kavram, fikir', 'The concept of sustainable development has evolved significantly since the 1980s.', 'Sürdürülebilir kalkınma kavramı 1980''lerden bu yana önemli ölçüde gelişmiştir.', 7, NOW()),
    (v_list_id, 'conduct', 'yürütmek, yapmak', 'The team conducted interviews with more than two hundred participants.', 'Ekip, iki yüzden fazla katılımcı ile görüşmeler yürütmüştür.', 8, NOW()),
    (v_list_id, 'data', 'veri, bilgi', 'The collected data were analyzed using a standard statistical software package.', 'Toplanan veriler, standart bir istatistiksel yazılım paketi kullanılarak analiz edilmiştir.', 9, NOW()),
    (v_list_id, 'evidence', 'kanıt, delil', 'Recent evidence suggests a strong link between sleep quality and memory.', 'Son kanıtlar, uyku kalitesi ile bellek arasında güçlü bir bağ olduğunu göstermektedir.', 10, NOW()),
    (v_list_id, 'factor', 'etken, faktör', 'Several factors contributed to the rapid decline of the local industry.', 'Yerel sanayinin hızlı çöküşüne birçok etken katkıda bulunmuştur.', 11, NOW()),
    (v_list_id, 'identify', 'tanımlamak, belirlemek', 'The report identifies three main causes of the recent productivity drop.', 'Rapor, son üretkenlik düşüşünün üç ana nedenini belirlemektedir.', 12, NOW()),
    (v_list_id, 'impact', 'etki, tesir', 'Climate change has had a profound impact on agricultural output worldwide.', 'İklim değişikliği, dünya genelinde tarımsal üretim üzerinde derin bir etki bırakmıştır.', 13, NOW()),
    (v_list_id, 'method', 'yöntem, metot', 'A mixed method was preferred to capture both qualitative and quantitative aspects.', 'Hem nitel hem nicel yönleri yakalamak için karma bir yöntem tercih edilmiştir.', 14, NOW()),
    (v_list_id, 'previous', 'önceki, evvelki', 'Previous studies have largely overlooked the role of family structure.', 'Önceki çalışmalar, aile yapısının rolünü büyük ölçüde göz ardı etmiştir.', 15, NOW()),
    (v_list_id, 'process', 'süreç, işlem', 'The review process took nearly six months to complete.', 'İnceleme sürecinin tamamlanması yaklaşık altı ay sürmüştür.', 16, NOW()),
    (v_list_id, 'research', 'araştırma, inceleme', 'Further research is needed to confirm these preliminary findings.', 'Bu ön bulguların doğrulanması için ek araştırma yapılması gerekmektedir.', 17, NOW()),
    (v_list_id, 'result', 'sonuç, netice', 'The results clearly support the original hypothesis of the study.', 'Sonuçlar, çalışmanın özgün hipotezini açıkça desteklemektedir.', 18, NOW()),
    (v_list_id, 'significant', 'önemli, anlamlı', 'A significant difference was observed between the two experimental groups.', 'İki deney grubu arasında anlamlı bir fark gözlemlenmiştir.', 19, NOW()),
    (v_list_id, 'theory', 'kuram, teori', 'The new theory challenges long-held assumptions in cognitive psychology.', 'Yeni kuram, bilişsel psikolojide uzun süredir kabul gören varsayımlara meydan okumaktadır.', 20, NOW());
END $$;

-- ============================================================
-- LIST 2 / 5 — YÖKDİL · Genel Akademik (30 words)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YÖKDİL · Genel Akademik', 'YÖKDİL için genel akademik kavramlar — 30 kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'accumulate', 'biriktirmek, toplamak', 'Sediment accumulates on the riverbed over thousands of years.', 'Tortu, nehir yatağında binlerce yıl boyunca birikmektedir.', 1, NOW()),
    (v_list_id, 'acquire', 'edinmek, kazanmak', 'Children acquire language skills rapidly during the first five years.', 'Çocuklar, ilk beş yıl boyunca dil becerilerini hızla edinirler.', 2, NOW()),
    (v_list_id, 'adequate', 'yeterli, uygun', 'The funding was not adequate to cover the full scope of the project.', 'Mevcut finansman, projenin tüm kapsamını karşılamak için yeterli değildi.', 3, NOW()),
    (v_list_id, 'allocate', 'tahsis etmek, ayırmak', 'The university allocated additional resources to graduate research programs.', 'Üniversite, lisansüstü araştırma programlarına ek kaynaklar tahsis etmiştir.', 4, NOW()),
    (v_list_id, 'assess', 'değerlendirmek, ölçmek', 'The committee assessed the impact of remote learning on student performance.', 'Komite, uzaktan öğretimin öğrenci performansı üzerindeki etkisini değerlendirmiştir.', 5, NOW()),
    (v_list_id, 'attribute', 'atfetmek, yüklemek', 'Many scholars attribute the decline to shifting consumer preferences.', 'Pek çok bilim insanı bu düşüşü, değişen tüketici tercihlerine atfetmektedir.', 6, NOW()),
    (v_list_id, 'comprise', 'oluşmak, içermek', 'The sample comprised participants from twelve different countries.', 'Örneklem, on iki farklı ülkeden katılımcılardan oluşmaktaydı.', 7, NOW()),
    (v_list_id, 'consequence', 'sonuç, netice', 'The policy had unintended consequences for small business owners.', 'Politikanın, küçük işletme sahipleri için istenmeyen sonuçları olmuştur.', 8, NOW()),
    (v_list_id, 'considerable', 'önemli, hatırı sayılır', 'There has been a considerable increase in online education enrollment.', 'Çevrimiçi eğitim kayıtlarında hatırı sayılır bir artış gözlemlenmiştir.', 9, NOW()),
    (v_list_id, 'consistent', 'tutarlı, uyumlu', 'These findings are consistent with results from earlier longitudinal studies.', 'Bu bulgular, daha önceki boylamsal çalışmaların sonuçlarıyla tutarlıdır.', 10, NOW()),
    (v_list_id, 'constitute', 'oluşturmak, teşkil etmek', 'Women constitute nearly half of the workforce in the public sector.', 'Kamu sektörü iş gücünün neredeyse yarısını kadınlar oluşturmaktadır.', 11, NOW()),
    (v_list_id, 'contemporary', 'çağdaş, günümüze ait', 'The book offers a critical look at contemporary educational policies.', 'Kitap, çağdaş eğitim politikalarına eleştirel bir bakış sunmaktadır.', 12, NOW()),
    (v_list_id, 'crucial', 'çok önemli, hayati', 'Early intervention is crucial for the success of language therapy.', 'Erken müdahale, dil terapisinin başarısı için hayati önem taşımaktadır.', 13, NOW()),
    (v_list_id, 'derive', 'türetmek, elde etmek', 'Many medical terms are derived from Latin and Greek roots.', 'Pek çok tıbbi terim, Latince ve Yunanca köklerden türetilmiştir.', 14, NOW()),
    (v_list_id, 'distinct', 'belirgin, ayrı', 'The two species have distinct mating behaviors despite their similar appearance.', 'İki tür, benzer görünümlerine rağmen belirgin biçimde farklı çiftleşme davranışlarına sahiptir.', 15, NOW()),
    (v_list_id, 'emerge', 'ortaya çıkmak, belirmek', 'A new pattern of consumption emerged after the economic crisis.', 'Ekonomik krizin ardından yeni bir tüketim örüntüsü ortaya çıkmıştır.', 16, NOW()),
    (v_list_id, 'enhance', 'geliştirmek, iyileştirmek', 'Mobile applications can enhance students'' engagement with course materials.', 'Mobil uygulamalar, öğrencilerin ders materyalleriyle etkileşimini artırabilir.', 17, NOW()),
    (v_list_id, 'ensure', 'sağlamak, garanti etmek', 'Strict protocols ensure the validity of the experimental results.', 'Sıkı protokoller, deneysel sonuçların geçerliliğini güvence altına almaktadır.', 18, NOW()),
    (v_list_id, 'establish', 'kurmak, oluşturmak', 'The institute was established to promote interdisciplinary research.', 'Enstitü, disiplinler arası araştırmayı teşvik etmek amacıyla kurulmuştur.', 19, NOW()),
    (v_list_id, 'evaluate', 'değerlendirmek, takdir etmek', 'Reviewers evaluate manuscripts based on originality, rigor, and clarity.', 'Hakemler, makaleleri özgünlük, sağlamlık ve açıklık ölçütlerine göre değerlendirir.', 20, NOW()),
    (v_list_id, 'feature', 'özellik, nitelik', 'One striking feature of the new model is its low energy consumption.', 'Yeni modelin dikkat çeken bir özelliği, düşük enerji tüketimidir.', 21, NOW()),
    (v_list_id, 'illustrate', 'örneklemek, göstermek', 'The chart illustrates the rapid growth of renewable energy investments.', 'Grafik, yenilenebilir enerji yatırımlarının hızlı büyümesini göstermektedir.', 22, NOW()),
    (v_list_id, 'imply', 'ima etmek, anlamına gelmek', 'The findings imply that early exposure to music improves auditory processing.', 'Bulgular, erken yaşta müziğe maruz kalmanın işitsel işlemeyi geliştirdiğine işaret etmektedir.', 23, NOW()),
    (v_list_id, 'integrate', 'bütünleştirmek, entegre etmek', 'The new curriculum integrates digital literacy into every subject area.', 'Yeni müfredat, dijital okuryazarlığı her ders alanıyla bütünleştirmektedir.', 24, NOW()),
    (v_list_id, 'investigate', 'araştırmak, soruşturmak', 'Scientists are investigating the long-term effects of microplastic exposure.', 'Bilim insanları, mikroplastik maruziyetinin uzun vadeli etkilerini araştırmaktadır.', 25, NOW()),
    (v_list_id, 'maintain', 'sürdürmek, korumak', 'Critics maintain that the policy fails to address the root causes.', 'Eleştirmenler, politikanın temel nedenleri ele almakta yetersiz kaldığını savunmaktadır.', 26, NOW()),
    (v_list_id, 'obtain', 'elde etmek, edinmek', 'Permission was obtained from all participants prior to data collection.', 'Veri toplama öncesinde tüm katılımcılardan izin alınmıştır.', 27, NOW()),
    (v_list_id, 'reveal', 'açığa çıkarmak, ortaya koymak', 'The interview revealed surprising gaps in the participants'' understanding.', 'Görüşme, katılımcıların anlayışındaki şaşırtıcı boşlukları ortaya koymuştur.', 28, NOW()),
    (v_list_id, 'subsequent', 'sonraki, müteakip', 'Subsequent studies confirmed the initial observations with larger samples.', 'Sonraki çalışmalar, ilk gözlemleri daha geniş örneklemlerle doğrulamıştır.', 29, NOW()),
    (v_list_id, 'utilize', 'kullanmak, faydalanmak', 'Researchers utilized advanced imaging techniques to study cellular changes.', 'Araştırmacılar, hücresel değişiklikleri incelemek için gelişmiş görüntüleme tekniklerinden yararlanmıştır.', 30, NOW());
END $$;

-- ============================================================
-- LIST 3 / 5 — YÖKDİL · Bilim & Sağlık (50 words)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YÖKDİL · Bilim & Sağlık', 'YÖKDİL Fen ve Sağlık Bilimleri terminolojisi — 50 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'absorb', 'emmek, soğurmak', 'Plant roots absorb water and dissolved minerals from the surrounding soil.', 'Bitki kökleri, çevredeki topraktan su ve çözünmüş mineralleri emer.', 1, NOW()),
    (v_list_id, 'acute', 'akut, şiddetli', 'Acute respiratory infections remain a leading cause of childhood mortality.', 'Akut solunum yolu enfeksiyonları, çocuk ölümlerinin önde gelen nedenlerinden biri olmaya devam etmektedir.', 2, NOW()),
    (v_list_id, 'antibiotic', 'antibiyotik', 'Overuse of antibiotics has accelerated the rise of resistant bacterial strains.', 'Antibiyotiklerin aşırı kullanımı, dirençli bakteri suşlarının artışını hızlandırmıştır.', 3, NOW()),
    (v_list_id, 'biodiversity', 'biyolojik çeşitlilik', 'Tropical rainforests host an extraordinary level of biodiversity per square kilometer.', 'Tropikal yağmur ormanları, kilometrekare başına olağanüstü düzeyde biyolojik çeşitliliğe ev sahipliği yapar.', 4, NOW()),
    (v_list_id, 'catalyst', 'katalizör, hızlandırıcı', 'Enzymes serve as biological catalysts in nearly every metabolic reaction.', 'Enzimler, neredeyse her metabolik tepkimede biyolojik katalizör görevi görür.', 5, NOW()),
    (v_list_id, 'cell', 'hücre', 'Each human cell contains a complete copy of the genetic blueprint.', 'Her insan hücresi, genetik şablonun tam bir kopyasını içerir.', 6, NOW()),
    (v_list_id, 'chronic', 'kronik, müzmin', 'Chronic stress can weaken the immune system over extended periods.', 'Kronik stres, uzun süre boyunca bağışıklık sistemini zayıflatabilir.', 7, NOW()),
    (v_list_id, 'circulate', 'dolaşmak, dolaştırmak', 'Blood circulates through the body roughly once every minute at rest.', 'Kan, dinlenme halindeyken vücut içinde yaklaşık olarak her dakika bir kez dolaşır.', 8, NOW()),
    (v_list_id, 'compound', 'bileşik, karışım', 'The new compound shows promise in treating drug-resistant tuberculosis.', 'Yeni bileşik, ilaca dirençli tüberküloz tedavisinde umut vaat etmektedir.', 9, NOW()),
    (v_list_id, 'contaminate', 'kirletmek, bulaştırmak', 'Industrial waste has contaminated groundwater across several rural districts.', 'Endüstriyel atıklar, birçok kırsal ilçedeki yer altı sularını kirletmiştir.', 10, NOW()),
    (v_list_id, 'cure', 'tedavi etmek, çare', 'Despite decades of effort, no definitive cure has yet been developed.', 'Onlarca yıllık çabaya rağmen kesin bir tedavi henüz geliştirilememiştir.', 11, NOW()),
    (v_list_id, 'diagnose', 'teşhis etmek, tanı koymak', 'The patient was diagnosed with a rare autoimmune disorder.', 'Hastaya nadir görülen bir otoimmün bozukluk teşhisi konulmuştur.', 12, NOW()),
    (v_list_id, 'diffuse', 'yayılmak, dağılmak', 'Oxygen diffuses across the alveolar membrane into the bloodstream.', 'Oksijen, alveol zarından kan dolaşımına geçerek yayılır.', 13, NOW()),
    (v_list_id, 'dose', 'doz, miktar', 'Adjusting the dose is essential to minimize unwanted side effects.', 'İstenmeyen yan etkileri en aza indirmek için doz ayarlaması gereklidir.', 14, NOW()),
    (v_list_id, 'ecosystem', 'ekosistem', 'Coral reef ecosystems are highly sensitive to small changes in water temperature.', 'Mercan resifi ekosistemleri, su sıcaklığındaki küçük değişikliklere karşı son derece duyarlıdır.', 15, NOW()),
    (v_list_id, 'emit', 'yaymak, salmak', 'Volcanoes emit large quantities of sulfur dioxide during major eruptions.', 'Yanardağlar, büyük patlamalar sırasında büyük miktarlarda kükürt dioksit salar.', 16, NOW()),
    (v_list_id, 'epidemic', 'salgın, epidemi', 'The cholera epidemic spread rapidly through overcrowded refugee camps.', 'Kolera salgını, aşırı kalabalık mülteci kamplarında hızla yayılmıştır.', 17, NOW()),
    (v_list_id, 'erosion', 'erozyon, aşınma', 'Deforestation has dramatically increased soil erosion along the river basin.', 'Ormansızlaşma, nehir havzası boyunca toprak erozyonunu çarpıcı biçimde artırmıştır.', 18, NOW()),
    (v_list_id, 'etiology', 'etiyoloji, hastalık nedeni', 'The exact etiology of the syndrome remains a subject of active investigation.', 'Sendromun kesin etiyolojisi, hâlâ aktif araştırma konusudur.', 19, NOW()),
    (v_list_id, 'evolve', 'evrimleşmek, gelişmek', 'Species evolve gradually as environmental pressures select for advantageous traits.', 'Türler, çevresel baskıların avantajlı özellikleri seçmesiyle kademeli olarak evrimleşir.', 20, NOW()),
    (v_list_id, 'exposure', 'maruz kalma, açığa çıkma', 'Long-term exposure to ultraviolet radiation increases the risk of skin cancer.', 'Ultraviyole ışınlara uzun süre maruz kalmak, cilt kanseri riskini artırmaktadır.', 21, NOW()),
    (v_list_id, 'fertility', 'doğurganlık, verimlilik', 'Soil fertility declines sharply after years of intensive monoculture farming.', 'Toprak verimliliği, yıllarca süren yoğun monokültür tarımının ardından keskin biçimde düşer.', 22, NOW()),
    (v_list_id, 'fossil', 'fosil', 'Newly discovered fossils suggest that the species lived in shallow seas.', 'Yeni keşfedilen fosiller, türün sığ denizlerde yaşadığını düşündürmektedir.', 23, NOW()),
    (v_list_id, 'gene', 'gen, kalıtım birimi', 'A single gene mutation can disrupt entire metabolic pathways.', 'Tek bir gen mutasyonu, tüm metabolik yolakları bozabilir.', 24, NOW()),
    (v_list_id, 'habitat', 'yaşam alanı, habitat', 'Habitat loss is the primary threat to many migratory bird populations.', 'Yaşam alanı kaybı, pek çok göçmen kuş popülasyonu için başlıca tehdittir.', 25, NOW()),
    (v_list_id, 'hypothesize', 'hipotez kurmak, varsaymak', 'Researchers hypothesize that long-term exposure may alter hormonal balance.', 'Araştırmacılar, uzun süreli maruz kalmanın hormonal dengeyi değiştirebileceğini varsaymaktadır.', 26, NOW()),
    (v_list_id, 'immune', 'bağışık, dirençli', 'A weakened immune system makes patients vulnerable to opportunistic infections.', 'Zayıflamış bir bağışıklık sistemi, hastaları fırsatçı enfeksiyonlara karşı savunmasız bırakır.', 27, NOW()),
    (v_list_id, 'inflammation', 'iltihap, yangı', 'Chronic inflammation has been linked to several cardiovascular conditions.', 'Kronik iltihap, çeşitli kalp-damar rahatsızlıklarıyla ilişkilendirilmiştir.', 28, NOW()),
    (v_list_id, 'inherit', 'kalıtsal olarak almak, miras almak', 'Children often inherit predispositions to certain metabolic disorders.', 'Çocuklar, belirli metabolik bozukluklara yatkınlığı çoğu zaman kalıtsal olarak alır.', 29, NOW()),
    (v_list_id, 'molecule', 'molekül', 'A water molecule consists of two hydrogen atoms bonded to one oxygen atom.', 'Bir su molekülü, bir oksijen atomuna bağlı iki hidrojen atomundan oluşur.', 30, NOW()),
    (v_list_id, 'mutation', 'mutasyon, değişim', 'Random mutations provide the raw material on which natural selection acts.', 'Rastgele mutasyonlar, doğal seçilimin üzerinde işlediği ham materyali sağlar.', 31, NOW()),
    (v_list_id, 'neurological', 'nörolojik, sinirsel', 'Early diagnosis of neurological conditions greatly improves long-term outcomes.', 'Nörolojik durumların erken tanısı, uzun vadeli sonuçları büyük ölçüde iyileştirir.', 32, NOW()),
    (v_list_id, 'organism', 'organizma, canlı', 'Single-celled organisms dominated the planet for nearly three billion years.', 'Tek hücreli organizmalar, gezegene yaklaşık üç milyar yıl boyunca egemen olmuştur.', 33, NOW()),
    (v_list_id, 'oscillate', 'salınmak, gidip gelmek', 'The pendulum oscillates at a fixed frequency determined by its length.', 'Sarkaç, uzunluğuna göre belirlenen sabit bir frekansta salınır.', 34, NOW()),
    (v_list_id, 'pathogen', 'patojen, hastalık etkeni', 'Vaccines train the immune system to recognize specific pathogens.', 'Aşılar, bağışıklık sistemini belirli patojenleri tanımak üzere eğitir.', 35, NOW()),
    (v_list_id, 'photosynthesis', 'fotosentez', 'Photosynthesis converts solar energy into chemical energy stored in glucose.', 'Fotosentez, güneş enerjisini glikozda depolanan kimyasal enerjiye dönüştürür.', 36, NOW()),
    (v_list_id, 'pollutant', 'kirletici, kirletici madde', 'Airborne pollutants travel hundreds of kilometers before settling on the ground.', 'Havadaki kirleticiler, yere yerleşmeden önce yüzlerce kilometre yol kateder.', 37, NOW()),
    (v_list_id, 'predator', 'avcı, yırtıcı', 'Top predators play a crucial role in regulating prey populations.', 'Üst düzey yırtıcılar, av popülasyonlarını düzenlemede kritik bir rol oynar.', 38, NOW()),
    (v_list_id, 'prognosis', 'prognoz, hastalık seyri', 'The prognosis is generally favorable when the tumor is detected early.', 'Tümörün erken saptanması durumunda prognoz genellikle olumludur.', 39, NOW()),
    (v_list_id, 'prophylactic', 'koruyucu, önleyici', 'Prophylactic measures significantly reduce postoperative infection rates.', 'Koruyucu önlemler, ameliyat sonrası enfeksiyon oranlarını önemli ölçüde azaltır.', 40, NOW()),
    (v_list_id, 'radiation', 'radyasyon, ışınım', 'Background radiation is present everywhere in our natural environment.', 'Arka plan radyasyonu, doğal çevremizin her yerinde mevcuttur.', 41, NOW()),
    (v_list_id, 'remedy', 'çare, tedavi', 'Traditional herbal remedies are increasingly studied for their pharmacological properties.', 'Geleneksel bitkisel çareler, farmakolojik özellikleri açısından giderek daha çok incelenmektedir.', 42, NOW()),
    (v_list_id, 'respiratory', 'solunum ile ilgili', 'Respiratory diseases account for a substantial share of hospital admissions.', 'Solunum hastalıkları, hastane başvurularının önemli bir bölümünü oluşturur.', 43, NOW()),
    (v_list_id, 'specimen', 'örnek, numune', 'Each tissue specimen was preserved in formalin before microscopic examination.', 'Her doku örneği, mikroskobik inceleme öncesinde formalin içinde korunmuştur.', 44, NOW()),
    (v_list_id, 'sustainable', 'sürdürülebilir', 'Sustainable agriculture aims to preserve soil quality for future generations.', 'Sürdürülebilir tarım, gelecek nesiller için toprak kalitesini korumayı amaçlar.', 45, NOW()),
    (v_list_id, 'symptom', 'belirti, semptom', 'Fever and fatigue are common symptoms across many viral infections.', 'Ateş ve halsizlik, pek çok viral enfeksiyonda görülen yaygın belirtilerdir.', 46, NOW()),
    (v_list_id, 'toxic', 'toksik, zehirli', 'Even small concentrations of mercury can be toxic to aquatic life.', 'Düşük yoğunluktaki cıva bile su yaşamı için toksik olabilir.', 47, NOW()),
    (v_list_id, 'vaccine', 'aşı', 'The vaccine demonstrated strong efficacy across multiple age groups.', 'Aşı, birden fazla yaş grubunda güçlü etkinlik göstermiştir.', 48, NOW()),
    (v_list_id, 'vessel', 'damar, gemi', 'Blood vessels constrict in response to cold environmental temperatures.', 'Kan damarları, soğuk çevre sıcaklıklarına yanıt olarak büzülür.', 49, NOW()),
    (v_list_id, 'virus', 'virüs', 'A virus cannot replicate without hijacking the machinery of a host cell.', 'Bir virüs, konak hücrenin mekanizmasını ele geçirmeden çoğalamaz.', 50, NOW());
END $$;

-- ============================================================
-- LIST 4 / 5 — YÖKDİL · Sosyal Bilimler (50 words)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YÖKDİL · Sosyal Bilimler', 'YÖKDİL Sosyal Bilimler ve Eğitim alanı terminolojisi — 50 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'advocate', 'savunmak, savunucu', 'The author advocates a more participatory model of local governance.', 'Yazar, daha katılımcı bir yerel yönetim modelini savunmaktadır.', 1, NOW()),
    (v_list_id, 'affiliation', 'bağlılık, mensubiyet', 'Political affiliation strongly predicts attitudes toward immigration in this dataset.', 'Bu veri setinde siyasi bağlılık, göçe yönelik tutumları güçlü biçimde yordamaktadır.', 2, NOW()),
    (v_list_id, 'allegiance', 'sadakat, bağlılık', 'Citizens'' allegiance to national institutions has weakened over recent decades.', 'Vatandaşların ulusal kurumlara olan bağlılığı son on yıllarda zayıflamıştır.', 3, NOW()),
    (v_list_id, 'anthropological', 'antropolojik', 'The study takes an anthropological perspective on contemporary urban rituals.', 'Çalışma, günümüz kentsel ritüellerine antropolojik bir bakış açısıyla yaklaşmaktadır.', 4, NOW()),
    (v_list_id, 'ascription', 'atfetme, yükleme', 'The ascription of moral responsibility varies across cultural contexts.', 'Ahlaki sorumluluğun atfedilme biçimi, kültürel bağlamlara göre değişir.', 5, NOW()),
    (v_list_id, 'assimilation', 'asimilasyon, özümseme', 'Forced cultural assimilation often produces long-lasting social tensions.', 'Zorla yapılan kültürel asimilasyon, çoğu zaman uzun süreli toplumsal gerilimler üretir.', 6, NOW()),
    (v_list_id, 'autonomy', 'özerklik, bağımsızlık', 'Regional autonomy has been a recurring demand throughout the country''s history.', 'Bölgesel özerklik, ülkenin tarihi boyunca yinelenen bir talep olmuştur.', 7, NOW()),
    (v_list_id, 'bias', 'önyargı, taraflılık', 'Implicit bias can subtly influence hiring decisions even among well-intentioned managers.', 'Örtük önyargı, iyi niyetli yöneticiler arasında bile işe alım kararlarını incelikle etkileyebilir.', 8, NOW()),
    (v_list_id, 'civic', 'sivil, yurttaşlık ile ilgili', 'Civic education plays a key role in shaping democratic participation.', 'Yurttaşlık eğitimi, demokratik katılımı şekillendirmede kilit bir rol oynar.', 9, NOW()),
    (v_list_id, 'cohesion', 'birliktelik, dayanışma', 'Social cohesion tends to decline as economic inequality rises.', 'Toplumsal dayanışma, ekonomik eşitsizlik arttıkça azalma eğilimi gösterir.', 10, NOW()),
    (v_list_id, 'collective', 'kolektif, toplu', 'Collective memory shapes how nations remember their founding moments.', 'Kolektif bellek, ulusların kuruluş anlarını nasıl hatırladıklarını şekillendirir.', 11, NOW()),
    (v_list_id, 'compliance', 'uyum, riayet', 'Public compliance with new regulations was higher than the policymakers anticipated.', 'Yeni düzenlemelere kamuoyu uyumu, politika yapıcıların öngördüğünden daha yüksek olmuştur.', 12, NOW()),
    (v_list_id, 'consensus', 'uzlaşma, fikir birliği', 'Reaching consensus among stakeholders required several rounds of negotiation.', 'Paydaşlar arasında uzlaşıya varmak, birkaç tur müzakere gerektirmiştir.', 13, NOW()),
    (v_list_id, 'constituency', 'seçim bölgesi, seçmen kitlesi', 'The party drew most of its support from rural constituencies.', 'Parti, desteğinin büyük bölümünü kırsal seçim bölgelerinden almıştır.', 14, NOW()),
    (v_list_id, 'curriculum', 'müfredat, izlence', 'The revised curriculum places greater emphasis on critical thinking skills.', 'Yenilenen müfredat, eleştirel düşünme becerilerine daha fazla vurgu yapmaktadır.', 15, NOW()),
    (v_list_id, 'demography', 'demografi, nüfus bilimi', 'Demography helps explain long-term shifts in labor markets and pension systems.', 'Demografi, iş gücü piyasaları ve emeklilik sistemlerindeki uzun vadeli değişimleri açıklamaya yardımcı olur.', 16, NOW()),
    (v_list_id, 'discrimination', 'ayrımcılık', 'Workplace discrimination remains a significant barrier to gender equality.', 'İş yerindeki ayrımcılık, toplumsal cinsiyet eşitliği önünde önemli bir engel olmaya devam etmektedir.', 17, NOW()),
    (v_list_id, 'displace', 'yerinden etmek, sürmek', 'Armed conflict has displaced millions of civilians from their homes.', 'Silahlı çatışma, milyonlarca sivili evlerinden yerinden etmiştir.', 18, NOW()),
    (v_list_id, 'diversity', 'çeşitlilik', 'Cultural diversity within the classroom enriches student learning experiences.', 'Sınıf içindeki kültürel çeşitlilik, öğrencilerin öğrenme deneyimlerini zenginleştirir.', 19, NOW()),
    (v_list_id, 'doctrine', 'doktrin, öğreti', 'The doctrine of separation of powers underlies most modern democracies.', 'Kuvvetler ayrılığı doktrini, çoğu modern demokrasinin temelinde yer alır.', 20, NOW()),
    (v_list_id, 'egalitarian', 'eşitlikçi', 'Egalitarian societies report higher levels of trust between citizens.', 'Eşitlikçi toplumlar, vatandaşlar arasında daha yüksek güven düzeyleri bildirmektedir.', 21, NOW()),
    (v_list_id, 'electorate', 'seçmen kitlesi', 'The electorate appeared deeply divided in the most recent national vote.', 'Seçmen kitlesi, en son ulusal oylamada derinden bölünmüş görünmektedir.', 22, NOW()),
    (v_list_id, 'emancipation', 'özgürleştirme, kurtuluş', 'The emancipation of marginalized groups often follows decades of activism.', 'Marjinal grupların özgürleşmesi, çoğu zaman on yıllarca süren aktivizmin ardından gelir.', 23, NOW()),
    (v_list_id, 'ethnicity', 'etnik köken', 'Ethnicity should not be conflated with nationality in survey design.', 'Anket tasarımında etnik köken, vatandaşlıkla karıştırılmamalıdır.', 24, NOW()),
    (v_list_id, 'exclusion', 'dışlanma, hariç tutma', 'Social exclusion has tangible effects on mental health and life expectancy.', 'Toplumsal dışlanmanın, ruh sağlığı ve yaşam beklentisi üzerinde somut etkileri vardır.', 25, NOW()),
    (v_list_id, 'gender', 'toplumsal cinsiyet', 'Gender disparities persist in academic leadership positions across most regions.', 'Akademik liderlik pozisyonlarında toplumsal cinsiyet eşitsizlikleri çoğu bölgede sürmektedir.', 26, NOW()),
    (v_list_id, 'hegemony', 'hegemonya, üstünlük', 'Cultural hegemony shapes what counts as common sense in public discourse.', 'Kültürel hegemonya, kamusal söylemde neyin sağduyu sayıldığını şekillendirir.', 27, NOW()),
    (v_list_id, 'identity', 'kimlik', 'Adolescents construct identity through interactions with peers and media.', 'Ergenler, akranları ve medya ile etkileşim yoluyla kimlik inşa eder.', 28, NOW()),
    (v_list_id, 'ideology', 'ideoloji', 'Political ideology shapes how citizens interpret economic news.', 'Siyasi ideoloji, vatandaşların ekonomik haberleri nasıl yorumladığını biçimlendirir.', 29, NOW()),
    (v_list_id, 'illiteracy', 'okuma yazma bilmeme', 'Functional illiteracy remains a hidden obstacle to civic participation.', 'İşlevsel okuma yazma bilmemek, sivil katılımın önünde gizli bir engel olmayı sürdürmektedir.', 30, NOW()),
    (v_list_id, 'inequality', 'eşitsizlik', 'Income inequality has widened markedly over the last three decades.', 'Gelir eşitsizliği, son otuz yılda belirgin biçimde derinleşmiştir.', 31, NOW()),
    (v_list_id, 'institution', 'kurum, müessese', 'Strong institutions are essential for sustainable economic development.', 'Güçlü kurumlar, sürdürülebilir ekonomik kalkınma için vazgeçilmezdir.', 32, NOW()),
    (v_list_id, 'jurisdiction', 'yargı yetkisi, kaza', 'Cross-border crimes often fall outside the jurisdiction of a single court.', 'Sınır ötesi suçlar, çoğu zaman tek bir mahkemenin yargı yetkisi dışında kalır.', 33, NOW()),
    (v_list_id, 'legacy', 'miras, kalıt', 'Colonial legacy continues to shape current educational inequalities.', 'Sömürge mirası, mevcut eğitim eşitsizliklerini şekillendirmeyi sürdürmektedir.', 34, NOW()),
    (v_list_id, 'legitimacy', 'meşruiyet', 'Democratic legitimacy depends on free, fair, and regular elections.', 'Demokratik meşruiyet, özgür, adil ve düzenli seçimlere bağlıdır.', 35, NOW()),
    (v_list_id, 'liberation', 'kurtuluş, özgürleşme', 'Many post-war narratives emphasize themes of national liberation.', 'Pek çok savaş sonrası anlatı, ulusal kurtuluş temalarını öne çıkarır.', 36, NOW()),
    (v_list_id, 'literacy', 'okuryazarlık', 'Digital literacy is now considered as fundamental as traditional reading skills.', 'Dijital okuryazarlık artık geleneksel okuma becerileri kadar temel sayılmaktadır.', 37, NOW()),
    (v_list_id, 'migration', 'göç', 'Internal migration has reshaped the demographic profile of major cities.', 'İç göç, büyük şehirlerin demografik profilini yeniden biçimlendirmiştir.', 38, NOW()),
    (v_list_id, 'norm', 'norm, kural', 'Cultural norms about politeness differ significantly between languages.', 'Nezakete ilişkin kültürel normlar, diller arasında önemli ölçüde farklılık gösterir.', 39, NOW()),
    (v_list_id, 'pedagogy', 'pedagoji, eğitim bilimi', 'Modern pedagogy increasingly favors active over passive learning.', 'Modern pedagoji, giderek pasif öğrenme yerine aktif öğrenmeyi tercih etmektedir.', 40, NOW()),
    (v_list_id, 'pluralism', 'çoğulculuk', 'Cultural pluralism enriches public life when supported by inclusive institutions.', 'Kültürel çoğulculuk, kapsayıcı kurumlarca desteklendiğinde kamusal yaşamı zenginleştirir.', 41, NOW()),
    (v_list_id, 'poverty', 'yoksulluk', 'Persistent poverty undermines investments in education and healthcare.', 'Kalıcı yoksulluk, eğitim ve sağlığa yapılan yatırımları zayıflatır.', 42, NOW()),
    (v_list_id, 'prejudice', 'önyargı, taraf tutma', 'Prejudice often persists even when people consciously reject discriminatory beliefs.', 'Önyargı, insanlar ayrımcı inançları bilinçli olarak reddettiğinde bile çoğu kez varlığını sürdürür.', 43, NOW()),
    (v_list_id, 'reform', 'reform, ıslahat', 'Educational reform requires sustained political commitment over many years.', 'Eğitim reformu, uzun yıllar boyunca sürdürülebilir siyasi kararlılık gerektirir.', 44, NOW()),
    (v_list_id, 'reluctance', 'isteksizlik, çekimserlik', 'There is widespread reluctance to discuss inherited wealth in public debate.', 'Miras yoluyla edinilen zenginliği kamuoyunda tartışmak konusunda yaygın bir isteksizlik vardır.', 45, NOW()),
    (v_list_id, 'sociological', 'sosyolojik', 'A sociological lens reveals patterns that economic models alone cannot capture.', 'Sosyolojik bir mercek, yalnızca ekonomik modellerin yakalayamayacağı örüntüleri ortaya koyar.', 46, NOW()),
    (v_list_id, 'stigma', 'damga, leke', 'The stigma attached to mental illness deters many patients from seeking help.', 'Akıl hastalığına yüklenen damga, pek çok hastanın yardım aramaktan kaçınmasına yol açmaktadır.', 47, NOW()),
    (v_list_id, 'stratification', 'tabakalaşma', 'Social stratification influences access to quality education and healthcare.', 'Toplumsal tabakalaşma, nitelikli eğitim ve sağlığa erişimi etkilemektedir.', 48, NOW()),
    (v_list_id, 'tolerance', 'hoşgörü, müsamaha', 'Tolerance of dissent is a defining feature of healthy democracies.', 'Muhalefete hoşgörü, sağlıklı demokrasilerin ayırt edici bir özelliğidir.', 49, NOW()),
    (v_list_id, 'urbanization', 'kentleşme', 'Rapid urbanization has strained housing markets in many emerging economies.', 'Hızlı kentleşme, pek çok yükselen ekonomide konut piyasalarını zorlamıştır.', 50, NOW());
END $$;

-- ============================================================
-- LIST 5 / 5 — YÖKDİL · Methodology (50 words)
-- ============================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('YÖKDİL · Methodology', 'YÖKDİL araştırma metodolojisi ve akademik söylem terminolojisi — 50 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'ambiguous', 'belirsiz, çift anlamlı', 'The wording of the survey item proved too ambiguous for reliable interpretation.', 'Anket maddesinin ifadesi, güvenilir bir yorum için fazla belirsiz çıkmıştır.', 1, NOW()),
    (v_list_id, 'articulate', 'açıkça ifade etmek, dile getirmek', 'The author fails to articulate a clear position on the underlying problem.', 'Yazar, temel sorun konusunda net bir tutumu açıkça dile getirmemektedir.', 2, NOW()),
    (v_list_id, 'assumption', 'varsayım, kabul', 'The model rests on the assumption that respondents behave rationally.', 'Model, katılımcıların rasyonel davrandığı varsayımına dayanmaktadır.', 3, NOW()),
    (v_list_id, 'coherent', 'tutarlı, mantıksal bütünlüğü olan', 'A coherent theoretical framework strengthens the contribution of any study.', 'Tutarlı bir kuramsal çerçeve, herhangi bir çalışmanın katkısını güçlendirir.', 4, NOW()),
    (v_list_id, 'compelling', 'inandırıcı, etkileyici', 'The authors present compelling evidence in favor of the revised model.', 'Yazarlar, gözden geçirilmiş modeli destekleyen inandırıcı kanıtlar sunmaktadır.', 5, NOW()),
    (v_list_id, 'conjecture', 'tahmin, varsayım', 'Without supporting data, the claim remains little more than informed conjecture.', 'Destekleyici veri olmaksızın iddia, bilgili bir tahminden öteye geçmemektedir.', 6, NOW()),
    (v_list_id, 'contend', 'iddia etmek, ileri sürmek', 'Some scholars contend that current measures underestimate informal economic activity.', 'Bazı bilim insanları, mevcut ölçümlerin kayıt dışı ekonomik faaliyeti olduğundan az gösterdiğini öne sürmektedir.', 7, NOW()),
    (v_list_id, 'contention', 'iddia, tartışmalı görüş', 'Their central contention is that media exposure shapes political attitudes.', 'Onların temel iddiası, medyaya maruz kalmanın siyasi tutumları şekillendirdiğidir.', 8, NOW()),
    (v_list_id, 'correlate', 'ilişkilendirmek, korelasyon kurmak', 'Reading time correlates positively with vocabulary growth among young learners.', 'Okuma süresi, küçük yaştaki öğreniciler arasında kelime dağarcığı gelişimiyle olumlu ilişki göstermektedir.', 9, NOW()),
    (v_list_id, 'criterion', 'ölçüt, kriter', 'Each criterion was weighted equally in the evaluation rubric.', 'Değerlendirme kriterlerinin her biri, dereceli puanlama anahtarında eşit ağırlıkta tutulmuştur.', 10, NOW()),
    (v_list_id, 'deduce', 'çıkarsamak, sonucuna varmak', 'From the data, we can deduce that the intervention had limited effect.', 'Verilerden, müdahalenin sınırlı bir etkisi olduğu çıkarsanabilir.', 11, NOW()),
    (v_list_id, 'demonstrate', 'göstermek, kanıtlamak', 'The experiment clearly demonstrates the effect of context on word recall.', 'Deney, bağlamın kelime hatırlamadaki etkisini açıkça göstermektedir.', 12, NOW()),
    (v_list_id, 'discrepancy', 'tutarsızlık, uyumsuzluk', 'A discrepancy between official statistics and field observations warrants further inquiry.', 'Resmi istatistikler ile saha gözlemleri arasındaki tutarsızlık, daha fazla araştırmayı gerektirmektedir.', 13, NOW()),
    (v_list_id, 'elaborate', 'ayrıntılandırmak, detaylı açıklamak', 'The discussion section elaborates on the practical implications of the findings.', 'Tartışma bölümü, bulguların pratik çıkarımlarını ayrıntılandırmaktadır.', 14, NOW()),
    (v_list_id, 'empirical', 'görgül, deneye dayalı', 'Empirical research has consistently challenged this widely held assumption.', 'Görgül araştırmalar, bu yaygın varsayıma sürekli olarak meydan okumuştur.', 15, NOW()),
    (v_list_id, 'evaluation', 'değerlendirme', 'A rigorous evaluation of the program revealed several unintended outcomes.', 'Programın titiz bir değerlendirmesi, birkaç istenmeyen sonucu ortaya çıkarmıştır.', 16, NOW()),
    (v_list_id, 'extrapolate', 'kestirimde bulunmak, dışkestirim yapmak', 'It is risky to extrapolate findings from a small sample to the entire population.', 'Küçük bir örneklemden elde edilen bulguları tüm popülasyona genellemek risklidir.', 17, NOW()),
    (v_list_id, 'formulate', 'formüle etmek, oluşturmak', 'The researchers carefully formulated their hypotheses before collecting any data.', 'Araştırmacılar, herhangi bir veri toplamadan önce hipotezlerini özenle formüle etmişlerdir.', 18, NOW()),
    (v_list_id, 'framework', 'çerçeve, yapı', 'A theoretical framework guides the choice of variables in any quantitative study.', 'Kuramsal bir çerçeve, herhangi bir nicel çalışmada değişken seçimini yönlendirir.', 19, NOW()),
    (v_list_id, 'generalize', 'genelleştirmek', 'Caution is required when generalizing findings from a single case study.', 'Tek bir vaka çalışmasından elde edilen bulguları genellerken dikkatli olunmalıdır.', 20, NOW()),
    (v_list_id, 'hypothesis', 'hipotez, varsayım', 'The hypothesis was tested using a randomized controlled experimental design.', 'Hipotez, randomize kontrollü bir deneysel desen kullanılarak sınanmıştır.', 21, NOW()),
    (v_list_id, 'indicate', 'belirtmek, göstermek', 'Preliminary results indicate a strong link between sleep and academic performance.', 'Ön sonuçlar, uyku ile akademik performans arasında güçlü bir ilişki olduğunu göstermektedir.', 22, NOW()),
    (v_list_id, 'infer', 'çıkarım yapmak', 'Readers must infer the author''s stance from subtle textual cues.', 'Okuyucular, yazarın tutumunu metindeki ince ipuçlarından çıkarsamak zorundadır.', 23, NOW()),
    (v_list_id, 'inherent', 'doğasında bulunan, içkin', 'There are inherent limitations in any retrospective study design.', 'Geriye dönük araştırma desenlerinde içkin sınırlılıklar bulunmaktadır.', 24, NOW()),
    (v_list_id, 'interpret', 'yorumlamak', 'Statistical results must be interpreted within the boundaries of the study design.', 'İstatistiksel sonuçlar, çalışma deseninin sınırları içinde yorumlanmalıdır.', 25, NOW()),
    (v_list_id, 'methodology', 'metodoloji, yöntem bilimi', 'The methodology section transparently reports each step of the data analysis.', 'Yöntem bölümü, veri analizinin her adımını şeffaf biçimde raporlamaktadır.', 26, NOW()),
    (v_list_id, 'paradigm', 'paradigma, model', 'A paradigm shift in cognitive science followed the rise of neural imaging.', 'Bilişsel bilimde bir paradigma değişikliği, sinirsel görüntülemenin yükselişiyle gerçekleşmiştir.', 27, NOW()),
    (v_list_id, 'plausible', 'akla yatkın, makul', 'Several plausible explanations remain consistent with the observed pattern.', 'Birkaç akla yatkın açıklama, gözlemlenen örüntüyle uyumlu olmayı sürdürmektedir.', 28, NOW()),
    (v_list_id, 'posit', 'ileri sürmek, varsaymak', 'The author posits that informal networks shape career trajectories.', 'Yazar, gayri resmi ağların kariyer yörüngelerini şekillendirdiğini ileri sürmektedir.', 29, NOW()),
    (v_list_id, 'postulate', 'önesürmek, varsaymak', 'The theory postulates a hidden variable that mediates the observed effect.', 'Kuram, gözlenen etkiye aracılık eden gizli bir değişken varsaymaktadır.', 30, NOW()),
    (v_list_id, 'preliminary', 'ön, hazırlık niteliğinde', 'These preliminary findings must be confirmed by larger follow-up studies.', 'Bu ön bulguların, daha geniş takip çalışmalarıyla doğrulanması gerekmektedir.', 31, NOW()),
    (v_list_id, 'qualitative', 'nitel, niteliksel', 'Qualitative interviews uncovered themes that the survey had failed to capture.', 'Nitel görüşmeler, anketin yakalayamadığı temaları açığa çıkarmıştır.', 32, NOW()),
    (v_list_id, 'quantitative', 'nicel, sayısal', 'A quantitative analysis provides the statistical backbone of the report.', 'Bir nicel analiz, raporun istatistiksel omurgasını oluşturmaktadır.', 33, NOW()),
    (v_list_id, 'rationale', 'gerekçe, mantıksal temel', 'The rationale for excluding outliers is explained in detail in the appendix.', 'Aykırı değerleri dışlamanın gerekçesi, ekte ayrıntılı biçimde açıklanmaktadır.', 34, NOW()),
    (v_list_id, 'refute', 'çürütmek, yalanlamak', 'The new evidence appears to refute the dominant explanation of the phenomenon.', 'Yeni kanıtlar, fenomenin baskın açıklamasını çürütüyor görünmektedir.', 35, NOW()),
    (v_list_id, 'reliable', 'güvenilir', 'A reliable instrument yields consistent results across repeated measurements.', 'Güvenilir bir ölçme aracı, tekrarlanan ölçümlerde tutarlı sonuçlar üretir.', 36, NOW()),
    (v_list_id, 'replicate', 'tekrarlamak, kopyalamak', 'Independent teams later replicated the original study with similar results.', 'Bağımsız ekipler, daha sonra özgün çalışmayı benzer sonuçlarla yinelemiştir.', 37, NOW()),
    (v_list_id, 'rigor', 'titizlik, sıkılık', 'Methodological rigor strongly influences how journals evaluate submitted manuscripts.', 'Yöntemsel titizlik, dergilerin gönderilen makaleleri nasıl değerlendirdiğini güçlü biçimde etkiler.', 38, NOW()),
    (v_list_id, 'scrutinize', 'incelemek, dikkatle gözden geçirmek', 'Reviewers scrutinize statistical procedures for any sign of methodological weakness.', 'Hakemler, yöntemsel zayıflık belirtisi açısından istatistiksel prosedürleri dikkatle inceler.', 39, NOW()),
    (v_list_id, 'speculation', 'spekülasyon, kurgusal düşünme', 'Without further data, any conclusion remains pure speculation.', 'Ek veri olmaksızın herhangi bir sonuç, salt spekülasyondan ibaret kalır.', 40, NOW()),
    (v_list_id, 'substantiate', 'kanıtlarla desteklemek', 'The authors substantiate their claims with data from three independent sources.', 'Yazarlar, iddialarını üç bağımsız kaynaktan elde edilen verilerle desteklemektedir.', 41, NOW()),
    (v_list_id, 'taxonomy', 'sınıflandırma, taksonomi', 'The proposed taxonomy organizes learning strategies into five distinct categories.', 'Önerilen sınıflandırma, öğrenme stratejilerini beş ayrı kategoride düzenlemektedir.', 42, NOW()),
    (v_list_id, 'tentative', 'geçici, kesinleşmemiş', 'These conclusions are tentative and may change as additional data emerge.', 'Bu sonuçlar geçicidir ve ek veriler ortaya çıktıkça değişebilir.', 43, NOW()),
    (v_list_id, 'thereby', 'böylelikle, bu sayede', 'The reform raised teacher salaries, thereby improving retention in rural schools.', 'Reform, öğretmen maaşlarını artırmış ve böylelikle kırsal okullarda görevde kalma oranını iyileştirmiştir.', 44, NOW()),
    (v_list_id, 'threshold', 'eşik, sınır değer', 'Symptoms become clinically significant only above a defined threshold.', 'Belirtiler, ancak tanımlı bir eşiğin üzerinde klinik açıdan anlamlı hâle gelir.', 45, NOW()),
    (v_list_id, 'undermine', 'zayıflatmak, baltalamak', 'Inconsistent reporting standards undermine confidence in the published literature.', 'Tutarsız raporlama standartları, yayımlanmış literatüre olan güveni zayıflatmaktadır.', 46, NOW()),
    (v_list_id, 'validate', 'doğrulamak, geçerli kılmak', 'The questionnaire was validated through pilot testing with a similar population.', 'Anket, benzer bir popülasyonda yapılan pilot uygulamayla geçerli kılınmıştır.', 47, NOW()),
    (v_list_id, 'variable', 'değişken', 'Each independent variable was manipulated under strictly controlled conditions.', 'Her bir bağımsız değişken, sıkı biçimde kontrol edilen koşullar altında değiştirilmiştir.', 48, NOW()),
    (v_list_id, 'verify', 'doğrulamak, kontrol etmek', 'Researchers must verify the integrity of their data before running any analysis.', 'Araştırmacılar, herhangi bir analiz yapmadan önce verilerinin bütünlüğünü doğrulamalıdır.', 49, NOW()),
    (v_list_id, 'yield', 'sağlamak, üretmek', 'Larger samples typically yield more precise statistical estimates.', 'Daha büyük örneklemler, genellikle daha kesin istatistiksel kestirimler sağlar.', 50, NOW());
END $$;

-- END YOKDIL PACK
