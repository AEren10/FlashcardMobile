-- BEGIN TOEFL PACK

-- =====================================================================
-- LIST 1/5: TOEFL · Tanışma (30 kelime, Orta)
-- =====================================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('TOEFL · Tanışma', 'TOEFL iBT''ye hızlı başlangıç — 30 temel kelime', 'Orta', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'abstract', 'soyut, kuramsal', 'The lecture explored abstract concepts of justice that have shaped Western philosophy.', 'Ders, Batı felsefesini şekillendiren soyut adalet kavramlarını inceledi.', 1, NOW()),
    (v_list_id, 'acquire', 'edinmek, kazanmak', 'Children acquire language skills more rapidly than adults during early development.', 'Çocuklar erken gelişim döneminde dil becerilerini yetişkinlerden daha hızlı edinir.', 2, NOW()),
    (v_list_id, 'adapt', 'uyum sağlamak, uyarlamak', 'Many desert species adapt to extreme temperatures through specialized physiological mechanisms.', 'Birçok çöl türü, özelleşmiş fizyolojik mekanizmalarla aşırı sıcaklığa uyum sağlar.', 3, NOW()),
    (v_list_id, 'analyze', 'analiz etmek, çözümlemek', 'Historians analyze primary sources to reconstruct events from previous centuries.', 'Tarihçiler önceki yüzyıllardaki olayları yeniden kurmak için birincil kaynakları çözümler.', 4, NOW()),
    (v_list_id, 'approach', 'yaklaşım, yöntem', 'A multidisciplinary approach is essential when studying complex social systems.', 'Karmaşık sosyal sistemleri incelerken disiplinlerarası bir yaklaşım vazgeçilmezdir.', 5, NOW()),
    (v_list_id, 'aspect', 'yön, görünüş', 'Each aspect of cellular metabolism contributes to the overall energy balance.', 'Hücresel metabolizmanın her yönü genel enerji dengesine katkıda bulunur.', 6, NOW()),
    (v_list_id, 'assess', 'değerlendirmek, ölçmek', 'Researchers assess the long-term impact of deforestation on regional climate patterns.', 'Araştırmacılar ormansızlaşmanın bölgesel iklim örüntülerine uzun vadeli etkisini değerlendirir.', 7, NOW()),
    (v_list_id, 'assume', 'varsaymak, üstlenmek', 'Early astronomers assumed the Earth occupied the center of the universe.', 'Erken astronomlar Dünya''nın evrenin merkezinde olduğunu varsaymıştı.', 8, NOW()),
    (v_list_id, 'available', 'mevcut, erişilebilir', 'New data became available after the satellite completed its orbital survey.', 'Uydu yörünge taramasını tamamladıktan sonra yeni veriler erişilebilir hale geldi.', 9, NOW()),
    (v_list_id, 'benefit', 'fayda, yarar', 'Bilingual education offers cognitive benefits well into adulthood.', 'İki dilli eğitim, yetişkinliğe kadar uzanan bilişsel faydalar sunar.', 10, NOW()),
    (v_list_id, 'comprise', 'oluşmak, içermek', 'The solar system comprises eight planets and numerous smaller celestial bodies.', 'Güneş sistemi sekiz gezegenden ve çok sayıda küçük gök cisminden oluşur.', 11, NOW()),
    (v_list_id, 'concept', 'kavram, fikir', 'The concept of relativity transformed physics in the early twentieth century.', 'Görelilik kavramı yirminci yüzyılın başında fiziği dönüştürdü.', 12, NOW()),
    (v_list_id, 'consist', 'oluşmak, ibaret olmak', 'Sedimentary rocks consist of compacted layers of mineral and organic material.', 'Tortul kayaçlar mineral ve organik malzemenin sıkışmış katmanlarından oluşur.', 13, NOW()),
    (v_list_id, 'context', 'bağlam, ortam', 'Words can shift meaning depending on the cultural context of their use.', 'Kelimeler kullanıldıkları kültürel bağlama göre anlam değiştirebilir.', 14, NOW()),
    (v_list_id, 'crucial', 'çok önemli, hayati', 'Photosynthesis plays a crucial role in maintaining atmospheric oxygen levels.', 'Fotosentez atmosferik oksijen düzeyini korumada hayati bir rol oynar.', 15, NOW()),
    (v_list_id, 'derive', 'türetmek, elde etmek', 'Many modern medicines derive from compounds originally found in tropical plants.', 'Birçok modern ilaç, başlangıçta tropikal bitkilerde bulunan bileşiklerden türetilir.', 16, NOW()),
    (v_list_id, 'establish', 'kurmak, oluşturmak', 'The first universities in Europe were established during the medieval period.', 'Avrupa''daki ilk üniversiteler ortaçağ döneminde kurulmuştur.', 17, NOW()),
    (v_list_id, 'evident', 'açık, belli', 'It is evident from fossil records that mammals diversified after dinosaur extinction.', 'Fosil kayıtlarından memelilerin dinozor neslinin tükenmesinden sonra çeşitlendiği açıktır.', 18, NOW()),
    (v_list_id, 'factor', 'etken, faktör', 'Climate is one of several factors influencing crop yields across continents.', 'İklim, kıtalar genelinde mahsul verimini etkileyen çeşitli faktörlerden biridir.', 19, NOW()),
    (v_list_id, 'feature', 'özellik, nitelik', 'Distinct features of Gothic architecture include pointed arches and ribbed vaults.', 'Gotik mimarinin belirgin özellikleri arasında sivri kemerler ve nervürlü tonozlar bulunur.', 20, NOW()),
    (v_list_id, 'function', 'işlev, görev', 'Each enzyme performs a specific function in the chain of cellular reactions.', 'Her enzim hücresel reaksiyon zincirinde belirli bir işlev görür.', 21, NOW()),
    (v_list_id, 'identify', 'tanımlamak, saptamak', 'Geologists identify rock types by examining their mineral composition.', 'Jeologlar mineral bileşimini inceleyerek kayaç türlerini saptar.', 22, NOW()),
    (v_list_id, 'imply', 'ima etmek, gerektirmek', 'The data imply a strong correlation between literacy rates and economic growth.', 'Veriler okur-yazarlık oranı ile ekonomik büyüme arasında güçlü bir bağıntı olduğunu ima ediyor.', 23, NOW()),
    (v_list_id, 'indicate', 'göstermek, işaret etmek', 'Ice core samples indicate significant climate fluctuations over the past millennia.', 'Buz çekirdeği örnekleri son binyıllarda önemli iklim dalgalanmalarına işaret ediyor.', 24, NOW()),
    (v_list_id, 'maintain', 'sürdürmek, korumak', 'Coral reefs maintain biodiversity by providing habitats for thousands of species.', 'Mercan resifleri binlerce türe yaşam alanı sağlayarak biyoçeşitliliği sürdürür.', 25, NOW()),
    (v_list_id, 'occur', 'meydana gelmek, gerçekleşmek', 'Volcanic eruptions occur along tectonic plate boundaries with predictable frequency.', 'Volkanik patlamalar öngörülebilir sıklıkta tektonik levha sınırları boyunca meydana gelir.', 26, NOW()),
    (v_list_id, 'process', 'süreç, işlem', 'The process of urbanization accelerated dramatically after the industrial revolution.', 'Kentleşme süreci sanayi devriminden sonra çarpıcı biçimde hızlandı.', 27, NOW()),
    (v_list_id, 'require', 'gerektirmek, istemek', 'Effective scientific research requires careful documentation and peer review.', 'Etkili bilimsel araştırma dikkatli belgeleme ve hakem değerlendirmesi gerektirir.', 28, NOW()),
    (v_list_id, 'significant', 'önemli, anlamlı', 'The study found a significant relationship between sleep quality and memory consolidation.', 'Çalışma uyku kalitesi ile bellek pekiştirme arasında anlamlı bir ilişki saptadı.', 29, NOW()),
    (v_list_id, 'utilize', 'kullanmak, yararlanmak', 'Indigenous communities utilize traditional knowledge to manage forest ecosystems sustainably.', 'Yerli topluluklar orman ekosistemlerini sürdürülebilir biçimde yönetmek için geleneksel bilgiyi kullanır.', 30, NOW());
