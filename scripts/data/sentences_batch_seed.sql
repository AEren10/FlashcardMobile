-- =============================================================
-- sentences_batch_seed.sql
-- 200 yaygın kelime × 3 alternatif cümle = 600 INSERT
-- word_id'yi başlık (word) üzerinden çeker.
-- Çalıştırmadan önce sentences_schema.sql uygulanmış olmalı.
-- =============================================================

-- the
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The book is on the table.', 'Kitap masanın üzerinde.' FROM words WHERE word = 'the' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The sun rises in the east.', 'Güneş doğudan doğar.' FROM words WHERE word = 'the' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please close the door.', 'Lütfen kapıyı kapat.' FROM words WHERE word = 'the' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- be
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to be a doctor.', 'Doktor olmak istiyorum.' FROM words WHERE word = 'be' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please be quiet during class.', 'Lütfen ders sırasında sessiz ol.' FROM words WHERE word = 'be' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She will be here soon.', 'O yakında burada olacak.' FROM words WHERE word = 'be' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- of
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'A cup of tea, please.', 'Bir fincan çay, lütfen.' FROM words WHERE word = 'of' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is the son of a teacher.', 'O bir öğretmenin oğlu.' FROM words WHERE word = 'of' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Most of them agreed.', 'Çoğu kabul etti.' FROM words WHERE word = 'of' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- and
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Bread and butter taste good.', 'Ekmek ve tereyağı güzel.' FROM words WHERE word = 'and' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I came home and slept.', 'Eve geldim ve uyudum.' FROM words WHERE word = 'and' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is kind and funny.', 'O nazik ve komik.' FROM words WHERE word = 'and' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- a
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I saw a cat in the street.', 'Sokakta bir kedi gördüm.' FROM words WHERE word = 'a' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She wants a new bike.', 'Yeni bir bisiklet istiyor.' FROM words WHERE word = 'a' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give me a minute.', 'Bana bir dakika ver.' FROM words WHERE word = 'a' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- in
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The keys are in the drawer.', 'Anahtarlar çekmecede.' FROM words WHERE word = 'in' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He lives in Istanbul.', 'O İstanbul''da yaşıyor.' FROM words WHERE word = 'in' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'See you in an hour.', 'Bir saat sonra görüşürüz.' FROM words WHERE word = 'in' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- that
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That book is mine.', 'O kitap benim.' FROM words WHERE word = 'that' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I think that he is right.', 'Bence o haklı.' FROM words WHERE word = 'that' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you remember that day?', 'O günü hatırlıyor musun?' FROM words WHERE word = 'that' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- have
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have a new phone.', 'Yeni bir telefonum var.' FROM words WHERE word = 'have' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They have two children.', 'İki çocukları var.' FROM words WHERE word = 'have' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Have a nice day!', 'İyi günler!' FROM words WHERE word = 'have' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- I
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love music.', 'Müziği seviyorum.' FROM words WHERE word = 'I' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am a student.', 'Ben bir öğrenciyim.' FROM words WHERE word = 'I' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to go home.', 'Eve gitmek istiyorum.' FROM words WHERE word = 'I' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- it
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is raining outside.', 'Dışarıda yağmur yağıyor.' FROM words WHERE word = 'it' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I read it yesterday.', 'Onu dün okudum.' FROM words WHERE word = 'it' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It looks delicious.', 'Lezzetli görünüyor.' FROM words WHERE word = 'it' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- for
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This gift is for you.', 'Bu hediye senin için.' FROM words WHERE word = 'for' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We waited for an hour.', 'Bir saat bekledik.' FROM words WHERE word = 'for' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Thanks for your help.', 'Yardımın için teşekkürler.' FROM words WHERE word = 'for' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- not
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not understand.', 'Anlamıyorum.' FROM words WHERE word = 'not' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is not at home.', 'O evde değil.' FROM words WHERE word = 'not' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not touch that!', 'Ona dokunma!' FROM words WHERE word = 'not' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- on
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The cat is on the chair.', 'Kedi sandalyenin üzerinde.' FROM words WHERE word = 'on' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We met on Monday.', 'Pazartesi günü tanıştık.' FROM words WHERE word = 'on' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Turn on the light, please.', 'Lütfen ışığı aç.' FROM words WHERE word = 'on' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- with
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I went with my brother.', 'Kardeşimle gittim.' FROM words WHERE word = 'with' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Cut it with a knife.', 'Onu bıçakla kes.' FROM words WHERE word = 'with' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She lives with her parents.', 'Aileleriyle yaşıyor.' FROM words WHERE word = 'with' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- he
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is my best friend.', 'O benim en iyi arkadaşım.' FROM words WHERE word = 'he' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He works at a bank.', 'O bir bankada çalışıyor.' FROM words WHERE word = 'he' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He runs every morning.', 'Her sabah koşuyor.' FROM words WHERE word = 'he' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- as
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She works as a nurse.', 'Hemşire olarak çalışıyor.' FROM words WHERE word = 'as' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is as tall as me.', 'O benim kadar uzun.' FROM words WHERE word = 'as' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do as I say.', 'Dediğimi yap.' FROM words WHERE word = 'as' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- you
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'You are very kind.', 'Çok naziksin.' FROM words WHERE word = 'you' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where do you live?', 'Nerede yaşıyorsun?' FROM words WHERE word = 'you' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I called you yesterday.', 'Dün seni aradım.' FROM words WHERE word = 'you' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- do
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do my homework after school.', 'Okuldan sonra ödevimi yaparım.' FROM words WHERE word = 'do' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What do you do for a living?', 'Geçimini nasıl sağlıyorsun?' FROM words WHERE word = 'do' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not worry about it.', 'Bunun için endişelenme.' FROM words WHERE word = 'do' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- at
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will see you at noon.', 'Seni öğlen göreceğim.' FROM words WHERE word = 'at' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is at the office.', 'O ofiste.' FROM words WHERE word = 'at' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Look at this picture!', 'Bu resme bak!' FROM words WHERE word = 'at' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- this
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is my house.', 'Bu benim evim.' FROM words WHERE word = 'this' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I like this song.', 'Bu şarkıyı seviyorum.' FROM words WHERE word = 'this' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What is this for?', 'Bu ne için?' FROM words WHERE word = 'this' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- but
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I called, but no answer.', 'Aradım ama cevap yoktu.' FROM words WHERE word = 'but' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is small but strong.', 'Küçük ama güçlü.' FROM words WHERE word = 'but' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Everyone came but him.', 'O hariç herkes geldi.' FROM words WHERE word = 'but' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- his
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'His name is Ahmet.', 'Onun adı Ahmet.' FROM words WHERE word = 'his' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I borrowed his book.', 'Onun kitabını ödünç aldım.' FROM words WHERE word = 'his' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'His car is red.', 'Arabası kırmızı.' FROM words WHERE word = 'his' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- by
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The book was written by him.', 'Kitap onun tarafından yazıldı.' FROM words WHERE word = 'by' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Come by bus.', 'Otobüsle gel.' FROM words WHERE word = 'by' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Finish it by Friday.', 'Cumaya kadar bitir.' FROM words WHERE word = 'by' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- from
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am from Turkey.', 'Türkiyeliyim.' FROM words WHERE word = 'from' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'A letter came from him.', 'Ondan bir mektup geldi.' FROM words WHERE word = 'from' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Walk from here to there.', 'Buradan oraya yürü.' FROM words WHERE word = 'from' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- they
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They are my classmates.', 'Onlar sınıf arkadaşlarım.' FROM words WHERE word = 'they' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They live in Ankara.', 'Onlar Ankara''da yaşıyor.' FROM words WHERE word = 'they' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They will help us.', 'Bize yardım edecekler.' FROM words WHERE word = 'they' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- we
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We are friends.', 'Biz arkadaşız.' FROM words WHERE word = 'we' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We went to the park.', 'Parka gittik.' FROM words WHERE word = 'we' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We need more time.', 'Daha fazla zamana ihtiyacımız var.' FROM words WHERE word = 'we' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- say
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Say hello to your mother.', 'Annene selam söyle.' FROM words WHERE word = 'say' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What did he say?', 'O ne dedi?' FROM words WHERE word = 'say' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I say what I think.', 'Düşündüğümü söylerim.' FROM words WHERE word = 'say' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- her
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I like her smile.', 'Onun gülümsemesini seviyorum.' FROM words WHERE word = 'her' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give the book to her.', 'Kitabı ona ver.' FROM words WHERE word = 'her' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Her dress is blue.', 'Onun elbisesi mavi.' FROM words WHERE word = 'her' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- she
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is my sister.', 'O benim kız kardeşim.' FROM words WHERE word = 'she' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She sings beautifully.', 'O çok güzel şarkı söyler.' FROM words WHERE word = 'she' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She arrived late again.', 'O yine geç geldi.' FROM words WHERE word = 'she' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- or
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tea or coffee?', 'Çay mı kahve mi?' FROM words WHERE word = 'or' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Hurry up, or we will be late.', 'Acele et yoksa geç kalırız.' FROM words WHERE word = 'or' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'You can stay or leave.', 'Kalabilir veya gidebilirsin.' FROM words WHERE word = 'or' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- an
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I bought an apple.', 'Bir elma aldım.' FROM words WHERE word = 'an' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is an engineer.', 'O bir mühendis.' FROM words WHERE word = 'an' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It took an hour.', 'Bir saat sürdü.' FROM words WHERE word = 'an' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- will
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will call you later.', 'Seni daha sonra arayacağım.' FROM words WHERE word = 'will' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It will rain tonight.', 'Bu gece yağmur yağacak.' FROM words WHERE word = 'will' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She will be happy to see you.', 'Seni görünce mutlu olacak.' FROM words WHERE word = 'will' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- my
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My name is Eren.', 'Adım Eren.' FROM words WHERE word = 'my' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I lost my keys.', 'Anahtarlarımı kaybettim.' FROM words WHERE word = 'my' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My favorite color is blue.', 'En sevdiğim renk mavi.' FROM words WHERE word = 'my' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- one
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have one brother.', 'Bir erkek kardeşim var.' FROM words WHERE word = 'one' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Choose one card.', 'Bir kart seç.' FROM words WHERE word = 'one' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'One day, I will travel the world.', 'Bir gün dünyayı dolaşacağım.' FROM words WHERE word = 'one' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- all
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'All the students passed.', 'Tüm öğrenciler geçti.' FROM words WHERE word = 'all' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I worked all day.', 'Bütün gün çalıştım.' FROM words WHERE word = 'all' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That is all I know.', 'Bütün bildiğim bu.' FROM words WHERE word = 'all' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- would
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I would like some water.', 'Biraz su istiyorum.' FROM words WHERE word = 'would' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Would you help me?', 'Bana yardım eder misin?' FROM words WHERE word = 'would' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He said he would come.', 'Geleceğini söyledi.' FROM words WHERE word = 'would' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- there
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is a cat in the garden.', 'Bahçede bir kedi var.' FROM words WHERE word = 'there' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Put it over there.', 'Onu oraya koy.' FROM words WHERE word = 'there' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There are many books here.', 'Burada birçok kitap var.' FROM words WHERE word = 'there' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- their
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Their house is huge.', 'Onların evi kocaman.' FROM words WHERE word = 'their' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The kids cleaned their room.', 'Çocuklar odalarını temizledi.' FROM words WHERE word = 'their' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I met their parents.', 'Onların aileleriyle tanıştım.' FROM words WHERE word = 'their' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- what
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What is your name?', 'Adın ne?' FROM words WHERE word = 'what' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What time is it?', 'Saat kaç?' FROM words WHERE word = 'what' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I know what you mean.', 'Ne demek istediğini biliyorum.' FROM words WHERE word = 'what' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- so
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am so tired today.', 'Bugün çok yorgunum.' FROM words WHERE word = 'so' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It was raining, so we stayed home.', 'Yağmur yağıyordu, bu yüzden evde kaldık.' FROM words WHERE word = 'so' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'So, what is your plan?', 'Peki, planın ne?' FROM words WHERE word = 'so' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- up
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Stand up, please.', 'Lütfen ayağa kalk.' FROM words WHERE word = 'up' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Look up at the stars.', 'Yıldızlara yukarı bak.' FROM words WHERE word = 'up' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I get up at seven.', 'Yedide kalkarım.' FROM words WHERE word = 'up' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- out
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Get out of my room!', 'Odamdan çık!' FROM words WHERE word = 'out' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We ate out last night.', 'Dün gece dışarıda yedik.' FROM words WHERE word = 'out' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The fire is out.', 'Ateş söndü.' FROM words WHERE word = 'out' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- if
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'If it rains, stay home.', 'Yağmur yağarsa evde kal.' FROM words WHERE word = 'if' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Ask me if you need help.', 'Yardıma ihtiyacın olursa bana sor.' FROM words WHERE word = 'if' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I wonder if she is coming.', 'Acaba o geliyor mu?' FROM words WHERE word = 'if' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- about
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tell me about your trip.', 'Bana gezini anlat.' FROM words WHERE word = 'about' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is about ten kilometers.', 'Yaklaşık on kilometre.' FROM words WHERE word = 'about' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am worried about him.', 'Onun için endişeleniyorum.' FROM words WHERE word = 'about' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- who
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Who is that man?', 'O adam kim?' FROM words WHERE word = 'who' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I know who did it.', 'Bunu kimin yaptığını biliyorum.' FROM words WHERE word = 'who' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Who wants ice cream?', 'Kim dondurma ister?' FROM words WHERE word = 'who' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- get
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I get the newspaper every morning.', 'Her sabah gazete alırım.' FROM words WHERE word = 'get' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Did you get my message?', 'Mesajımı aldın mı?' FROM words WHERE word = 'get' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is getting cold.', 'Hava soğuyor.' FROM words WHERE word = 'get' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- which
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Which one do you prefer?', 'Hangisini tercih edersin?' FROM words WHERE word = 'which' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The book which I read was great.', 'Okuduğum kitap harikaydı.' FROM words WHERE word = 'which' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Which color do you like?', 'Hangi rengi seversin?' FROM words WHERE word = 'which' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- go
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I go to school by bus.', 'Okula otobüsle giderim.' FROM words WHERE word = 'go' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us go for a walk.', 'Yürüyüşe gidelim.' FROM words WHERE word = 'go' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where did she go?', 'O nereye gitti?' FROM words WHERE word = 'go' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- me
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He gave me a present.', 'Bana bir hediye verdi.' FROM words WHERE word = 'me' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Call me tomorrow.', 'Beni yarın ara.' FROM words WHERE word = 'me' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Wait for me, please.', 'Lütfen beni bekle.' FROM words WHERE word = 'me' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- when
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'When did you arrive?', 'Ne zaman geldin?' FROM words WHERE word = 'when' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will call you when I get home.', 'Eve gelince seni ararım.' FROM words WHERE word = 'when' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'When the rain stops, we will leave.', 'Yağmur dindiğinde gideriz.' FROM words WHERE word = 'when' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- make
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us make a cake.', 'Bir pasta yapalım.' FROM words WHERE word = 'make' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Try not to make noise.', 'Gürültü yapmamaya çalış.' FROM words WHERE word = 'make' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She makes me happy.', 'O beni mutlu ediyor.' FROM words WHERE word = 'make' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- can
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I can speak English.', 'İngilizce konuşabilirim.' FROM words WHERE word = 'can' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Can you help me, please?', 'Bana yardım edebilir misin?' FROM words WHERE word = 'can' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She can swim very well.', 'O çok iyi yüzebilir.' FROM words WHERE word = 'can' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- like
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I like chocolate.', 'Çikolatayı severim.' FROM words WHERE word = 'like' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He runs like the wind.', 'Rüzgar gibi koşar.' FROM words WHERE word = 'like' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Would you like some tea?', 'Biraz çay ister misin?' FROM words WHERE word = 'like' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- time
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What time is the meeting?', 'Toplantı saat kaçta?' FROM words WHERE word = 'time' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Time flies so fast.', 'Zaman çok hızlı geçiyor.' FROM words WHERE word = 'time' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I had a great time.', 'Çok güzel zaman geçirdim.' FROM words WHERE word = 'time' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- no
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'No, thank you.', 'Hayır, teşekkür ederim.' FROM words WHERE word = 'no' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is no milk left.', 'Hiç süt kalmadı.' FROM words WHERE word = 'no' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'No problem, my friend.', 'Sorun değil, dostum.' FROM words WHERE word = 'no' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- just
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I just woke up.', 'Daha yeni uyandım.' FROM words WHERE word = 'just' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Just give me a minute.', 'Sadece bir dakika ver.' FROM words WHERE word = 'just' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That is just perfect!', 'Bu tam mükemmel!' FROM words WHERE word = 'just' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- him
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I saw him yesterday.', 'Onu dün gördüm.' FROM words WHERE word = 'him' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tell him to wait.', 'Ona beklemesini söyle.' FROM words WHERE word = 'him' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I trust him completely.', 'Ona tamamen güveniyorum.' FROM words WHERE word = 'him' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- know
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I know the answer.', 'Cevabı biliyorum.' FROM words WHERE word = 'know' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you know him?', 'Onu tanıyor musun?' FROM words WHERE word = 'know' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not know what to do.', 'Ne yapacağımı bilmiyorum.' FROM words WHERE word = 'know' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- take
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Take an umbrella with you.', 'Yanına bir şemsiye al.' FROM words WHERE word = 'take' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I take the bus to work.', 'İşe otobüsle giderim.' FROM words WHERE word = 'take' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It takes two hours.', 'İki saat sürer.' FROM words WHERE word = 'take' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- people
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Many people came to the party.', 'Partiye birçok insan geldi.' FROM words WHERE word = 'people' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'People love good music.', 'İnsanlar iyi müziği sever.' FROM words WHERE word = 'people' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Some people never give up.', 'Bazı insanlar asla pes etmez.' FROM words WHERE word = 'people' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- into
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He walked into the room.', 'Odaya yürüdü.' FROM words WHERE word = 'into' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Cut the cake into pieces.', 'Pastayı parçalara böl.' FROM words WHERE word = 'into' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am into jazz music.', 'Jaza ilgi duyuyorum.' FROM words WHERE word = 'into' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- year
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Last year was difficult.', 'Geçen yıl zordu.' FROM words WHERE word = 'year' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am thirty years old.', 'Otuz yaşındayım.' FROM words WHERE word = 'year' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'See you next year!', 'Gelecek yıl görüşürüz!' FROM words WHERE word = 'year' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- your
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where is your house?', 'Senin evin nerede?' FROM words WHERE word = 'your' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I like your shoes.', 'Ayakkabılarını beğendim.' FROM words WHERE word = 'your' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Bring your friend along.', 'Arkadaşını da getir.' FROM words WHERE word = 'your' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- good
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is a good idea.', 'Bu iyi bir fikir.' FROM words WHERE word = 'good' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She has a good heart.', 'Onun iyi bir kalbi var.' FROM words WHERE word = 'good' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Have a good night!', 'İyi geceler!' FROM words WHERE word = 'good' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- some
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I need some water.', 'Biraz suya ihtiyacım var.' FROM words WHERE word = 'some' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Some people are very kind.', 'Bazı insanlar çok naziktir.' FROM words WHERE word = 'some' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Take some bread, please.', 'Lütfen biraz ekmek al.' FROM words WHERE word = 'some' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- could
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Could you open the window?', 'Pencereyi açabilir misin?' FROM words WHERE word = 'could' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I could not sleep last night.', 'Dün gece uyuyamadım.' FROM words WHERE word = 'could' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We could go to the cinema.', 'Sinemaya gidebiliriz.' FROM words WHERE word = 'could' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- them
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I gave them some food.', 'Onlara biraz yemek verdim.' FROM words WHERE word = 'them' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tell them the truth.', 'Onlara gerçeği söyle.' FROM words WHERE word = 'them' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will call them tomorrow.', 'Onları yarın arayacağım.' FROM words WHERE word = 'them' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- see
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I can see the mountains.', 'Dağları görebiliyorum.' FROM words WHERE word = 'see' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'See you on Monday.', 'Pazartesi görüşürüz.' FROM words WHERE word = 'see' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I see what you mean.', 'Ne demek istediğini anlıyorum.' FROM words WHERE word = 'see' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- other
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Show me the other one.', 'Bana diğerini göster.' FROM words WHERE word = 'other' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Some like tea, others prefer coffee.', 'Bazıları çayı, diğerleri kahveyi tercih eder.' FROM words WHERE word = 'other' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I saw him the other day.', 'Geçen gün onu gördüm.' FROM words WHERE word = 'other' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- than
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is taller than his brother.', 'O kardeşinden daha uzun.' FROM words WHERE word = 'than' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have more books than you.', 'Senden daha fazla kitabım var.' FROM words WHERE word = 'than' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Better late than never.', 'Geç olsun, güç olmasın.' FROM words WHERE word = 'than' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- then
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'First eat, then play.', 'Önce ye, sonra oyna.' FROM words WHERE word = 'then' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I lived there back then.', 'O zamanlar orada yaşıyordum.' FROM words WHERE word = 'then' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'If you are tired, then rest.', 'Yorgunsan o zaman dinlen.' FROM words WHERE word = 'then' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- now
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am busy right now.', 'Şu an meşgulüm.' FROM words WHERE word = 'now' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Now is the time to act.', 'Harekete geçme zamanı şimdi.' FROM words WHERE word = 'now' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do it now, not later.', 'Sonra değil, şimdi yap.' FROM words WHERE word = 'now' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- look
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Look at the sky!', 'Gökyüzüne bak!' FROM words WHERE word = 'look' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'You look tired today.', 'Bugün yorgun görünüyorsun.' FROM words WHERE word = 'look' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am looking for my keys.', 'Anahtarlarımı arıyorum.' FROM words WHERE word = 'look' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- only
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have only one wish.', 'Sadece bir dileğim var.' FROM words WHERE word = 'only' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is only a child.', 'O daha bir çocuk.' FROM words WHERE word = 'only' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Only you can help me.', 'Sadece sen bana yardım edebilirsin.' FROM words WHERE word = 'only' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- come
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Come here, please.', 'Buraya gel, lütfen.' FROM words WHERE word = 'come' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'When did you come back?', 'Ne zaman geri döndün?' FROM words WHERE word = 'come' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Spring is coming soon.', 'Bahar yakında geliyor.' FROM words WHERE word = 'come' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- its
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The dog wagged its tail.', 'Köpek kuyruğunu salladı.' FROM words WHERE word = 'its' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Every book has its cover.', 'Her kitabın bir kapağı vardır.' FROM words WHERE word = 'its' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The city is famous for its food.', 'Şehir, yemekleriyle ünlüdür.' FROM words WHERE word = 'its' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- over
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The plane flew over the city.', 'Uçak şehrin üstünden geçti.' FROM words WHERE word = 'over' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The movie is over.', 'Film bitti.' FROM words WHERE word = 'over' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Come over to my place.', 'Bize gel.' FROM words WHERE word = 'over' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- think
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I think you are right.', 'Bence haklısın.' FROM words WHERE word = 'think' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let me think about it.', 'Bunun hakkında düşüneyim.' FROM words WHERE word = 'think' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Think before you speak.', 'Konuşmadan önce düşün.' FROM words WHERE word = 'think' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- also
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I also like apples.', 'Ben de elma severim.' FROM words WHERE word = 'also' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is smart and also kind.', 'O hem zeki hem de nazik.' FROM words WHERE word = 'also' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He also came to the party.', 'O da partiye geldi.' FROM words WHERE word = 'also' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- back
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will be back soon.', 'Yakında döneceğim.' FROM words WHERE word = 'back' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My back hurts a lot.', 'Sırtım çok ağrıyor.' FROM words WHERE word = 'back' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give it back to me.', 'Onu bana geri ver.' FROM words WHERE word = 'back' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- after
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'After dinner, we watched TV.', 'Akşam yemeğinden sonra TV izledik.' FROM words WHERE word = 'after' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will call you after class.', 'Dersten sonra seni ararım.' FROM words WHERE word = 'after' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Day after day, he practiced.', 'Gün geçtikçe çalıştı.' FROM words WHERE word = 'after' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- use
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'May I use your phone?', 'Telefonunu kullanabilir miyim?' FROM words WHERE word = 'use' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This tool has many uses.', 'Bu aletin birçok kullanımı var.' FROM words WHERE word = 'use' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I use the bus every day.', 'Her gün otobüsü kullanırım.' FROM words WHERE word = 'use' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- two
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have two sisters.', 'İki kız kardeşim var.' FROM words WHERE word = 'two' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Two heads are better than one.', 'İki kafa bir kafadan iyidir.' FROM words WHERE word = 'two' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Wait for me two minutes.', 'Beni iki dakika bekle.' FROM words WHERE word = 'two' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- how
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How are you today?', 'Bugün nasılsın?' FROM words WHERE word = 'how' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How does this work?', 'Bu nasıl çalışıyor?' FROM words WHERE word = 'how' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How much does it cost?', 'Ne kadar tutuyor?' FROM words WHERE word = 'how' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- our
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Our house is white.', 'Evimiz beyaz.' FROM words WHERE word = 'our' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Our teacher is very kind.', 'Öğretmenimiz çok nazik.' FROM words WHERE word = 'our' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Welcome to our home.', 'Evimize hoş geldin.' FROM words WHERE word = 'our' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- work
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I go to work at eight.', 'Sekizde işe giderim.' FROM words WHERE word = 'work' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Hard work pays off.', 'Sıkı çalışmanın karşılığı vardır.' FROM words WHERE word = 'work' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The printer does not work.', 'Yazıcı çalışmıyor.' FROM words WHERE word = 'work' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- first
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She came first in the race.', 'Yarışta birinci geldi.' FROM words WHERE word = 'first' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'First, wash your hands.', 'Önce ellerini yıka.' FROM words WHERE word = 'first' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is my first time here.', 'Buraya ilk gelişim.' FROM words WHERE word = 'first' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- well
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She sings very well.', 'O çok iyi şarkı söyler.' FROM words WHERE word = 'well' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am not feeling well.', 'Kendimi iyi hissetmiyorum.' FROM words WHERE word = 'well' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Well, let us start.', 'Peki, başlayalım.' FROM words WHERE word = 'well' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- way
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Which way is the station?', 'İstasyona giden yol hangisi?' FROM words WHERE word = 'way' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There must be a way.', 'Bir yolu olmalı.' FROM words WHERE word = 'way' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He answered in a calm way.', 'Sakin bir şekilde cevap verdi.' FROM words WHERE word = 'way' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- even
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Even a child can do it.', 'Bir çocuk bile yapabilir.' FROM words WHERE word = 'even' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It rained even harder.', 'Daha da çok yağmur yağdı.' FROM words WHERE word = 'even' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He did not even say hello.', 'Selam bile vermedi.' FROM words WHERE word = 'even' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- new
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I bought a new car.', 'Yeni bir araba aldım.' FROM words WHERE word = 'new' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Welcome to the new year!', 'Yeni yıla hoş geldiniz!' FROM words WHERE word = 'new' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is the new teacher.', 'O yeni öğretmen.' FROM words WHERE word = 'new' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- want
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want some ice cream.', 'Biraz dondurma istiyorum.' FROM words WHERE word = 'want' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What do you want to do?', 'Ne yapmak istiyorsun?' FROM words WHERE word = 'want' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She wants to be a doctor.', 'Doktor olmak istiyor.' FROM words WHERE word = 'want' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- because
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I stayed home because of the rain.', 'Yağmur yüzünden evde kaldım.' FROM words WHERE word = 'because' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He smiled because he was happy.', 'Mutlu olduğu için gülümsedi.' FROM words WHERE word = 'because' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love her because she is kind.', 'Onu nazik olduğu için seviyorum.' FROM words WHERE word = 'because' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- any
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you have any questions?', 'Herhangi bir sorun var mı?' FROM words WHERE word = 'any' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is not any bread left.', 'Hiç ekmek kalmadı.' FROM words WHERE word = 'any' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Take any seat you like.', 'İstediğin koltuğa otur.' FROM words WHERE word = 'any' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- these
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'These shoes are too big.', 'Bu ayakkabılar çok büyük.' FROM words WHERE word = 'these' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I bought these for you.', 'Bunları senin için aldım.' FROM words WHERE word = 'these' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'These days, life is busy.', 'Bu günlerde hayat yoğun.' FROM words WHERE word = 'these' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- give
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give me the salt, please.', 'Lütfen bana tuzu ver.' FROM words WHERE word = 'give' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Never give up on your dreams.', 'Hayallerinden asla vazgeçme.' FROM words WHERE word = 'give' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She gave him a book.', 'Ona bir kitap verdi.' FROM words WHERE word = 'give' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- day
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Have a nice day!', 'İyi günler!' FROM words WHERE word = 'day' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Every day, I read a book.', 'Her gün bir kitap okurum.' FROM words WHERE word = 'day' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What a beautiful day!', 'Ne güzel bir gün!' FROM words WHERE word = 'day' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- most
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Most students passed the exam.', 'Çoğu öğrenci sınavı geçti.' FROM words WHERE word = 'most' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is the most clever boy.', 'O en zeki çocuk.' FROM words WHERE word = 'most' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Make the most of your time.', 'Zamanını en iyi şekilde kullan.' FROM words WHERE word = 'most' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- us
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Come with us tonight.', 'Bu gece bizimle gel.' FROM words WHERE word = 'us' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tell us your story.', 'Bize hikayeni anlat.' FROM words WHERE word = 'us' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Help us, please.', 'Bize yardım et, lütfen.' FROM words WHERE word = 'us' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- find
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I cannot find my glasses.', 'Gözlüğümü bulamıyorum.' FROM words WHERE word = 'find' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Did you find the answer?', 'Cevabı buldun mu?' FROM words WHERE word = 'find' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'You will find peace here.', 'Burada huzur bulacaksın.' FROM words WHERE word = 'find' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- here
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Come here right now.', 'Hemen buraya gel.' FROM words WHERE word = 'here' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Here is your coffee.', 'İşte kahven.' FROM words WHERE word = 'here' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have been here before.', 'Daha önce burada bulundum.' FROM words WHERE word = 'here' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- tell
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Tell me a story.', 'Bana bir hikaye anlat.' FROM words WHERE word = 'tell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not tell anyone.', 'Kimseye söyleme.' FROM words WHERE word = 'tell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I can tell she is upset.', 'Üzgün olduğunu anlayabiliyorum.' FROM words WHERE word = 'tell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- very
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is very cold today.', 'Bugün çok soğuk.' FROM words WHERE word = 'very' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Thank you very much.', 'Çok teşekkür ederim.' FROM words WHERE word = 'very' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is very kind to me.', 'O bana karşı çok nazik.' FROM words WHERE word = 'very' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- need
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I need a glass of water.', 'Bir bardak suya ihtiyacım var.' FROM words WHERE word = 'need' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you need help?', 'Yardıma ihtiyacın var mı?' FROM words WHERE word = 'need' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We need more time.', 'Daha fazla zamana ihtiyacımız var.' FROM words WHERE word = 'need' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- feel
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I feel really happy today.', 'Bugün çok mutlu hissediyorum.' FROM words WHERE word = 'feel' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How do you feel now?', 'Şimdi nasıl hissediyorsun?' FROM words WHERE word = 'feel' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She feels cold all the time.', 'O her zaman üşür.' FROM words WHERE word = 'feel' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- try
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Try this delicious cake.', 'Bu lezzetli pastayı dene.' FROM words WHERE word = 'try' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will try my best.', 'Elimden geleni yapacağım.' FROM words WHERE word = 'try' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Just try one more time.', 'Bir kez daha dene.' FROM words WHERE word = 'try' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- leave
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have to leave now.', 'Şimdi gitmem lazım.' FROM words WHERE word = 'leave' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not leave the door open.', 'Kapıyı açık bırakma.' FROM words WHERE word = 'leave' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She left her keys at home.', 'Anahtarlarını evde bıraktı.' FROM words WHERE word = 'leave' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- call
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Call me when you arrive.', 'Geldiğinde beni ara.' FROM words WHERE word = 'call' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I got a call from him.', 'Ondan bir telefon aldım.' FROM words WHERE word = 'call' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They call her Lily.', 'Ona Lily derler.' FROM words WHERE word = 'call' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- world
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The world is full of wonders.', 'Dünya harikalarla dolu.' FROM words WHERE word = 'world' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to see the world.', 'Dünyayı görmek istiyorum.' FROM words WHERE word = 'world' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is my whole world.', 'O benim her şeyim.' FROM words WHERE word = 'world' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- school
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I walk to school every day.', 'Her gün okula yürürüm.' FROM words WHERE word = 'school' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'School starts at nine.', 'Okul dokuzda başlar.' FROM words WHERE word = 'school' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Our school is very big.', 'Okulumuz çok büyük.' FROM words WHERE word = 'school' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- still
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is still raining.', 'Hala yağmur yağıyor.' FROM words WHERE word = 'still' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Are you still hungry?', 'Hala aç mısın?' FROM words WHERE word = 'still' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please stand still.', 'Lütfen hareketsiz dur.' FROM words WHERE word = 'still' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- last
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Last summer was very hot.', 'Geçen yaz çok sıcaktı.' FROM words WHERE word = 'last' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The party lasted all night.', 'Parti bütün gece sürdü.' FROM words WHERE word = 'last' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He came last in the race.', 'Yarışta sonuncu geldi.' FROM words WHERE word = 'last' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- great
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'You did a great job.', 'Harika iş çıkardın.' FROM words WHERE word = 'great' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The view is great here.', 'Manzara burada harika.' FROM words WHERE word = 'great' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is a great teacher.', 'O harika bir öğretmen.' FROM words WHERE word = 'great' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- where
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where do you live?', 'Nerede yaşıyorsun?' FROM words WHERE word = 'where' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I know where she went.', 'Nereye gittiğini biliyorum.' FROM words WHERE word = 'where' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where is the nearest bank?', 'En yakın banka nerede?' FROM words WHERE word = 'where' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- much
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How much sugar do you want?', 'Ne kadar şeker istersin?' FROM words WHERE word = 'much' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love you so much.', 'Seni çok seviyorum.' FROM words WHERE word = 'much' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It costs too much.', 'Çok pahalı.' FROM words WHERE word = 'much' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- mean
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What does this word mean?', 'Bu kelime ne demek?' FROM words WHERE word = 'mean' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I did not mean to hurt you.', 'Seni incitmek istemedim.' FROM words WHERE word = 'mean' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not be so mean.', 'Bu kadar kaba olma.' FROM words WHERE word = 'mean' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- before
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Wash your hands before dinner.', 'Akşam yemeğinden önce ellerini yıka.' FROM words WHERE word = 'before' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have seen this movie before.', 'Bu filmi daha önce gördüm.' FROM words WHERE word = 'before' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Think before you act.', 'Davranmadan önce düşün.' FROM words WHERE word = 'before' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- move
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please move your car.', 'Lütfen arabanı çek.' FROM words WHERE word = 'move' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We will move next month.', 'Önümüzdeki ay taşınacağız.' FROM words WHERE word = 'move' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'His story moved me deeply.', 'Hikayesi beni derinden etkiledi.' FROM words WHERE word = 'move' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- such
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is such a kind person.', 'O öyle nazik bir insan ki.' FROM words WHERE word = 'such' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have never had such fun.', 'Daha önce hiç böyle eğlenmedim.' FROM words WHERE word = 'such' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is no such thing.', 'Öyle bir şey yok.' FROM words WHERE word = 'such' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- live
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I live in a small town.', 'Küçük bir kasabada yaşıyorum.' FROM words WHERE word = 'live' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They live very simple lives.', 'Çok sade bir hayat yaşıyorlar.' FROM words WHERE word = 'live' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Live every day to the fullest.', 'Her günü dolu dolu yaşa.' FROM words WHERE word = 'live' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- show
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Show me your new phone.', 'Yeni telefonunu göster bana.' FROM words WHERE word = 'show' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love this TV show.', 'Bu diziyi çok seviyorum.' FROM words WHERE word = 'show' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She showed great courage.', 'Büyük cesaret gösterdi.' FROM words WHERE word = 'show' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- write
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please write your name here.', 'Lütfen adını buraya yaz.' FROM words WHERE word = 'write' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I write in my diary every night.', 'Her gece günlüğüme yazarım.' FROM words WHERE word = 'write' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She wrote a beautiful song.', 'Çok güzel bir şarkı yazdı.' FROM words WHERE word = 'write' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- between
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Sit between us, please.', 'Lütfen aramıza otur.' FROM words WHERE word = 'between' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is a wall between them.', 'Aralarında bir duvar var.' FROM words WHERE word = 'between' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Choose between coffee and tea.', 'Kahveyle çay arasında seç.' FROM words WHERE word = 'between' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- another
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give me another chance.', 'Bana bir şans daha ver.' FROM words WHERE word = 'another' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Would you like another cup?', 'Bir fincan daha ister misin?' FROM words WHERE word = 'another' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That is another story.', 'O başka bir hikaye.' FROM words WHERE word = 'another' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- house
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Our house has a garden.', 'Evimizin bir bahçesi var.' FROM words WHERE word = 'house' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Welcome to my house!', 'Evime hoş geldin!' FROM words WHERE word = 'house' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She built a small house.', 'Küçük bir ev inşa etti.' FROM words WHERE word = 'house' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- play
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us play football.', 'Futbol oynayalım.' FROM words WHERE word = 'play' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Children love to play outside.', 'Çocuklar dışarıda oynamayı sever.' FROM words WHERE word = 'play' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He plays the guitar very well.', 'Çok iyi gitar çalar.' FROM words WHERE word = 'play' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- run
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I run every morning.', 'Her sabah koşarım.' FROM words WHERE word = 'run' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not run in the hall.', 'Koridorda koşma.' FROM words WHERE word = 'run' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She runs her own business.', 'Kendi işini yönetiyor.' FROM words WHERE word = 'run' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- big
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have a big problem.', 'Büyük bir sorunum var.' FROM words WHERE word = 'big' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The dog is too big.', 'Köpek çok büyük.' FROM words WHERE word = 'big' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is a big opportunity.', 'Bu büyük bir fırsat.' FROM words WHERE word = 'big' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- small
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She lives in a small house.', 'Küçük bir evde yaşıyor.' FROM words WHERE word = 'small' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The cat is very small.', 'Kedi çok küçük.' FROM words WHERE word = 'small' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want a small coffee.', 'Küçük bir kahve istiyorum.' FROM words WHERE word = 'small' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- thing
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What is that thing?', 'O şey ne?' FROM words WHERE word = 'thing' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Many things have changed.', 'Birçok şey değişti.' FROM words WHERE word = 'thing' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'One thing at a time.', 'Her seferinde bir şey.' FROM words WHERE word = 'thing' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- woman
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is a wonderful woman.', 'O harika bir kadın.' FROM words WHERE word = 'woman' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The woman smiled at me.', 'Kadın bana gülümsedi.' FROM words WHERE word = 'woman' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My mother is a strong woman.', 'Annem güçlü bir kadın.' FROM words WHERE word = 'woman' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- man
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That man is my uncle.', 'O adam benim amcam.' FROM words WHERE word = 'man' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He is a kind old man.', 'O kibar yaşlı bir adam.' FROM words WHERE word = 'man' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Every man has a dream.', 'Her insanın bir hayali vardır.' FROM words WHERE word = 'man' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- child
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The child is sleeping.', 'Çocuk uyuyor.' FROM words WHERE word = 'child' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Every child needs love.', 'Her çocuğun sevgiye ihtiyacı var.' FROM words WHERE word = 'child' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She has one child.', 'Bir çocuğu var.' FROM words WHERE word = 'child' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- life
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Life is beautiful.', 'Hayat güzel.' FROM words WHERE word = 'life' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He saved my life.', 'O hayatımı kurtardı.' FROM words WHERE word = 'life' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Enjoy every moment of life.', 'Hayatın her anının tadını çıkar.' FROM words WHERE word = 'life' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- hand
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Wash your hands now.', 'Şimdi ellerini yıka.' FROM words WHERE word = 'hand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She held my hand tightly.', 'Elimi sıkıca tuttu.' FROM words WHERE word = 'hand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Give me a hand, please.', 'Bana yardım eder misin?' FROM words WHERE word = 'hand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- part
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Eat just a small part.', 'Sadece küçük bir parça ye.' FROM words WHERE word = 'part' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to be part of it.', 'Buna dahil olmak istiyorum.' FROM words WHERE word = 'part' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is the best part.', 'En güzel kısım bu.' FROM words WHERE word = 'part' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- place
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is a quiet place.', 'Burası sakin bir yer.' FROM words WHERE word = 'place' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Put it back in its place.', 'Onu yerine geri koy.' FROM words WHERE word = 'place' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have no place to go.', 'Gidecek hiçbir yerim yok.' FROM words WHERE word = 'place' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- case
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'In any case, I will come.', 'Her halükarda geleceğim.' FROM words WHERE word = 'case' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Put it in the case.', 'Onu kutuya koy.' FROM words WHERE word = 'case' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Take an umbrella in case it rains.', 'Yağmur ihtimaline karşı şemsiye al.' FROM words WHERE word = 'case' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- week
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'See you next week.', 'Gelecek hafta görüşürüz.' FROM words WHERE word = 'week' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I work five days a week.', 'Haftada beş gün çalışırım.' FROM words WHERE word = 'week' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This has been a long week.', 'Uzun bir hafta oldu.' FROM words WHERE word = 'week' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- company
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I work for a big company.', 'Büyük bir şirkette çalışıyorum.' FROM words WHERE word = 'company' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The company hired ten people.', 'Şirket on kişi işe aldı.' FROM words WHERE word = 'company' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I enjoy your company.', 'Senin arkadaşlığından hoşlanırım.' FROM words WHERE word = 'company' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- system
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The system is down now.', 'Sistem şu an çalışmıyor.' FROM words WHERE word = 'system' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Our school has a good system.', 'Okulumuzun iyi bir sistemi var.' FROM words WHERE word = 'system' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They built a new system.', 'Yeni bir sistem kurdular.' FROM words WHERE word = 'system' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- program
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I watch a TV program at night.', 'Geceleri bir TV programı izlerim.' FROM words WHERE word = 'program' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She joined the fitness program.', 'Spor programına katıldı.' FROM words WHERE word = 'program' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The program starts at eight.', 'Program sekizde başlar.' FROM words WHERE word = 'program' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- question
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'May I ask a question?', 'Bir soru sorabilir miyim?' FROM words WHERE word = 'question' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'That is a good question.', 'Bu güzel bir soru.' FROM words WHERE word = 'question' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I have many questions.', 'Çok sorum var.' FROM words WHERE word = 'question' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- problem
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We have a small problem.', 'Küçük bir sorunumuz var.' FROM words WHERE word = 'problem' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'No problem at all.', 'Hiç sorun değil.' FROM words WHERE word = 'problem' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us solve this problem.', 'Bu sorunu çözelim.' FROM words WHERE word = 'problem' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- hand
-- (already covered)

