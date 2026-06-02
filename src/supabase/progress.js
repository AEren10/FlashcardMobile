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

  const days = new Set(rows.map((r) => new Date(r.started_at).toDateString()));
  let streak = 0;
  const day = new Date();
  if (!days.has(day.toDateString())) {
    day.setDate(day.getDate() - 1);
  }
  while (days.has(day.toDateString())) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }
  return { totalSessions: rows.length, totalWords, streakDays: streak };
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
