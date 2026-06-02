/\*\*

- DATA IMPORT KULLANIM REHBERİ
-
- JSON verinizi Supabase'e aktarmak için birkaç yöntem var:
  \*/

// ============================================
// YÖNTEM 1: Geçici Buton ile Import (ÖNERİLEN)
// ============================================

// ProfileScreen.js veya herhangi bir ekrana geçici buton ekle:

/\*
import { importListsAndWords } from '../utils/dataImporter';

const handleImportData = async () => {
// JSON verini buraya kopyala
const myData = [
{
title: "Günlük İngilizce",
description: "Temel günlük kelimeler",
level: "Beginner",
words: [
{ word: "Hello", meaning: "Merhaba", example: "Hello world!" },
{ word: "Goodbye", meaning: "Hoşçakal", example: "Goodbye!" },
]
},
{
title: "İş İngilizcesi",
description: "Ofis kelimeleri",
level: "Intermediate",
words: [
{ word: "Meeting", meaning: "Toplantı", example: "We have a meeting" },
{ word: "Project", meaning: "Proje", example: "This project is important" },
]
}
];

const result = await importListsAndWords(myData);

if (result.success) {
Alert.alert("Başarılı", `${result.data.length} liste eklendi!`);
} else {
Alert.alert("Hata", result.error);
}
};

// Butonu ekle:
<TouchableOpacity onPress={handleImportData}>
<Text>Verileri İçe Aktar</Text>
</TouchableOpacity>
\*/

// ============================================
// YÖNTEM 2: ProfileScreen'e Eklemek
// ============================================

// ProfileScreen.js dosyasına ekle:

/\*
import { importListsAndWords } from '../../utils/dataImporter';

// Component içinde:
const handleImportData = async () => {
// JSON verini buraya yapıştır
const myData = [/* JSON verin burada */];

Alert.alert(
"Veri Aktarımı",
"Verileri Supabase'e aktarmak istediğinizden emin misiniz?",
[
{ text: "İptal", style: "cancel" },
{
text: "Evet",
onPress: async () => {
setLoading(true);
const result = await importListsAndWords(myData);

          if (result.success) {
            Alert.alert(
              "Başarılı!",
              `${result.data.length} liste ve toplam ${result.data.reduce((sum, item) => sum + item.words.length, 0)} kelime eklendi!`
            );
          } else {
            Alert.alert("Hata", result.error);
          }
          setLoading(false);
        },
      },
    ]

);
};

// Menu item olarak ekle:
<TouchableOpacity style={styles.menuItem} onPress={handleImportData}>
<Text style={styles.menuItemText}>Verileri İçe Aktar</Text>
<Text style={styles.menuItemArrow}>›</Text>
</TouchableOpacity>
\*/

// ============================================
// YÖNTEM 3: Ayrı Import Screen Oluşturmak
// ============================================

// Daha profesyonel bir yaklaşım için:
// src/screens/admin/ImportDataScreen.js oluştur

// ============================================
// JSON VERİ FORMATI
// ============================================

/\*
JSON verin şu formatta olmalı:

const myData = [
{
title: "Liste Adı", // Zorunlu
description: "Açıklama", // Opsiyonel
level: "Beginner", // Opsiyonel (Beginner, Intermediate, Advanced)
image_url: null, // Opsiyonel (URL string veya null)
words: [ // Zorunlu (array)
{
word: "Hello", // Zorunlu
meaning: "Merhaba", // Zorunlu
example: "Hello world!", // Opsiyonel
image_url: null // Opsiyonel
},
{
word: "Goodbye",
meaning: "Hoşçakal",
example: "Goodbye my friend!"
}
]
},
{
title: "İkinci Liste",
description: "Başka bir liste",
level: "Intermediate",
words: [
// ... daha fazla kelime
]
}
];
\*/

// ============================================
// ADIM ADIM KULLANIM
// ============================================

/\*

1. JSON verini hazırla (yukarıdaki formatta)

2. ProfileScreen.js'i aç

3. Import ekle:
   import { importListsAndWords } from '../../utils/dataImporter';

4. Function ekle:
   const handleImportData = async () => {
   const myData = [/* JSON verin burada */];
   const result = await importListsAndWords(myData);
   console.log(result);
   };

5. Buton ekle (geçici):
   <TouchableOpacity onPress={handleImportData}>
   <Text>Import Data</Text>
   </TouchableOpacity>

6. Uygulamayı çalıştır ve giriş yap

7. Butona bas ve verileri aktar!

8. Console log'larda sonuçları gör:
   ✅ Liste eklendi: ...
   ✅ X kelime eklendi
   🎉 Veri aktarımı tamamlandı!
   \*/
