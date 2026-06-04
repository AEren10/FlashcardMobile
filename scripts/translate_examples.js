/**
 * translate_examples.js — Mevcut words tablosundaki örnek cümleleri Türkçeye çevirir.
 *
 * Kullanım:
 *   1. .env'e SUPABASE_SERVICE_ROLE_KEY ve OPENAI_API_KEY ekle
 *   2. node scripts/translate_examples.js
 *   3. Default batch size: 20 kelime, max 500 kelime (kontrollü test için)
 *
 * Güvenlik: Service role key ile bağlanır (RLS bypass). Sadece local olarak çalıştır.
 *
 * Maliyet tahmini (gpt-4o-mini, ~Aralık 2025):
 *   - Input: ~50 token/kelime × $0.15/1M = $0.0000075
 *   - Output: ~30 token/kelime × $0.60/1M = $0.000018
 *   - Toplam: ~$0.000026/kelime → 5000 kelime = ~$0.13
 */

const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE || !OPENAI_KEY) {
  console.error("Eksik env: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, OPENAI_API_KEY");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

const BATCH_SIZE = 20;
const MAX_WORDS = parseInt(process.argv[2] || "500", 10);
const MODEL = "gpt-4o-mini";

async function translateBatch(items) {
  const prompt = items
    .map((it, i) => `${i + 1}. "${it.word}" → "${it.example}"`)
    .join("\n");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "Sen profesyonel bir İngilizce-Türkçe çevirmensin. Verilen örnek cümleleri DOĞAL ve AKICI Türkçeye çevir. " +
            "Cevabını sadece numaralı liste olarak ver: '1. çeviri', '2. çeviri'... Açıklama YAZMA.",
        },
        {
          role: "user",
          content: `Aşağıdaki ${items.length} İngilizce cümleyi Türkçeye çevir:\n\n${prompt}`,
        },
      ],
      temperature: 0.3,
    }),
  });

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";
  // Numaralı listeyi parse et
  const lines = text
    .split("\n")
    .map((l) => l.replace(/^\d+\.\s*/, "").trim())
    .filter(Boolean);

  return lines;
}

async function main() {
  console.log(`[start] Hedef: ${MAX_WORDS} kelime, batch=${BATCH_SIZE}`);

  let processed = 0;
  while (processed < MAX_WORDS) {
    const { data: words, error } = await supabase
      .from("words")
      .select("id, word, example")
      .is("example_tr", null)
      .not("example", "is", null)
      .limit(BATCH_SIZE);

    if (error) {
      console.error("[supabase select hata]", error);
      break;
    }
    if (!words?.length) {
      console.log("[done] Çevirilecek kelime kalmadı.");
      break;
    }

    try {
      const translations = await translateBatch(words);
      // Eşleşmeyi indexe göre yap
      const updates = words.map((w, i) => ({
        id: w.id,
        example_tr: translations[i] || null,
      }));

      // Tek tek UPDATE (batch upsert için ek RPC gerekir)
      for (const u of updates) {
        if (!u.example_tr) continue;
        const { error: upErr } = await supabase
          .from("words")
          .update({ example_tr: u.example_tr })
          .eq("id", u.id);
        if (upErr) console.error("[update hata]", u.id, upErr.message);
      }

      processed += words.length;
      console.log(`[batch] ${processed}/${MAX_WORDS} çevrildi`);
    } catch (err) {
      console.error("[translate hata]", err.message);
      break;
    }

    // Rate limit dostça — 1 saniye bekle
    await new Promise((r) => setTimeout(r, 1000));
  }

  console.log(`[finish] Toplam çevrildi: ${processed}`);
}

main().catch((err) => {
  console.error("[fatal]", err);
  process.exit(1);
});
