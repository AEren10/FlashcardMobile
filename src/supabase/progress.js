/**
 * word_progress + study_sessions CRUD
 */
import supabase from "./client";
import { TABLES } from "./config";
import { nextProgress } from "../lib/srs";

export async function getProgressForWords(wordIds) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || !wordIds?.length) return {};
  const { data, error } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("*")
    .eq("user_id", user.id)
    .in("word_id", wordIds);
  if (error) {
    console.warn("getProgressForWords", error.message);
    return {};
  }
  return Object.fromEntries((data ?? []).map((r) => [r.word_id, r]));
}

export async function recordReview(wordId, grade) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "not_auth" };

  const { data: existing } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("*")
    .eq("user_id", user.id)
    .eq("word_id", wordId)
    .maybeSingle();

  const next = nextProgress(existing, grade);
  const payload = { user_id: user.id, word_id: wordId, ...next, updated_at: new Date().toISOString() };

  const { error } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .upsert(payload, { onConflict: "user_id,word_id" });

  if (error) {
    console.warn("recordReview", error.message);
    return { success: false, error: error.message };
  }
  return { success: true, progress: next };
}

/**
 * Bugün çalışılacak kelimeleri kategorize getirir:
 *  - newWords: kullanıcının hiç görmediği (word_progress kaydı yok)
 *  - reviewWords: gördüğü, due_at <= now, lapses = 0
 *  - lapsedWords: bir veya daha fazla yanlış cevap (lapses > 0)
 */
export async function getCategorizedDueWords() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { newWords: [], reviewWords: [], lapsedWords: [] };

  const nowIso = new Date().toISOString();

  // 1) Due (gördüğü, vakti gelmiş) kelimeler — word_progress join words
  const { data: dueRows, error: dueErr } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("lapses, repetitions, due_at, words(*)")
    .eq("user_id", user.id)
    .lte("due_at", nowIso);
  if (dueErr) console.warn("categorized.due", dueErr.message);

  const dueAll = (dueRows || [])
    .filter((r) => r.words)
    .map((r) => ({ ...r.words, lapses: r.lapses, repetitions: r.repetitions }));

  const reviewWords = dueAll.filter((w) => (w.lapses ?? 0) === 0);
  const lapsedWords = dueAll.filter((w) => (w.lapses ?? 0) > 0);

  // 2) Hiç görmediği (yeni) kelimeler — public listelerden, progress yok
  // Önce kullanıcının erişebildiği tüm word_id'leri al, sonra progress kaydı olmayanları filtrele
  const { data: allWords } = await supabase
    .from("words")
    .select("id, word, meaning, example, list_id, lists!inner(is_public, user_id)")
    .limit(500);

  const visibleWords = (allWords || []).filter(
    (w) => w.lists?.is_public === true || w.lists?.user_id === user.id
  );

  const seenIds = new Set(
    (dueRows || []).map((r) => r.words?.id).filter(Boolean)
  );
  // Ayrıca tüm progress kayıtlarını da al (due olmayan da dahil)
  const { data: allProgress } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("word_id")
    .eq("user_id", user.id);
  (allProgress || []).forEach((p) => seenIds.add(p.word_id));

  const newWords = visibleWords
    .filter((w) => !seenIds.has(w.id))
    .slice(0, 30);

  return { newWords, reviewWords, lapsedWords };
}

export async function getDueCount() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;
  const { count, error } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("due_at", new Date().toISOString());
  if (error) return 0;
  return count ?? 0;
}

export async function startSession({ list_id, mode }) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from(TABLES.STUDY_SESSIONS)
    .insert([{ user_id: user.id, list_id, mode }])
    .select()
    .single();
  if (error) {
    console.warn("startSession", error.message);
    return null;
  }
  return data;
}