-- group
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We work as a group.', 'Bir grup olarak çalışırız.' FROM words WHERE word = 'group' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Join our group, please.', 'Lütfen grubumuza katıl.' FROM words WHERE word = 'group' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'A group of tourists arrived.', 'Bir grup turist geldi.' FROM words WHERE word = 'group' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- number
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What is your phone number?', 'Telefon numaran ne?' FROM words WHERE word = 'number' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There were a number of cars.', 'Birçok araba vardı.' FROM words WHERE word = 'number' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Pick a number from one to ten.', 'Birden ona kadar bir sayı seç.' FROM words WHERE word = 'number' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- word
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not know this word.', 'Bu kelimeyi bilmiyorum.' FROM words WHERE word = 'word' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'In other words, I agree.', 'Yani kabul ediyorum.' FROM words WHERE word = 'word' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He kept his word.', 'O sözünü tuttu.' FROM words WHERE word = 'word' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- end
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The story has a happy end.', 'Hikayenin mutlu bir sonu var.' FROM words WHERE word = 'end' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The film ends at ten.', 'Film onda biter.' FROM words WHERE word = 'end' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'At the end of the day, we relax.', 'Günün sonunda dinleniriz.' FROM words WHERE word = 'end' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- why
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Why are you late?', 'Neden geç kaldın?' FROM words WHERE word = 'why' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not know why.', 'Nedenini bilmiyorum.' FROM words WHERE word = 'why' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Why did you do that?', 'Bunu neden yaptın?' FROM words WHERE word = 'why' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- ask
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'May I ask you something?', 'Sana bir şey sorabilir miyim?' FROM words WHERE word = 'ask' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Ask if you need help.', 'Yardıma ihtiyacın olursa sor.' FROM words WHERE word = 'ask' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She asked for some water.', 'O biraz su istedi.' FROM words WHERE word = 'ask' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- next
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'See you next Monday.', 'Gelecek pazartesi görüşürüz.' FROM words WHERE word = 'next' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My house is next to the park.', 'Evim parkın yanında.' FROM words WHERE word = 'next' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Who is next in line?', 'Sırada kim var?' FROM words WHERE word = 'next' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- old
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How old are you?', 'Kaç yaşındasın?' FROM words WHERE word = 'old' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This is an old book.', 'Bu eski bir kitap.' FROM words WHERE word = 'old' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My grandfather is very old.', 'Büyükbabam çok yaşlı.' FROM words WHERE word = 'old' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- different
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We have different tastes.', 'Farklı zevklerimiz var.' FROM words WHERE word = 'different' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Try a different approach.', 'Farklı bir yaklaşım dene.' FROM words WHERE word = 'different' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Everyone is different.', 'Herkes farklı.' FROM words WHERE word = 'different' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- night
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It was a quiet night.', 'Sakin bir geceydi.' FROM words WHERE word = 'night' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Good night, sleep well.', 'İyi geceler, iyi uyu.' FROM words WHERE word = 'night' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We danced all night long.', 'Bütün gece dans ettik.' FROM words WHERE word = 'night' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- room
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My room is upstairs.', 'Odam üst katta.' FROM words WHERE word = 'room' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is no room here.', 'Burada yer yok.' FROM words WHERE word = 'room' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Clean your room, please.', 'Lütfen odanı temizle.' FROM words WHERE word = 'room' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- water
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Drink more water every day.', 'Her gün daha çok su iç.' FROM words WHERE word = 'water' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The water is very cold.', 'Su çok soğuk.' FROM words WHERE word = 'water' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Water the plants tomorrow.', 'Bitkileri yarın sula.' FROM words WHERE word = 'water' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- city
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love big cities.', 'Büyük şehirleri severim.' FROM words WHERE word = 'city' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Istanbul is a beautiful city.', 'İstanbul güzel bir şehir.' FROM words WHERE word = 'city' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She moved to another city.', 'Başka bir şehre taşındı.' FROM words WHERE word = 'city' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- book
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am reading a book.', 'Bir kitap okuyorum.' FROM words WHERE word = 'book' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please book a table.', 'Lütfen bir masa ayırt.' FROM words WHERE word = 'book' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This book is amazing.', 'Bu kitap harika.' FROM words WHERE word = 'book' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- friend
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She is my best friend.', 'O benim en iyi arkadaşım.' FROM words WHERE word = 'friend' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'A true friend is rare.', 'Gerçek bir arkadaş nadirdir.' FROM words WHERE word = 'friend' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I met an old friend today.', 'Bugün eski bir arkadaşımla karşılaştım.' FROM words WHERE word = 'friend' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- food
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The food is delicious.', 'Yemek çok lezzetli.' FROM words WHERE word = 'food' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love Italian food.', 'İtalyan yemeklerini severim.' FROM words WHERE word = 'food' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'There is no food at home.', 'Evde yemek yok.' FROM words WHERE word = 'food' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- door
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Close the door, please.', 'Lütfen kapıyı kapat.' FROM words WHERE word = 'door' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Someone is at the door.', 'Kapıda biri var.' FROM words WHERE word = 'door' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Open the door slowly.', 'Kapıyı yavaşça aç.' FROM words WHERE word = 'door' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- car
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My car is parked outside.', 'Arabam dışarıda park edilmiş.' FROM words WHERE word = 'car' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He bought a new car.', 'Yeni bir araba aldı.' FROM words WHERE word = 'car' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Can you drive a car?', 'Araba kullanabilir misin?' FROM words WHERE word = 'car' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- love
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I love my family.', 'Ailemi seviyorum.' FROM words WHERE word = 'love' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Love is a beautiful thing.', 'Sevgi güzel bir şeydir.' FROM words WHERE word = 'love' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She loves chocolate cake.', 'Çikolatalı pastayı sever.' FROM words WHERE word = 'love' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- happy
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I am very happy today.', 'Bugün çok mutluyum.' FROM words WHERE word = 'happy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Happy birthday, my friend!', 'Doğum günün kutlu olsun, dostum!' FROM words WHERE word = 'happy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Her smile makes me happy.', 'Onun gülüşü beni mutlu eder.' FROM words WHERE word = 'happy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- read
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I read books every night.', 'Her gece kitap okurum.' FROM words WHERE word = 'read' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Have you read this novel?', 'Bu romanı okudun mu?' FROM words WHERE word = 'read' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She loves to read poetry.', 'Şiir okumayı sever.' FROM words WHERE word = 'read' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- learn
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to learn English.', 'İngilizce öğrenmek istiyorum.' FROM words WHERE word = 'learn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Children learn very quickly.', 'Çocuklar çok hızlı öğrenir.' FROM words WHERE word = 'learn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I learned a lot from him.', 'Ondan çok şey öğrendim.' FROM words WHERE word = 'learn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- help
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Can you help me, please?', 'Bana yardım eder misin?' FROM words WHERE word = 'help' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He always helps his neighbors.', 'O her zaman komşularına yardım eder.' FROM words WHERE word = 'help' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Help yourself to some cake.', 'Pastadan kendine al.' FROM words WHERE word = 'help' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- start
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us start the lesson.', 'Derse başlayalım.' FROM words WHERE word = 'start' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The movie starts at seven.', 'Film yedide başlar.' FROM words WHERE word = 'start' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Start with the easy questions.', 'Kolay sorulardan başla.' FROM words WHERE word = 'start' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- stop
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Stop talking, please.', 'Lütfen konuşmayı bırak.' FROM words WHERE word = 'stop' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The bus stops at the corner.', 'Otobüs köşede durur.' FROM words WHERE word = 'stop' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It will not stop raining.', 'Yağmur durmayacak.' FROM words WHERE word = 'stop' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- open
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Open the window, please.', 'Lütfen pencereyi aç.' FROM words WHERE word = 'open' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The shop is open today.', 'Dükkan bugün açık.' FROM words WHERE word = 'open' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She has an open mind.', 'O açık fikirli biri.' FROM words WHERE word = 'open' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- close
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please close the door.', 'Lütfen kapıyı kapat.' FROM words WHERE word = 'close' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We are very close friends.', 'Çok yakın arkadaşız.' FROM words WHERE word = 'close' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The store closes at nine.', 'Mağaza dokuzda kapanır.' FROM words WHERE word = 'close' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- name
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'What is your full name?', 'Tam adın nedir?' FROM words WHERE word = 'name' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My name is on the list.', 'Adım listede.' FROM words WHERE word = 'name' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They named the baby Mia.', 'Bebeğe Mia adını verdiler.' FROM words WHERE word = 'name' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- speak
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you speak English?', 'İngilizce konuşabiliyor musun?' FROM words WHERE word = 'speak' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She speaks three languages.', 'Üç dil konuşur.' FROM words WHERE word = 'speak' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'May I speak with you?', 'Seninle konuşabilir miyim?' FROM words WHERE word = 'speak' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- listen
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Listen to me carefully.', 'Beni dikkatle dinle.' FROM words WHERE word = 'listen' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I listen to music daily.', 'Her gün müzik dinlerim.' FROM words WHERE word = 'listen' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He never listens to advice.', 'O hiç tavsiye dinlemez.' FROM words WHERE word = 'listen' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- watch
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We watch a film every Friday.', 'Her cuma bir film izleriz.' FROM words WHERE word = 'watch' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'My watch is broken now.', 'Saatim şu an bozuk.' FROM words WHERE word = 'watch' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Watch out for the car!', 'Arabaya dikkat et!' FROM words WHERE word = 'watch' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- eat
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us eat dinner together.', 'Akşam yemeğini birlikte yiyelim.' FROM words WHERE word = 'eat' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not eat meat.', 'Et yemem.' FROM words WHERE word = 'eat' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She ate the whole cake.', 'Bütün pastayı yedi.' FROM words WHERE word = 'eat' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- drink
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Drink plenty of water.', 'Bol su iç.' FROM words WHERE word = 'drink' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Would you like a drink?', 'İçecek bir şey ister misin?' FROM words WHERE word = 'drink' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He drinks coffee every morning.', 'O her sabah kahve içer.' FROM words WHERE word = 'drink' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- sleep
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I sleep eight hours a night.', 'Gecede sekiz saat uyurum.' FROM words WHERE word = 'sleep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The baby is sleeping now.', 'Bebek şu an uyuyor.' FROM words WHERE word = 'sleep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Get some sleep, please.', 'Lütfen biraz uyu.' FROM words WHERE word = 'sleep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- buy
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to buy a gift.', 'Bir hediye almak istiyorum.' FROM words WHERE word = 'buy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Where did you buy that?', 'Onu nereden aldın?' FROM words WHERE word = 'buy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She buys fresh bread daily.', 'Her gün taze ekmek alır.' FROM words WHERE word = 'buy' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- sell
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They sell handmade bags.', 'El yapımı çantalar satarlar.' FROM words WHERE word = 'sell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He sold his old car.', 'O eski arabasını sattı.' FROM words WHERE word = 'sell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'This shop sells flowers.', 'Bu dükkan çiçek satar.' FROM words WHERE word = 'sell' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- pay
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I will pay the bill.', 'Hesabı ben öderim.' FROM words WHERE word = 'pay' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'How much did you pay?', 'Ne kadar ödedin?' FROM words WHERE word = 'pay' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Pay attention to the road.', 'Yola dikkat et.' FROM words WHERE word = 'pay' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- meet
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Nice to meet you!', 'Tanıştığımıza memnun oldum!' FROM words WHERE word = 'meet' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us meet for coffee.', 'Bir kahve içmek için buluşalım.' FROM words WHERE word = 'meet' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I met him at school.', 'Onunla okulda tanıştım.' FROM words WHERE word = 'meet' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- send
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please send me an email.', 'Lütfen bana bir e-posta gönder.' FROM words WHERE word = 'send' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I sent her a card.', 'Ona bir kart gönderdim.' FROM words WHERE word = 'send' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They send flowers every week.', 'Her hafta çiçek gönderirler.' FROM words WHERE word = 'send' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- learn
-- (already covered)

