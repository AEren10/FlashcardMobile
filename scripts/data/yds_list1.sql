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
