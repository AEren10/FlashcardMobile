/**
 * AI Sentence MVP — Anthropic Claude Haiku ile bağlamlı örnek cümle üretimi.
 *
 * Maliyet kontrolü:
 *   - Sadece Haiku (en ucuz model)
 *   - Free user: 3/gün, Pro: 20/gün (rate limit lokal AsyncStorage)
 *   - Cache: aynı kelime ikinci sefer çağrılırsa DB'den (ai_sentences tablosu, migration 0011)
 *   - Cache hit ratio %70+ hedef
 *
 * Env: EXPO_PUBLIC_ANTHROPIC_API_KEY (yoksa stub mode — örnek cümle döner, gerçek çağrı yok)
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase from "../supabase/client";

const API_KEY = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
const MODEL = "claude-3-5-haiku-20241022";
const RATE_KEY = "@fc:ai:rate";
const FREE_LIMIT = 3;
const PRO_LIMIT = 20;

function todayId() {
  const d = new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
}

async function getRateCount() {
  try {
    const raw = await AsyncStorage.getItem(RATE_KEY);
    if (!raw) return 0;
    const j = JSON.parse(raw);
    if (j?.day !== todayId()) return 0;
    return j?.count || 0;
  } catch { return 0; }
}

async function bumpRate() {
  try {
    const c = await getRateCount();
    await AsyncStorage.setItem(RATE_KEY, JSON.stringify({ day: todayId(), count: c + 1 }));
  } catch {}
}

export async function getAiQuotaLeft(isPro = false) {
  const used = await getRateCount();
  const limit = isPro ? PRO_LIMIT : FREE_LIMIT;
  return { used, limit, left: Math.max(0, limit - used) };
}

/**
 * Cache check — ai_sentences tablosu (migration 0011).
 * Tablo yoksa hata yutulur, null döner (no cache).
 */
async function getCached(word) {
  try {
    const { data, error } = await supabase
      .from("ai_sentences")
      .select("sentence,translation")
      .eq("word", word.toLowerCase())
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return { sentence: data.sentence, translation: data.translation, cached: true };
  } catch { return null; }
}

async function saveCache(word, sentence, translation) {
  try {
    await supabase.from("ai_sentences").upsert(
      { word: word.toLowerCase(), sentence, translation },
      { onConflict: "word" }
    );
  } catch {}
}

/**
 * Bir kelime için bağlamlı örnek cümle üret.
 * @returns {Promise<{success, sentence, translation, cached?, error?, quotaExceeded?}>}
 */
export async function generateSentenceFor(word, meaning, isPro = false) {
  if (!word) return { success: false, error: "no_word" };

  // 1) Cache check (rate limit yemiyor)
  const cached = await getCached(word);
  if (cached) return { success: true, ...cached };

  // 2) Rate limit
  const { left } = await getAiQuotaLeft(isPro);
  if (left <= 0) {
    return { success: false, quotaExceeded: true, error: "Bugünlük hakkın bitti" };
  }

  // 3) Stub mode (API key yok)
  if (!API_KEY) {
    const stub = {
      sentence: `Here is an example with "${word}".`,
      translation: `"${word}" ile bir örnek.`,
    };
    await saveCache(word, stub.sentence, stub.translation);
    await bumpRate();
    return { success: true, ...stub, stub: true };
  }

  // 4) Gerçek API çağrısı
  try {
    const prompt = `Bir İngilizce-Türkçe sözlük asistanısın. Aşağıdaki kelime için 1 doğal İngilizce örnek cümle üret ve Türkçe çevirisini yaz.

Kelime: ${word}
Türkçe anlamı: ${meaning || "?"}

Format kesinlikle şu JSON: {"sentence":"...","translation":"..."}
Cümle 6-12 kelime arası, günlük dil, bağlamlı olsun. Sadece JSON döndür.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const text = data?.content?.[0]?.text || "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("invalid response format");
    const parsed = JSON.parse(jsonMatch[0]);
    if (!parsed?.sentence) throw new Error("no sentence in response");

    await saveCache(word, parsed.sentence, parsed.translation || "");
    await bumpRate();
    return { success: true, sentence: parsed.sentence, translation: parsed.translation || "" };
  } catch (err) {
    return { success: false, error: err?.message || "AI call failed" };
  }
}