-- talk
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We need to talk.', 'Konuşmamız gerek.' FROM words WHERE word = 'talk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'They talk too much.', 'Çok konuşuyorlar.' FROM words WHERE word = 'talk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us talk later.', 'Sonra konuşalım.' FROM words WHERE word = 'talk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- walk
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I walk to work every day.', 'Her gün işe yürürüm.' FROM words WHERE word = 'walk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us take a long walk.', 'Uzun bir yürüyüş yapalım.' FROM words WHERE word = 'walk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She walks her dog daily.', 'Her gün köpeğini gezdirir.' FROM words WHERE word = 'walk' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- drive
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I drive to work daily.', 'Her gün işe arabayla giderim.' FROM words WHERE word = 'drive' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Drive carefully on icy roads.', 'Buzlu yollarda dikkatli sür.' FROM words WHERE word = 'drive' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She can drive a truck.', 'O kamyon kullanabilir.' FROM words WHERE word = 'drive' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- love
-- (already covered)

-- hate
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I hate cold weather.', 'Soğuk havadan nefret ederim.' FROM words WHERE word = 'hate' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He hates being late.', 'Geç kalmaktan nefret eder.' FROM words WHERE word = 'hate' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I hate to disappoint you.', 'Seni hayal kırıklığına uğratmaktan nefret ederim.' FROM words WHERE word = 'hate' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- sit
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please sit down.', 'Lütfen otur.' FROM words WHERE word = 'sit' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We sat by the fire.', 'Ateşin yanına oturduk.' FROM words WHERE word = 'sit' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The cat sits on the mat.', 'Kedi paspasın üzerinde oturur.' FROM words WHERE word = 'sit' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- stand
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please stand up.', 'Lütfen ayağa kalk.' FROM words WHERE word = 'stand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I cannot stand the noise.', 'Gürültüye dayanamıyorum.' FROM words WHERE word = 'stand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She stood near the door.', 'Kapının yanında durdu.' FROM words WHERE word = 'stand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- bring
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Bring your umbrella along.', 'Yanına şemsiyeni getir.' FROM words WHERE word = 'bring' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He brought me flowers.', 'O bana çiçek getirdi.' FROM words WHERE word = 'bring' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please bring some bread.', 'Lütfen biraz ekmek getir.' FROM words WHERE word = 'bring' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- carry
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Can you carry this bag?', 'Bu çantayı taşıyabilir misin?' FROM words WHERE word = 'carry' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I always carry my passport.', 'Pasaportumu her zaman yanımda taşırım.' FROM words WHERE word = 'carry' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The bridge carries heavy traffic.', 'Köprü ağır trafik taşır.' FROM words WHERE word = 'carry' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- begin
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The class will begin soon.', 'Ders yakında başlayacak.' FROM words WHERE word = 'begin' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us begin with the basics.', 'Temellerle başlayalım.' FROM words WHERE word = 'begin' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She began to cry.', 'O ağlamaya başladı.' FROM words WHERE word = 'begin' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- keep
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Keep the change, please.', 'Lütfen üstü kalsın.' FROM words WHERE word = 'keep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I keep my promises.', 'Sözlerimi tutarım.' FROM words WHERE word = 'keep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Keep trying, do not give up.', 'Denemeye devam et, pes etme.' FROM words WHERE word = 'keep' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- hold
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Hold my hand, please.', 'Lütfen elimi tut.' FROM words WHERE word = 'hold' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please hold the door open.', 'Lütfen kapıyı açık tut.' FROM words WHERE word = 'hold' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She held a small book.', 'Küçük bir kitap tutuyordu.' FROM words WHERE word = 'hold' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- turn
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Turn right at the corner.', 'Köşeden sağa dön.' FROM words WHERE word = 'turn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please turn off the light.', 'Lütfen ışığı söndür.' FROM words WHERE word = 'turn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is your turn now.', 'Şimdi senin sıran.' FROM words WHERE word = 'turn' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- become
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She wants to become a doctor.', 'O doktor olmak istiyor.' FROM words WHERE word = 'become' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'The sky became dark.', 'Gökyüzü karardı.' FROM words WHERE word = 'become' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'He became a famous singer.', 'O ünlü bir şarkıcı oldu.' FROM words WHERE word = 'become' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- understand
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I do not understand you.', 'Seni anlamıyorum.' FROM words WHERE word = 'understand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She understands many languages.', 'Birçok dili anlıyor.' FROM words WHERE word = 'understand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I understand your concern.', 'Endişeni anlıyorum.' FROM words WHERE word = 'understand' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- believe
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I believe in you.', 'Sana inanıyorum.' FROM words WHERE word = 'believe' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'It is hard to believe.', 'İnanması zor.' FROM words WHERE word = 'believe' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'She believes every word he says.', 'Onun her sözüne inanır.' FROM words WHERE word = 'believe' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- remember
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I remember your face.', 'Yüzünü hatırlıyorum.' FROM words WHERE word = 'remember' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please remember to call me.', 'Lütfen beni aramayı unutma.' FROM words WHERE word = 'remember' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I cannot remember her name.', 'Onun adını hatırlayamıyorum.' FROM words WHERE word = 'remember' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- forget
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do not forget your keys.', 'Anahtarlarını unutma.' FROM words WHERE word = 'forget' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I always forget her birthday.', 'Onun doğum gününü hep unuturum.' FROM words WHERE word = 'forget' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Let us forget the past.', 'Geçmişi unutalım.' FROM words WHERE word = 'forget' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- hope
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I hope you feel better.', 'Umarım daha iyi hissedersin.' FROM words WHERE word = 'hope' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Never lose hope, my friend.', 'Asla umudunu kaybetme dostum.' FROM words WHERE word = 'hope' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I hope to see you soon.', 'Umarım yakında görüşürüz.' FROM words WHERE word = 'hope' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- wait
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Please wait for me here.', 'Lütfen beni burada bekle.' FROM words WHERE word = 'wait' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I cannot wait to see you.', 'Seni görmek için sabırsızlanıyorum.' FROM words WHERE word = 'wait' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'We waited for two hours.', 'İki saat bekledik.' FROM words WHERE word = 'wait' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

-- change
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'I want to change my job.', 'İşimi değiştirmek istiyorum.' FROM words WHERE word = 'change' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Times have changed.', 'Zamanlar değişti.' FROM words WHERE word = 'change' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;
INSERT INTO word_sentences (word_id, sentence, sentence_tr) SELECT id, 'Do you have any change?', 'Bozuk paran var mı?' FROM words WHERE word = 'change' AND list_id IN (SELECT id FROM lists WHERE is_public = true) LIMIT 1;

