/**
 * Data Importer Utility
 * React Native app içinden veri aktarımı için
 */

import supabaseApiService from "../services/supabaseApi";

/**
 * Toplu liste ve kelime ekleme
 * @param {Array} listsData - Liste ve kelime verileri
 */
export const importListsAndWords = async (listsData) => {
  try {
    console.log("🚀 Veri aktarımı başlıyor...");

    const results = [];

    for (const listData of listsData) {
      console.log(`📝 Liste ekleniyor: ${listData.title}`);

      // Liste ekle
      const listResult = await supabaseApiService.createList({
        title: listData.title,
        description: listData.description,
        level: listData.level || "Beginner",
        image_url: listData.image_url || null,
      });

      if (!listResult.success) {
        console.error(`❌ Liste eklenirken hata: ${listResult.error}`);
        continue;
      }

      const list = listResult.data;
      console.log(`✅ Liste eklendi: ${list.title} (ID: ${list.id})`);

      // Kelimeleri ekle
      const wordResults = [];
      if (listData.words && listData.words.length > 0) {
        for (const wordData of listData.words) {
          const wordResult = await supabaseApiService.createWord({
            ...wordData,
            list_id: list.id,
          });

          if (wordResult.success) {
            wordResults.push(wordResult.data);
          } else {
            console.error(`❌ Kelime eklenirken hata: ${wordResult.error}`);
          }
        }

        console.log(`✅ ${wordResults.length} kelime eklendi`);
      }

      results.push({
        list,
        words: wordResults,
      });
    }

    console.log("🎉 Veri aktarımı tamamlandı!");
    return { success: true, data: results };
  } catch (error) {
    console.error("❌ Genel hata:", error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Tek liste ekleme
 * @param {Object} listData - Liste verisi
 */
export const importSingleList = async (listData) => {
  return await importListsAndWords([listData]);
};

/**
 * CSV string'ini parse et
 * @param {string} csvString - CSV formatındaki veri
 * @param {string} delimiter - Ayırıcı karakter (varsayılan: ',')
 */
export const parseCSV = (csvString, delimiter = ",") => {
  const lines = csvString.trim().split("\n");
  const headers = lines[0].split(delimiter).map((h) => h.trim());

  return lines.slice(1).map((line) => {
    const values = line.split(delimiter);
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = values[index]?.trim() || "";
    });
    return obj;
  });
};

/**
 * Kelime listesi formatını dönüştür
 * CSV formatı: word,meaning,example
 * @param {Array} csvData - Parse edilmiş CSV verisi
 */
export const transformWordsFromCSV = (csvData) => {
  return csvData.map((row) => ({
    word: row.word || row.Word,
    meaning: row.meaning || row.Meaning,
    example: row.example || row.Example || "",
    image_url: row.image_url || row.ImageUrl || null,
  }));
};

/**
 * Liste formatını dönüştür
 * @param {Object} rawListData - Ham liste verisi
 */
export const transformListData = (rawListData) => {
  return {
    title: rawListData.title || rawListData.Title,
    description: rawListData.description || rawListData.Description || "",
    level: rawListData.level || rawListData.Level || "Beginner",
    image_url: rawListData.image_url || rawListData.ImageUrl || null,
    words: rawListData.words || [],
  };
};

