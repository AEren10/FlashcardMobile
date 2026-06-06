/**
 * Weekly Recap — son 7 gün için özet veri.
 *
 * Toplananlar:
 *   - Toplam kelime sayısı (son 7 gün)
 *   - Toplam oturum sayısı
 *   - Toplam süre (dakika)
 *   - Ortalama doğruluk
 *   - En aktif gün
 *   - En zor kelime (en çok lapses)
 *   - En çok çalışılan liste (top list)
 *   - Streak günü
 *   - Daily breakdown (7 gün)
 */
import supabase from "./client";
import { TABLES } from "./config";

export async function getWeeklyRecap() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  // 1) Son 7 günün study session'ları
  const { data: sessions, error: sErr } = await supabase
    .from(TABLES.STUDY_SESSIONS)
    .select("total_words, correct, duration_sec, started_at, list_id")
    .eq("user_id", user.id)
    .gte("started_at", sevenDaysAgo.toISOString());
  if (sErr) return null;

  const rows = sessions || [];
  let totalWords = 0;
  let totalCorrect = 0;
  let totalSessions = 0;
  let totalSec = 0;
  const dailyMap = {};
  const listMap = {};

  for (const r of rows) {
    const day = new Date(r.started_at).toDateString();
    if (!dailyMap[day]) dailyMap[day] = { sessions: 0, words: 0 };
    dailyMap[day].sessions += 1;
    dailyMap[day].words += r.total_words || 0;
    totalWords += r.total_words || 0;
    totalCorrect += r.correct || 0;
    totalSessions += 1;
    totalSec += r.duration_sec || 0;
    if (r.list_id) {
      listMap[r.list_id] = (listMap[r.list_id] || 0) + (r.total_words || 0);
    }
  }

  // 7 günlük breakdown (eski → yeni)
  const daily = [];
  let mostActiveDay = null;
  let mostActiveWords = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toDateString();
    const entry = dailyMap[k] || { sessions: 0, words: 0 };
    daily.push({ date: new Date(d), ...entry });
    if (entry.words > mostActiveWords) {
      mostActiveWords = entry.words;
      mostActiveDay = new Date(d);
    }
  }

  // 2) En çok çalışılan liste — listMap'in top key'i
  let topListId = null;
  let topListWords = 0;
  for (const [id, words] of Object.entries(listMap)) {
    if (words > topListWords) {
      topListWords = words;
      topListId = id;
    }
  }
  let topListTitle = null;
  if (topListId) {
    const { data: l } = await supabase
      .from(TABLES.LISTS)
      .select("title")
      .eq("id", topListId)
      .maybeSingle();
    topListTitle = l?.title || null;
  }

  // 3) Hardest word — son 7 gün word_progress üzerinden lapses çek
  let hardestWord = null;
  try {
    const { data: hard } = await supabase
      .from(TABLES.WORD_PROGRESS)
      .select("word_id, lapses, words(word, meaning)")
      .eq("user_id", user.id)
      .gte("last_reviewed", sevenDaysAgo.toISOString())
      .order("lapses", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (hard?.words) {
      hardestWord = {
        word: hard.words.word,
        meaning: hard.words.meaning,
        lapses: hard.lapses,
      };
    }
  } catch {
    /* ignore */
  }

  const accuracy = totalWords > 0 ? Math.round((totalCorrect / totalWords) * 100) : 0;
  const totalMin = Math.round(totalSec / 60);

  return {
    totalWords,
    totalSessions,
    totalCorrect,
    accuracy,
    totalMinutes: totalMin,
    mostActiveDay,
    mostActiveWords,
    topListTitle,
    topListWords,
    hardestWord,
    daily, // 7 günlük breakdown
    isEmpty: totalWords === 0,
  };
}