export async function finishSession(id, { total_words, correct, duration_sec }) {
  if (!id) return;
  const { data } = await supabase
    .from(TABLES.STUDY_SESSIONS)
    .update({
      total_words,
      correct,
      duration_sec,
      finished_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("list_id")
    .single();

  // Bu listenin public study_count'unu +1
  if (data?.list_id) {
    await supabase.rpc("increment_list_study_count", { p_list_id: data.list_id }).catch(() => {});
  }
}

export async function getStudyStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { totalSessions: 0, totalWords: 0, streakDays: 0 };
  const { data } = await supabase
    .from(TABLES.STUDY_SESSIONS)
    .select("total_words, started_at")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false })
    .limit(365);
  const rows = data ?? [];
  const totalWords = rows.reduce((s, r) => s + (r.total_words ?? 0), 0);

  // Streak server-side RPC — timezone-aware (audit #10 fix)
  // Fallback: RPC başarısız olursa client-side hesap
  let streakDays = 0;
  try {
    const { data: rpcData, error: rpcErr } = await supabase.rpc("get_streak_days");
    if (!rpcErr && typeof rpcData === "number") {
      streakDays = rpcData;
    } else {
      // Fallback — eski client-side hesap
      const days = new Set(rows.map((r) => new Date(r.started_at).toDateString()));
      const day = new Date();
      if (!days.has(day.toDateString())) day.setDate(day.getDate() - 1);
      while (days.has(day.toDateString())) {
        streakDays += 1;
        day.setDate(day.getDate() - 1);
      }
    }
  } catch {
    /* fallback already 0 */
  }

  return { totalSessions: rows.length, totalWords, streakDays };
}

/**
 * Kullanıcının cihaz timezone'unu sunucuya yaz (login sonrası bir kere).
 * IANA TZ string. Audit #10 — server-side streak doğru çalışsın diye.
 */
export async function syncMyTimezone() {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    await supabase.rpc("update_my_timezone", { p_tz: tz });
  } catch {
    /* sessiz fail — kritik değil */
  }
}

/**
 * Son N günün aktivitesini { dateKey: { count, words } } olarak döndür.
 * GitHub contribution graph tarzı görselleştirme için.
 */
export async function getDailyActivity(days = 30) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from(TABLES.STUDY_SESSIONS)
    .select("total_words, started_at")
    .eq("user_id", user.id)
    .gte("started_at", since.toISOString());

  const map = {};
  for (const row of data ?? []) {
    const k = new Date(row.started_at).toDateString();
    if (!map[k]) map[k] = { sessions: 0, words: 0 };
    map[k].sessions += 1;
    map[k].words += row.total_words ?? 0;
  }

  // Son N günü sıralı array olarak çıkar (eski → yeni)
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const k = d.toDateString();
    result.push({
      date: new Date(d),
      sessions: map[k]?.sessions ?? 0,
      words: map[k]?.words ?? 0,
    });
  }
  return result;
}

/**
 * Kullanıcının "öğrenmiş sayılan" kelimelerinden N tane rastgele çek.
 * Tanım: repetitions >= 2 ve lapses < 2 → kelime stabil öğrenilmiş.
 * Random review modal için kullanılır.
 *
 * @param {number} count — kaç kelime
 * @returns {Promise<Array>} words array (id, word, meaning, example, example_tr, list_id)
 */
export async function getRandomKnownWords(count = 10) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  // 1) Öğrenilmiş word_id'leri çek — eşik gevşetildi: 1+ doğru cevap yeterli
  const { data: progressRows, error: pErr } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("word_id, repetitions, lapses, last_reviewed")
    .eq("user_id", user.id)
    .gte("repetitions", 1)
    .lt("lapses", 2)
    .order("last_reviewed", { ascending: false })
    .limit(500); // top 500 known

  if (pErr || !progressRows?.length) return [];

  // 2) Rastgele N tane seç
  const shuffled = [...progressRows].sort(() => Math.random() - 0.5);
  const picked = shuffled.slice(0, count);
  const ids = picked.map((r) => r.word_id);

  // 3) Kelime detaylarını al
  const { data: words, error: wErr } = await supabase
    .from(TABLES.WORDS)
    .select("id, word, meaning, example, example_tr, list_id")
    .in("id", ids);

  if (wErr) {
    console.warn("getRandomKnownWords words fetch", wErr.message);
    return [];
  }

  // Orijinal sıraya göre dön (id sırası rastgele zaten)
  return words || [];
}

/**
 * Kaç tane öğrenilmiş kelimesi olduğunu döndür — modal'da "Toplam X kelime biliyorsun" göstermek için.
 */
export async function getKnownWordsCount() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count, error } = await supabase
    .from(TABLES.WORD_PROGRESS)
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("repetitions", 1);

  if (error) return 0;
  return count || 0;
}