END $$;

-- =====================================================================
-- LIST 2/5: TOEFL · Doğa Bilimleri (40 kelime, İleri)
-- =====================================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('TOEFL · Doğa Bilimleri', 'Biyoloji, kimya, fizik ve ekoloji — 40 akademik kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'adaptation', 'uyum, adaptasyon', 'Camouflage is a behavioral adaptation that improves a prey species'' survival chances.', 'Kamuflaj, av türlerinin hayatta kalma şansını artıran davranışsal bir uyumdur.', 1, NOW()),
    (v_list_id, 'aquatic', 'sucul, suya ait', 'Aquatic plants have specialized tissues that allow gas exchange under water.', 'Sucul bitkiler su altında gaz alışverişine olanak tanıyan özelleşmiş dokulara sahiptir.', 2, NOW()),
    (v_list_id, 'atmospheric', 'atmosferik, atmosfere ait', 'Atmospheric pressure decreases predictably with altitude above sea level.', 'Atmosfer basıncı, deniz seviyesinden yüksekliğe göre öngörülebilir biçimde azalır.', 3, NOW()),
    (v_list_id, 'biodiversity', 'biyolojik çeşitlilik', 'Tropical rainforests contain extraordinary levels of biodiversity per square kilometer.', 'Tropik yağmur ormanları kilometrekare başına olağanüstü düzeyde biyolojik çeşitlilik barındırır.', 4, NOW()),
    (v_list_id, 'catalyst', 'katalizör, hızlandırıcı', 'Enzymes act as biological catalysts that accelerate chemical reactions inside cells.', 'Enzimler, hücre içindeki kimyasal tepkimeleri hızlandıran biyolojik katalizörler olarak işlev görür.', 5, NOW()),
    (v_list_id, 'compound', 'bileşik, karmaşık', 'Water is a chemical compound formed from two hydrogen atoms and one oxygen atom.', 'Su, iki hidrojen ve bir oksijen atomundan oluşan kimyasal bir bileşiktir.', 6, NOW()),
    (v_list_id, 'decompose', 'ayrışmak, çürümek', 'Fungi decompose organic matter, returning vital nutrients to forest soils.', 'Mantarlar organik maddeyi ayrıştırarak yaşamsal besin maddelerini orman toprağına geri verir.', 7, NOW()),
    (v_list_id, 'dense', 'yoğun, sık', 'Neutron stars are extraordinarily dense, packing solar mass into a small sphere.', 'Nötron yıldızları olağanüstü yoğundur ve güneş kütlesini küçük bir küreye sıkıştırır.', 8, NOW()),
    (v_list_id, 'ecosystem', 'ekosistem', 'A coral reef ecosystem supports thousands of interdependent marine species.', 'Mercan resifi ekosistemi birbirine bağımlı binlerce deniz türünü destekler.', 9, NOW()),
    (v_list_id, 'electromagnetic', 'elektromanyetik', 'Visible light is a small portion of the entire electromagnetic spectrum.', 'Görünür ışık tüm elektromanyetik spektrumun küçük bir bölümüdür.', 10, NOW()),
    (v_list_id, 'equilibrium', 'denge, dengelenmiş hal', 'Chemical equilibrium occurs when forward and reverse reaction rates become equal.', 'Kimyasal denge, ileri ve geri tepkime hızlarının eşitlendiği anda gerçekleşir.', 11, NOW()),
    (v_list_id, 'erosion', 'aşınma, erozyon', 'River erosion has carved deep canyons across the arid southwestern landscapes.', 'Nehir aşınması kurak güneybatı arazilerinde derin kanyonlar oymuştur.', 12, NOW()),
    (v_list_id, 'evolutionary', 'evrimsel', 'Whales display fascinating evolutionary connections to ancient terrestrial mammals.', 'Balinalar, antik karasal memelilere yönelik büyüleyici evrimsel bağlantılar sergiler.', 13, NOW()),
    (v_list_id, 'extinct', 'soyu tükenmiş, nesli tükenmiş', 'The dodo became extinct within decades of European contact with Mauritius.', 'Dodo, Avrupalıların Mauritius''a temasından birkaç on yıl sonra nesli tükendi.', 14, NOW()),
    (v_list_id, 'fossil', 'fosil', 'Paleontologists examine fossil teeth to infer the diet of extinct predators.', 'Paleontologlar nesli tükenmiş yırtıcıların beslenmesini çıkarmak için fosil dişleri inceler.', 15, NOW()),
    (v_list_id, 'genetic', 'genetik, kalıtımsal', 'Genetic mutations occasionally produce traits favored by natural selection.', 'Genetik mutasyonlar zaman zaman doğal seçilimin desteklediği özellikler üretir.', 16, NOW()),
    (v_list_id, 'geological', 'jeolojik', 'Geological evidence shows the Himalayas continue to rise a few millimeters annually.', 'Jeolojik kanıtlar Himalayalar''ın yıllık birkaç milimetre yükselmeye devam ettiğini gösterir.', 17, NOW()),
    (v_list_id, 'gravitational', 'kütleçekimsel, yerçekimine ait', 'Jupiter''s gravitational pull protects inner planets from many incoming asteroids.', 'Jüpiter''in kütleçekim etkisi, iç gezegenleri gelen birçok asteroitten korur.', 18, NOW()),
    (v_list_id, 'habitat', 'habitat, yaşam alanı', 'Polar bears depend on sea ice habitat to hunt seals during winter months.', 'Kutup ayıları kış aylarında fok avlamak için deniz buzu habitatına bağımlıdır.', 19, NOW()),
    (v_list_id, 'hypothesis', 'hipotez, varsayım', 'Scientists test each hypothesis through controlled experiments and statistical analysis.', 'Bilim insanları her hipotezi kontrollü deneyler ve istatistiksel analiz yoluyla test eder.', 20, NOW()),
    (v_list_id, 'isotope', 'izotop', 'Carbon isotope ratios allow researchers to date organic remains accurately.', 'Karbon izotop oranları araştırmacıların organik kalıntıları doğru biçimde tarihlendirmesini sağlar.', 21, NOW()),
    (v_list_id, 'magnetic', 'manyetik, mıknatıssal', 'Earth''s magnetic field deflects harmful solar radiation away from the surface.', 'Dünya''nın manyetik alanı zararlı güneş ışınımını yüzeyden uzaklaştırır.', 22, NOW()),
    (v_list_id, 'mineral', 'mineral, maden', 'Quartz is the most abundant mineral found in continental crustal rocks.', 'Kuvars, kıtasal kabuk kayaçlarında bulunan en bol mineraldir.', 23, NOW()),
    (v_list_id, 'molecule', 'molekül', 'A water molecule forms hydrogen bonds with neighboring molecules in liquid state.', 'Bir su molekülü sıvı halde komşu moleküllerle hidrojen bağı oluşturur.', 24, NOW()),
    (v_list_id, 'observational', 'gözlemsel', 'Observational astronomy advanced rapidly after the invention of the optical telescope.', 'Gözlemsel astronomi, optik teleskobun icadından sonra hızla ilerledi.', 25, NOW()),
    (v_list_id, 'organism', 'organizma, canlı', 'A single-celled organism can adapt rapidly to changes in its chemical environment.', 'Tek hücreli bir organizma kimyasal ortamındaki değişimlere hızla uyum sağlayabilir.', 26, NOW()),
    (v_list_id, 'particle', 'parçacık, tanecik', 'Subatomic particles behave differently than predicted by classical mechanics alone.', 'Atomaltı parçacıklar yalnızca klasik mekaniğin öngördüğünden farklı davranır.', 27, NOW()),
    (v_list_id, 'photosynthesis', 'fotosentez', 'Through photosynthesis, plants convert sunlight into chemical energy stored as sugars.', 'Bitkiler fotosentez yoluyla güneş ışığını şeker olarak depolanan kimyasal enerjiye dönüştürür.', 28, NOW()),
    (v_list_id, 'predator', 'yırtıcı, avcı', 'Top predators regulate prey populations and influence vegetation patterns indirectly.', 'En üst düzey yırtıcılar av popülasyonlarını düzenler ve bitki örtüsünü dolaylı yoldan etkiler.', 29, NOW()),
    (v_list_id, 'radioactive', 'radyoaktif', 'Radioactive isotopes decay at predictable rates used for dating ancient rocks.', 'Radyoaktif izotoplar, antik kayaçların yaşının belirlenmesinde kullanılan öngörülebilir hızlarda bozunur.', 30, NOW()),
    (v_list_id, 'sediment', 'tortu, çökelti', 'Layers of sediment accumulate at the bottom of lakes over thousands of years.', 'Tortu katmanları binlerce yıl boyunca göllerin dibinde birikir.', 31, NOW()),
    (v_list_id, 'seismic', 'sismik, depremsel', 'Seismic waves travel through Earth''s interior, revealing its internal structure.', 'Sismik dalgalar Dünya''nın iç yapısını ortaya koyarak iç bölgelerden geçer.', 32, NOW()),
    (v_list_id, 'species', 'tür', 'New species are still being discovered in remote regions of the deep ocean.', 'Derin okyanusun uzak bölgelerinde hâlâ yeni türler keşfedilmektedir.', 33, NOW()),
    (v_list_id, 'subatomic', 'atomaltı', 'Subatomic interactions are governed by forces invisible at macroscopic scales.', 'Atomaltı etkileşimler makroskopik ölçeklerde görünmeyen kuvvetlerce yönetilir.', 34, NOW()),
    (v_list_id, 'symbiosis', 'simbiyoz, ortak yaşam', 'Lichens demonstrate symbiosis between fungi and photosynthetic algal partners.', 'Likenler, mantarlar ile fotosentetik alg ortakları arasındaki simbiyozu örnekler.', 35, NOW()),
    (v_list_id, 'tectonic', 'tektonik', 'Tectonic plate movements have shaped continents over hundreds of millions of years.', 'Tektonik levha hareketleri kıtaları yüz milyonlarca yıl boyunca şekillendirmiştir.', 36, NOW()),
    (v_list_id, 'terrestrial', 'karasal, kara üzerinde', 'Terrestrial vertebrates evolved from aquatic ancestors during the Devonian period.', 'Karasal omurgalılar, Devon döneminde sucul atalardan evrimleşmiştir.', 37, NOW()),
    (v_list_id, 'thermal', 'ısıl, termal', 'Ocean thermal currents redistribute energy from equatorial regions toward the poles.', 'Okyanus ısıl akıntıları enerjiyi ekvator bölgelerinden kutuplara doğru yeniden dağıtır.', 38, NOW()),
    (v_list_id, 'velocity', 'hız, sürat', 'The escape velocity required to leave Earth''s gravity is approximately eleven kilometers per second.', 'Dünya''nın çekiminden kurtulmak için gereken kaçış hızı yaklaşık saniyede on bir kilometredir.', 39, NOW()),
    (v_list_id, 'volcanic', 'volkanik', 'Volcanic activity enriches surrounding soils with minerals essential for plant growth.', 'Volkanik etkinlik çevredeki toprakları bitki gelişimi için gerekli minerallerle zenginleştirir.', 40, NOW());
END $$;

-- =====================================================================
-- LIST 3/5: TOEFL · Sosyal Bilimler (50 kelime, İleri)
-- =====================================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('TOEFL · Sosyal Bilimler', 'Tarih, sosyoloji, antropoloji ve psikoloji — 50 akademik kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'agriculture', 'tarım, ziraat', 'The development of agriculture transformed nomadic societies into settled communities.', 'Tarımın gelişimi göçebe toplumları yerleşik topluluklara dönüştürmüştür.', 1, NOW()),
    (v_list_id, 'anthropological', 'antropolojik', 'Anthropological studies reveal striking parallels between distant cultural traditions.', 'Antropolojik çalışmalar, uzak kültürel gelenekler arasında çarpıcı benzerlikler ortaya koyar.', 2, NOW()),
    (v_list_id, 'archaeological', 'arkeolojik', 'Recent archaeological discoveries challenge long-held views of early civilization.', 'Son arkeolojik keşifler erken uygarlığa ilişkin köklü görüşleri sorguya çekiyor.', 3, NOW()),
    (v_list_id, 'artifact', 'eser, ürün', 'Each artifact recovered from the burial site offers insight into ritual practice.', 'Mezarlık alanından çıkarılan her eser, ritüel uygulamalara dair bilgi sunar.', 4, NOW()),
    (v_list_id, 'authority', 'otorite, yetki', 'Political authority in many ancient cities rested with hereditary priestly families.', 'Pek çok antik kentte siyasi otorite kalıtsal rahip ailelerinin elindeydi.', 5, NOW()),
    (v_list_id, 'behavioral', 'davranışsal', 'Behavioral economists study how cognitive biases influence everyday consumer choices.', 'Davranışsal iktisatçılar bilişsel önyargıların günlük tüketici tercihlerini nasıl etkilediğini inceler.', 6, NOW()),
    (v_list_id, 'civilization', 'uygarlık, medeniyet', 'Mesopotamian civilization produced some of the earliest written legal codes in history.', 'Mezopotamya uygarlığı tarihteki en erken yazılı hukuk kodlarından bazılarını üretmiştir.', 7, NOW()),
    (v_list_id, 'cognitive', 'bilişsel', 'Cognitive development in early childhood depends heavily on linguistic exposure.', 'Erken çocukluk dönemindeki bilişsel gelişim büyük ölçüde dilsel maruziyete bağlıdır.', 8, NOW()),
    (v_list_id, 'colonial', 'sömürgeci, kolonyal', 'Colonial administrations frequently imposed foreign legal systems on indigenous populations.', 'Sömürge yönetimleri yerli halklara sıklıkla yabancı hukuk sistemleri dayatmıştır.', 9, NOW()),
    (v_list_id, 'colonization', 'sömürgeleştirme, koloni kurma', 'European colonization dramatically altered demographic patterns across the Americas.', 'Avrupa''nın sömürgeleştirmesi, Amerika kıtaları genelinde demografik örüntüleri çarpıcı biçimde değiştirdi.', 10, NOW()),
    (v_list_id, 'consensus', 'uzlaşı, oydaşma', 'Scholarly consensus on the origins of human language remains elusive.', 'İnsan dilinin kökenleri konusunda akademik uzlaşı hâlâ ulaşılamaz durumda.', 11, NOW()),
    (v_list_id, 'cultural', 'kültürel', 'Cultural exchange along the Silk Road shaped art and cuisine across continents.', 'İpek Yolu boyunca yaşanan kültürel alışveriş, kıtalar arasında sanatı ve mutfağı şekillendirdi.', 12, NOW()),
    (v_list_id, 'demographic', 'demografik, nüfusbilimsel', 'Demographic shifts driven by urbanization have reshaped twenty-first century cities.', 'Kentleşmenin tetiklediği demografik kaymalar yirmi birinci yüzyıl şehirlerini yeniden biçimlendirdi.', 13, NOW()),
    (v_list_id, 'discipline', 'disiplin, bilim dalı', 'Sociology emerged as an academic discipline in the late nineteenth century.', 'Sosyoloji on dokuzuncu yüzyılın sonlarında akademik bir disiplin olarak ortaya çıktı.', 14, NOW()),
    (v_list_id, 'doctrine', 'doktrin, öğreti', 'Confucian doctrine influenced governance and family life throughout East Asia.', 'Konfüçyüsçü öğreti, Doğu Asya boyunca yönetimi ve aile yaşamını etkilemiştir.', 15, NOW()),
    (v_list_id, 'dominant', 'baskın, hâkim', 'Latin remained the dominant scholarly language in Europe well into the eighteenth century.', 'Latince, Avrupa''da on sekizinci yüzyıla kadar hâkim akademik dil olarak kaldı.', 16, NOW()),
    (v_list_id, 'dynasty', 'hanedan, sülale', 'The Tang dynasty oversaw an unprecedented flourishing of poetry and visual art.', 'Tang hanedanı şiir ve görsel sanatlarda eşi görülmemiş bir gelişmeye öncülük etti.', 17, NOW()),
    (v_list_id, 'economic', 'ekonomik, iktisadi', 'Economic policies of the New Deal reshaped American government for generations.', 'New Deal''in ekonomik politikaları Amerikan hükümetini kuşaklar boyunca yeniden şekillendirdi.', 18, NOW()),
    (v_list_id, 'emigration', 'göç etme, dışa göç', 'Mass emigration from rural areas drove the growth of nineteenth-century industrial cities.', 'Kırsal bölgelerden kitlesel dışa göç, on dokuzuncu yüzyıl sanayi kentlerinin büyümesini sağladı.', 19, NOW()),
    (v_list_id, 'empire', 'imparatorluk', 'The Roman empire integrated diverse peoples through law, language, and infrastructure.', 'Roma imparatorluğu farklı halkları hukuk, dil ve altyapı yoluyla bütünleştirmiştir.', 20, NOW()),
    (v_list_id, 'ethnic', 'etnik, kavmî', 'Ethnic identity in border regions often defies simple national categorization.', 'Sınır bölgelerindeki etnik kimlik, basit ulusal sınıflandırmalara çoğu zaman meydan okur.', 21, NOW()),
    (v_list_id, 'governance', 'yönetişim, yönetim', 'Effective governance requires balancing accountability, transparency, and public participation.', 'Etkili yönetişim hesap verebilirlik, şeffaflık ve halk katılımının dengelenmesini gerektirir.', 22, NOW()),
    (v_list_id, 'heritage', 'miras, kültürel miras', 'UNESCO recognizes thousands of sites of outstanding cultural and natural heritage.', 'UNESCO, olağanüstü kültürel ve doğal mirasa sahip binlerce alanı tanımaktadır.', 23, NOW()),
    (v_list_id, 'hierarchy', 'hiyerarşi, kademe', 'Strict social hierarchy in feudal Japan limited movement between economic classes.', 'Feodal Japonya''daki katı toplumsal hiyerarşi ekonomik sınıflar arası geçişi kısıtladı.', 24, NOW()),
    (v_list_id, 'ideology', 'ideoloji, görüş', 'Competing political ideologies dominated international relations throughout the Cold War.', 'Birbirine rakip siyasi ideolojiler, Soğuk Savaş boyunca uluslararası ilişkilere hâkim oldu.', 25, NOW()),
    (v_list_id, 'indigenous', 'yerli, otokton', 'Indigenous oral traditions preserve historical knowledge that written records sometimes omit.', 'Yerli sözlü gelenekler, yazılı kayıtların zaman zaman atladığı tarihsel bilgiyi korur.', 26, NOW()),
    (v_list_id, 'industrial', 'sanayiye ait, endüstriyel', 'The industrial revolution accelerated technological change throughout nineteenth-century Britain.', 'Sanayi devrimi on dokuzuncu yüzyıl Britanya''sında teknolojik değişimi hızlandırdı.', 27, NOW()),
    (v_list_id, 'institution', 'kurum, müessese', 'Educational institutions adapt slowly to rapid shifts in workforce expectations.', 'Eğitim kurumları iş gücü beklentilerindeki hızlı değişimlere yavaş uyum sağlar.', 28, NOW()),
    (v_list_id, 'irrigation', 'sulama', 'Sophisticated irrigation systems enabled agriculture in the arid Mesopotamian plains.', 'Gelişmiş sulama sistemleri kurak Mezopotamya ovalarında tarımı mümkün kıldı.', 29, NOW()),
    (v_list_id, 'kinship', 'akrabalık, hısımlık', 'Kinship networks structured economic cooperation in many pre-modern societies.', 'Akrabalık ağları, modern öncesi pek çok toplumda ekonomik işbirliğini yapılandırdı.', 30, NOW()),
    (v_list_id, 'literacy', 'okur-yazarlık', 'Rising literacy rates accompanied the spread of printed books across Renaissance Europe.', 'Artan okur-yazarlık oranları, Rönesans Avrupası''nda basılı kitabın yayılmasıyla birlikte gelişti.', 31, NOW()),
    (v_list_id, 'migration', 'göç, taşınma', 'Patterns of human migration have shaped languages, religions, and cuisines globally.', 'İnsan göçü örüntüleri küresel ölçekte dilleri, dinleri ve mutfakları biçimlendirdi.', 32, NOW()),
    (v_list_id, 'monarchy', 'monarşi, krallık', 'Constitutional monarchy emerged gradually as parliaments gained legislative supremacy.', 'Parlamentolar yasama üstünlüğü kazandıkça anayasal monarşi yavaş yavaş ortaya çıktı.', 33, NOW()),
    (v_list_id, 'nomadic', 'göçebe', 'Nomadic herding societies adapted to harsh steppe climates over centuries.', 'Göçebe çobanlık toplumları yüzyıllar boyunca sert step ikliminin koşullarına uyum sağladı.', 34, NOW()),
    (v_list_id, 'norm', 'norm, ölçüt', 'Social norms regulate behavior even in the absence of explicit legal codes.', 'Toplumsal normlar açık yasal düzenlemelerin yokluğunda bile davranışı düzenler.', 35, NOW()),
    (v_list_id, 'paradigm', 'paradigma, model', 'A new paradigm emerges when old theories repeatedly fail to explain observations.', 'Eski kuramlar gözlemleri tutarlı biçimde açıklayamadığında yeni bir paradigma ortaya çıkar.', 36, NOW()),
    (v_list_id, 'patriarchal', 'ataerkil', 'Many ancient legal systems were strongly patriarchal in inheritance and property rights.', 'Birçok antik hukuk sistemi miras ve mülkiyet haklarında güçlü biçimde ataerkildi.', 37, NOW()),
    (v_list_id, 'philosophical', 'felsefi', 'Enlightenment philosophical writings inspired political revolutions across two continents.', 'Aydınlanma felsefi yazıları iki kıtada siyasi devrimlere ilham verdi.', 38, NOW()),
    (v_list_id, 'population', 'nüfus', 'Rapid population growth pressured agricultural systems during the eighteenth century.', 'Hızlı nüfus artışı on sekizinci yüzyılda tarım sistemleri üzerinde baskı oluşturdu.', 39, NOW()),
    (v_list_id, 'prehistoric', 'tarihöncesi', 'Prehistoric cave paintings provide rare glimpses into early symbolic thought.', 'Tarihöncesi mağara resimleri erken simgesel düşünceye dair nadir bakışlar sunar.', 40, NOW()),
    (v_list_id, 'religious', 'dinsel, dini', 'Religious institutions historically controlled significant economic and educational resources.', 'Dini kurumlar tarihsel olarak önemli ekonomik ve eğitsel kaynakları denetlemiştir.', 41, NOW()),
    (v_list_id, 'revolution', 'devrim, ihtilal', 'The French Revolution redefined the relationship between citizens and the state.', 'Fransız Devrimi vatandaşlar ile devlet arasındaki ilişkiyi yeniden tanımladı.', 42, NOW()),
    (v_list_id, 'ritual', 'ritüel, ayin', 'Coming-of-age rituals mark important social transitions in many traditional cultures.', 'Erginlik ritüelleri pek çok geleneksel kültürde önemli toplumsal geçişleri belirler.', 43, NOW()),
    (v_list_id, 'secular', 'laik, dünyevi', 'Secular education expanded rapidly after the separation of church and state.', 'Din ve devlet ayrılığının ardından laik eğitim hızla genişledi.', 44, NOW()),
    (v_list_id, 'settlement', 'yerleşim, iskân', 'Permanent settlement along river valleys preceded the rise of organized agriculture.', 'Nehir vadileri boyunca kalıcı yerleşim, örgütlü tarımın yükselişinden önce gerçekleşti.', 45, NOW()),
    (v_list_id, 'sociological', 'sosyolojik', 'Sociological research examines how institutions shape individual life trajectories.', 'Sosyolojik araştırma, kurumların bireysel yaşam yörüngelerini nasıl şekillendirdiğini inceler.', 46, NOW()),
    (v_list_id, 'sovereignty', 'egemenlik', 'National sovereignty has been redefined repeatedly through international treaty agreements.', 'Ulusal egemenlik, uluslararası antlaşma anlaşmaları yoluyla defalarca yeniden tanımlanmıştır.', 47, NOW()),
    (v_list_id, 'tradition', 'gelenek, görenek', 'Oral tradition transmits historical narratives across generations without written records.', 'Sözlü gelenek, tarihsel anlatıları yazılı kayıt olmaksızın kuşaklar boyu aktarır.', 48, NOW()),
    (v_list_id, 'urbanization', 'kentleşme, şehirleşme', 'Rapid urbanization in the nineteenth century transformed labor markets across Europe.', 'On dokuzuncu yüzyıldaki hızlı kentleşme Avrupa''daki iş gücü piyasalarını dönüştürdü.', 49, NOW()),
    (v_list_id, 'welfare', 'refah, sosyal yardım', 'Modern welfare states emerged after World War II in many European democracies.', 'Modern refah devletleri pek çok Avrupa demokrasisinde İkinci Dünya Savaşı sonrasında ortaya çıktı.', 50, NOW());
END $$;

-- =====================================================================
-- LIST 4/5: TOEFL · Lecture Vocabulary (40 kelime, İleri)
-- =====================================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('TOEFL · Lecture Vocabulary', 'Üniversite dersi kapsamında sık geçen 40 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'accumulate', 'biriktirmek, toplanmak', 'Sediments accumulate gradually on lake beds, forming records of ancient climates.', 'Tortular göl tabanlarında zamanla birikerek antik iklimlerin kayıtlarını oluşturur.', 1, NOW()),
    (v_list_id, 'advocate', 'savunmak, savunucu', 'Some economists advocate progressive taxation as a remedy for inequality.', 'Bazı iktisatçılar artan oranlı vergilendirmeyi eşitsizliğe çare olarak savunur.', 2, NOW()),
    (v_list_id, 'arbitrary', 'keyfi, gelişigüzel', 'Early classifications of plants often appeared arbitrary to modern taxonomists.', 'Bitkilerin erken sınıflandırmaları modern taksonomistlere çoğu zaman keyfi göründü.', 3, NOW()),
    (v_list_id, 'attribute', 'atfetmek, özellik', 'Historians attribute the empire''s collapse to multiple interacting causes.', 'Tarihçiler imparatorluğun çöküşünü birbirini etkileyen birden çok nedene atfeder.', 4, NOW()),
    (v_list_id, 'characterize', 'nitelendirmek, betimlemek', 'Romantic painters characterized landscapes through emotion rather than precise documentation.', 'Romantik ressamlar manzaraları kesin belgeleme yerine duygu yoluyla betimledi.', 5, NOW()),
    (v_list_id, 'comprehensive', 'kapsamlı, geniş kapsamlı', 'A comprehensive theory must account for both expected and exceptional cases.', 'Kapsamlı bir kuram hem beklenen hem de istisnai durumları açıklamalıdır.', 6, NOW()),
    (v_list_id, 'consequently', 'sonuç olarak, dolayısıyla', 'The trade routes collapsed, and consequently regional economies contracted dramatically.', 'Ticaret yolları çöktü ve sonuç olarak bölgesel ekonomiler çarpıcı biçimde daraldı.', 7, NOW()),
    (v_list_id, 'considerable', 'önemli, hatırı sayılır', 'Considerable evidence supports the dating of these manuscripts to the twelfth century.', 'Hatırı sayılır miktarda kanıt bu el yazmalarının on ikinci yüzyıla tarihlendirilmesini destekler.', 8, NOW()),
    (v_list_id, 'contradict', 'çelişmek, yalanlamak', 'Recent findings contradict the assumption that mammals avoided dinosaur-dominated ecosystems.', 'Son bulgular memelilerin dinozorların hâkim olduğu ekosistemlerden kaçındığı varsayımıyla çelişiyor.', 9, NOW()),
    (v_list_id, 'demonstrate', 'göstermek, kanıtlamak', 'The experiment clearly demonstrates how plants respond to varying light wavelengths.', 'Deney bitkilerin farklı ışık dalga boylarına nasıl tepki verdiğini açıkça gösterir.', 10, NOW()),
    (v_list_id, 'designate', 'belirlemek, atamak', 'Geographers designate certain river valleys as critical wildlife migration corridors.', 'Coğrafyacılar bazı nehir vadilerini kritik yaban hayatı göç koridorları olarak belirler.', 11, NOW()),
    (v_list_id, 'distinguish', 'ayırt etmek, ayırmak', 'Linguists distinguish dialects from languages using both structural and social criteria.', 'Dilbilimciler hem yapısal hem de toplumsal ölçütler kullanarak lehçeleri dillerden ayırır.', 12, NOW()),
    (v_list_id, 'diverse', 'çeşitli, farklı', 'Tropical reefs harbor a diverse community of fish, corals, and invertebrates.', 'Tropik resifler çeşitli balık, mercan ve omurgasız topluluğunu barındırır.', 13, NOW()),
    (v_list_id, 'elaborate', 'ayrıntılandırmak, ayrıntılı', 'Renaissance artists developed elaborate techniques for representing perspective on flat surfaces.', 'Rönesans sanatçıları düz yüzeylerde perspektifi temsil etmek için ayrıntılı teknikler geliştirdi.', 14, NOW()),
    (v_list_id, 'empirical', 'deneysel, görgül', 'Empirical observation eventually displaced purely theoretical reasoning in early modern science.', 'Erken modern bilimde deneysel gözlem zamanla salt kuramsal düşünceyi geride bıraktı.', 15, NOW()),
    (v_list_id, 'encompass', 'kapsamak, içermek', 'Anthropology encompasses biological, cultural, linguistic, and archaeological subfields.', 'Antropoloji biyolojik, kültürel, dilsel ve arkeolojik alt alanları kapsar.', 16, NOW()),
    (v_list_id, 'evidence', 'kanıt, delil', 'Evidence from multiple independent sources strengthens any historical reconstruction.', 'Birden çok bağımsız kaynaktan gelen kanıt herhangi bir tarihsel yeniden inşayı güçlendirir.', 17, NOW()),
    (v_list_id, 'fundamental', 'temel, esas', 'A fundamental shift in worldview occurred during the scientific revolution.', 'Bilim devrimi sırasında dünya görüşünde temel bir kayma yaşandı.', 18, NOW()),
    (v_list_id, 'illustrate', 'örneklendirmek, göstermek', 'Case studies illustrate how individual choices aggregate into market-level outcomes.', 'Vaka çalışmaları bireysel tercihlerin piyasa düzeyindeki sonuçlara nasıl dönüştüğünü örnekler.', 19, NOW()),
    (v_list_id, 'implication', 'sonuç, ima', 'The findings have important implications for educational policy in rural communities.', 'Bulguların kırsal topluluklardaki eğitim politikası için önemli sonuçları vardır.', 20, NOW()),
    (v_list_id, 'inherent', 'doğasında olan, içkin', 'There is an inherent tension between individual rights and collective security goals.', 'Bireysel haklarla toplu güvenlik hedefleri arasında doğası gereği bir gerilim vardır.', 21, NOW()),
    (v_list_id, 'integrate', 'bütünleştirmek, kaynaştırmak', 'Effective curricula integrate quantitative reasoning into humanities coursework.', 'Etkili müfredatlar nicel akıl yürütmeyi beşeri bilim derslerine kaynaştırır.', 22, NOW()),
    (v_list_id, 'interpret', 'yorumlamak, anlamlandırmak', 'Scholars interpret literary texts within their original historical contexts.', 'Akademisyenler edebi metinleri özgün tarihsel bağlamları içinde yorumlar.', 23, NOW()),
    (v_list_id, 'invariably', 'değişmez biçimde, her zaman', 'Lectures invariably begin with a brief summary of the previous week''s material.', 'Dersler her zaman önceki haftanın konusunun kısa bir özetiyle başlar.', 24, NOW()),
    (v_list_id, 'manifest', 'açıkça göstermek, belirgin', 'Symptoms of the disease manifest only after the incubation period concludes.', 'Hastalığın belirtileri yalnızca kuluçka süresi sona erdikten sonra açıkça görülür.', 25, NOW()),
    (v_list_id, 'notion', 'kavram, fikir', 'The notion of biological race lacks empirical support in modern genetics.', 'Biyolojik ırk kavramı modern genetikte deneysel destek bulamamaktadır.', 26, NOW()),
    (v_list_id, 'overlook', 'gözden kaçırmak, görmezden gelmek', 'Earlier studies overlooked the role of soil microbes in nutrient cycling.', 'Erken çalışmalar toprak mikroplarının besin döngüsündeki rolünü gözden kaçırdı.', 27, NOW()),
    (v_list_id, 'phenomenon', 'olgu, fenomen', 'The phenomenon of bioluminescence appears across many unrelated marine lineages.', 'Biyolüminesans olgusu birbiriyle akraba olmayan pek çok deniz soyunda görülür.', 28, NOW()),
    (v_list_id, 'plausible', 'akla yatkın, makul', 'The most plausible explanation involves convergent rather than shared ancestry.', 'En akla yatkın açıklama ortak atadan değil, yakınsak evrimden kaynaklanır.', 29, NOW()),
    (v_list_id, 'postulate', 'öne sürmek, varsaymak', 'Some theorists postulate that early language evolved from gestural communication.', 'Bazı kuramcılar erken dilin jestlerle iletişimden evrimleştiğini öne sürer.', 30, NOW()),
    (v_list_id, 'predominant', 'baskın, ağır basan', 'Wheat remained the predominant cereal crop across medieval European farming.', 'Buğday, ortaçağ Avrupa tarımında baskın tahıl ürünü olarak kaldı.', 31, NOW()),
    (v_list_id, 'profound', 'derin, köklü', 'Industrialization had profound consequences for traditional family structures.', 'Sanayileşmenin geleneksel aile yapıları üzerinde köklü sonuçları olmuştur.', 32, NOW()),
    (v_list_id, 'pursuit', 'arayış, kovalama', 'The pursuit of knowledge motivated medieval scholars to translate ancient texts.', 'Bilgi arayışı ortaçağ akademisyenlerini antik metinleri çevirmeye yöneltti.', 33, NOW()),
    (v_list_id, 'reflect', 'yansıtmak, düşünmek', 'Architectural styles reflect both available materials and prevailing aesthetic values.', 'Mimari biçemler hem mevcut malzemeleri hem de hâkim estetik değerleri yansıtır.', 34, NOW()),
    (v_list_id, 'regardless', 'fark etmeksizin, bakmaksızın', 'The principle applies regardless of the specific dataset under analysis.', 'İlke, incelenen veri kümesinden bağımsız olarak geçerlidir.', 35, NOW()),
    (v_list_id, 'scrutinize', 'titizlikle incelemek, irdelemek', 'Peer reviewers scrutinize submitted manuscripts for methodological soundness.', 'Hakem değerlendiriciler sunulan el yazmalarını yöntemsel sağlamlık açısından titizlikle inceler.', 36, NOW()),
    (v_list_id, 'theorize', 'kuramsallaştırmak, kuram öne sürmek', 'Cosmologists theorize about events occurring within the first second of the universe.', 'Kozmologlar evrenin ilk saniyesinde gerçekleşen olaylar hakkında kuram öne sürer.', 37, NOW()),
    (v_list_id, 'undergo', 'geçirmek, maruz kalmak', 'Metamorphic rocks undergo extensive transformation under heat and pressure.', 'Metamorfik kayaçlar ısı ve basınç altında kapsamlı bir dönüşüm geçirir.', 38, NOW()),
    (v_list_id, 'undermine', 'baltalamak, zayıflatmak', 'New genetic evidence undermines older theories about human evolutionary origins.', 'Yeni genetik kanıtlar insanın evrimsel kökenlerine dair eski kuramları zayıflatır.', 39, NOW()),
    (v_list_id, 'widespread', 'yaygın, geniş alana yayılmış', 'Widespread literacy is a relatively recent phenomenon in human history.', 'Yaygın okur-yazarlık insan tarihinde görece yeni bir olgudur.', 40, NOW());
END $$;

-- =====================================================================
-- LIST 5/5: TOEFL · AWL İleri (40 kelime, İleri)
-- =====================================================================
DO $$
DECLARE
  v_list_id UUID;
BEGIN
  INSERT INTO lists (title, description, level, category, is_public, user_id, inserted_at, updated_at)
  VALUES ('TOEFL · AWL İleri', 'Coxhead Akademik Kelime Listesi''nden ileri düzey 40 kelime', 'İleri', 'exam', true, NULL, NOW(), NOW())
  RETURNING id INTO v_list_id;

  INSERT INTO words (list_id, word, meaning, example, example_tr, position, inserted_at) VALUES
    (v_list_id, 'aggregate', 'toplam, kümelemek', 'The aggregate data reveals trends invisible at the individual case level.', 'Toplam veriler bireysel vaka düzeyinde görünmeyen eğilimleri ortaya çıkarır.', 1, NOW()),
    (v_list_id, 'albeit', 'her ne kadar, gerçi', 'The hypothesis is supported, albeit with several important caveats.', 'Hipotez, birkaç önemli çekinceyle de olsa desteklenmektedir.', 2, NOW()),
    (v_list_id, 'ambiguous', 'belirsiz, müphem', 'The original sources are ambiguous regarding the exact date of the treaty.', 'Özgün kaynaklar antlaşmanın kesin tarihi konusunda belirsizdir.', 3, NOW()),
    (v_list_id, 'analogous', 'benzer, kıyaslanabilir', 'A bird''s wing is analogous, but not homologous, to a butterfly''s wing.', 'Bir kuşun kanadı, bir kelebeğin kanadına benzerdir ancak homolog değildir.', 4, NOW()),
    (v_list_id, 'arbitrary', 'keyfi, rastgele', 'Borders drawn by colonial powers were often arbitrary regarding local populations.', 'Sömürgeci güçlerin çizdiği sınırlar yerel halklar açısından çoğu zaman keyfiydi.', 5, NOW()),
    (v_list_id, 'coherent', 'tutarlı, anlaşılır', 'A coherent argument links each premise logically to its eventual conclusion.', 'Tutarlı bir savunma her öncülü mantıksal olarak nihai sonuca bağlar.', 6, NOW()),
    (v_list_id, 'compile', 'derlemek, toplamak', 'Researchers compile census data spanning more than two hundred years.', 'Araştırmacılar iki yüz yılı aşkın süreyi kapsayan nüfus sayımı verilerini derler.', 7, NOW()),
    (v_list_id, 'conducive', 'elverişli, yardımcı', 'Warm shallow seas were conducive to the rapid evolution of early invertebrates.', 'Sığ ılık denizler erken omurgasızların hızlı evrimine elverişliydi.', 8, NOW()),
    (v_list_id, 'constitute', 'oluşturmak, teşkil etmek', 'Hydrogen and helium constitute the vast majority of the observable universe''s mass.', 'Hidrojen ve helyum, gözlemlenebilir evren kütlesinin büyük bölümünü oluşturur.', 9, NOW()),
    (v_list_id, 'contemplate', 'düşünmek, derin düşünmek', 'Philosophers contemplate the relationship between language and thought.', 'Filozoflar dil ile düşünce arasındaki ilişki üzerine derinlemesine düşünür.', 10, NOW()),
    (v_list_id, 'contention', 'iddia, tartışma', 'The contention that all early cities arose along rivers oversimplifies the evidence.', 'Tüm erken kentlerin nehir kenarlarında ortaya çıktığı iddiası kanıtları aşırı basitleştirir.', 11, NOW()),
    (v_list_id, 'corroborate', 'doğrulamak, desteklemek', 'Independent isotope analyses corroborate the radiocarbon dating estimates.', 'Bağımsız izotop analizleri radyokarbon tarihlendirme tahminlerini doğrular.', 12, NOW()),
    (v_list_id, 'disseminate', 'yaymak, dağıtmak', 'Universities disseminate research findings through journals and academic conferences.', 'Üniversiteler araştırma bulgularını dergiler ve akademik konferanslar aracılığıyla yayar.', 13, NOW()),
    (v_list_id, 'elucidate', 'aydınlatmak, açıklamak', 'Recent imaging techniques elucidate the structure of complex protein assemblies.', 'Son görüntüleme teknikleri karmaşık protein topluluklarının yapısını aydınlatır.', 14, NOW()),
    (v_list_id, 'feasible', 'uygulanabilir, yapılabilir', 'Large-scale carbon capture remains technically feasible but economically uncertain.', 'Büyük ölçekli karbon yakalama teknik olarak uygulanabilir ancak ekonomik açıdan belirsizdir.', 15, NOW()),
    (v_list_id, 'inadvertent', 'istemsiz, kasıtsız', 'Inadvertent introduction of invasive species can devastate native ecosystems.', 'İstilacı türlerin istemsiz biçimde getirilmesi yerli ekosistemleri yıkıma uğratabilir.', 16, NOW()),
    (v_list_id, 'incentive', 'teşvik, dürtü', 'Tax incentives encourage corporations to invest in renewable energy projects.', 'Vergi teşvikleri şirketleri yenilenebilir enerji projelerine yatırım yapmaya yönlendirir.', 17, NOW()),
    (v_list_id, 'inherent', 'doğasında olan, içkin', 'There is an inherent unpredictability in chaotic dynamical systems.', 'Kaotik dinamik sistemlerde doğası gereği bir öngörülemezlik vardır.', 18, NOW()),
    (v_list_id, 'innovation', 'yenilik, buluş', 'Agricultural innovation gradually increased crop yields throughout the medieval period.', 'Tarımsal yenilik ortaçağ boyunca mahsul verimini kademeli olarak artırdı.', 19, NOW()),
    (v_list_id, 'intricate', 'karmaşık, ince', 'Intricate trade networks linked Mediterranean cities to inland European markets.', 'Karmaşık ticaret ağları Akdeniz kentlerini iç Avrupa pazarlarına bağladı.', 20, NOW()),
    (v_list_id, 'inversely', 'ters orantılı, tersine', 'Atmospheric pressure varies inversely with elevation above sea level.', 'Atmosfer basıncı, deniz seviyesinden yüksekliğe ters orantılı olarak değişir.', 21, NOW()),
    (v_list_id, 'meticulous', 'titiz, ayrıntıya özen gösteren', 'Meticulous record-keeping by medieval monks preserved many classical texts.', 'Ortaçağ keşişlerinin titiz kayıt tutması pek çok klasik metni koruyup günümüze ulaştırdı.', 22, NOW()),
    (v_list_id, 'mitigate', 'hafifletmek, azaltmak', 'Conservation policies aim to mitigate the effects of habitat fragmentation.', 'Koruma politikaları habitat parçalanmasının etkilerini azaltmayı amaçlar.', 23, NOW()),
    (v_list_id, 'negligible', 'önemsiz, ihmal edilebilir', 'The effect of solar wind on satellite orbits is small but not negligible.', 'Güneş rüzgârının uydu yörüngelerine etkisi küçüktür ancak ihmal edilebilir değildir.', 24, NOW()),
    (v_list_id, 'paradox', 'paradoks, çelişki', 'The Fermi paradox highlights the surprising silence of an apparently vast universe.', 'Fermi paradoksu görünüşte uçsuz bucaksız bir evrenin şaşırtıcı sessizliğine dikkat çeker.', 25, NOW()),
    (v_list_id, 'perpetual', 'sürekli, bitmeyen', 'Glaciers exist in perpetual motion, advancing or retreating with climatic cycles.', 'Buzullar iklim döngüleriyle ilerleyerek veya gerileyerek sürekli hareket halindedir.', 26, NOW()),
    (v_list_id, 'persistent', 'ısrarlı, kalıcı', 'Persistent organic pollutants remain in food chains for many decades.', 'Kalıcı organik kirleticiler besin zincirlerinde onlarca yıl boyunca kalır.', 27, NOW()),
    (v_list_id, 'prevalent', 'yaygın, hâkim', 'Polytheistic worship was prevalent across the eastern Mediterranean before Christianity.', 'Hristiyanlık öncesinde Doğu Akdeniz''de çoktanrılı ibadet yaygındı.', 28, NOW()),
    (v_list_id, 'profound', 'derin, köklü', 'Darwin''s work had a profound influence on biology and broader scientific thought.', 'Darwin''in çalışmaları biyoloji ve daha geniş bilimsel düşünce üzerinde köklü bir etki yarattı.', 29, NOW()),
    (v_list_id, 'proliferate', 'çoğalmak, hızla yayılmak', 'Algae proliferate rapidly when warm waters are enriched with agricultural runoff.', 'Algler, ılık sular tarımsal yüzey akışıyla zenginleştiğinde hızla çoğalır.', 30, NOW()),
    (v_list_id, 'prominent', 'önde gelen, göze çarpan', 'Several prominent geologists challenged the prevailing theory of fixed continents.', 'Önde gelen birkaç jeolog sabit kıtalar kuramına meydan okudu.', 31, NOW()),
    (v_list_id, 'reluctant', 'isteksiz, gönülsüz', 'Many early astronomers were reluctant to accept a non-geocentric universe.', 'Erken astronomların çoğu yer-merkezli olmayan bir evreni kabullenmekte isteksizdi.', 32, NOW()),
    (v_list_id, 'rigorous', 'titiz, sıkı', 'Rigorous statistical testing distinguishes meaningful results from random fluctuations.', 'Titiz istatistiksel testler anlamlı sonuçları rastgele dalgalanmalardan ayırır.', 33, NOW()),
    (v_list_id, 'subsequent', 'sonraki, müteakip', 'Subsequent excavations confirmed the layout suggested by initial aerial photographs.', 'Sonraki kazılar, ilk hava fotoğraflarının önerdiği yerleşim planını doğruladı.', 34, NOW()),
    (v_list_id, 'sustain', 'sürdürmek, desteklemek', 'Coral reefs cannot sustain prolonged exposure to elevated ocean temperatures.', 'Mercan resifleri yüksek okyanus sıcaklıklarına uzun süreli maruz kalmaya dayanamaz.', 35, NOW()),
    (v_list_id, 'synthesis', 'sentez, birleşim', 'A successful synthesis combines insights from anthropology and evolutionary biology.', 'Başarılı bir sentez, antropoloji ile evrimsel biyolojiden gelen kavrayışları birleştirir.', 36, NOW()),
    (v_list_id, 'tangible', 'somut, elle tutulur', 'Archaeology offers tangible evidence of cultures left undocumented in writing.', 'Arkeoloji, yazıda belgelenmemiş kültürlere ilişkin somut kanıtlar sunar.', 37, NOW()),
    (v_list_id, 'underlying', 'altta yatan, temel', 'The underlying cause of mass extinction events often involves multiple stressors.', 'Kitlesel yok oluş olaylarının altında yatan neden çoğu zaman birden fazla baskı içerir.', 38, NOW()),
    (v_list_id, 'unprecedented', 'eşi görülmemiş, emsalsiz', 'The industrial revolution caused an unprecedented surge in atmospheric carbon dioxide.', 'Sanayi devrimi atmosferik karbondioksitte eşi görülmemiş bir artışa yol açtı.', 39, NOW()),
    (v_list_id, 'viable', 'uygulanabilir, yaşayabilir', 'Renewable sources are now a viable alternative to fossil-fuel power generation.', 'Yenilenebilir kaynaklar artık fosil yakıtla elektrik üretimine uygulanabilir bir seçenektir.', 40, NOW());
END $$;

-- END TOEFL PACK
