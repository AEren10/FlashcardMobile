/**
 * Offline Study Queue
 * Offline iken recordReview + finishSession çağrılarını AsyncStorage'da biriktirir,
 * online olunca sırayla flush eder.
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { recordReview, finishSession } from "../supabase/progress";

const KEY = "@fc:offlineQueue";
const MAX_QUEUE = 500;

async function read() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function write(items) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

function cap(q) {
  return q.length > MAX_QUEUE ? q.slice(q.length - MAX_QUEUE) : q;
}

export async function enqueueReview(wordId, grade) {
  const q = await read();
  q.push({ type: "review", wordId, grade, ts: Date.now() });
  await write(cap(q));
}

export async function enqueueFinishSession(sessionId, payload) {
  if (!sessionId) return;
  const q = await read();
  q.push({ type: "finish", sessionId, payload, ts: Date.now() });
  await write(cap(q));
}

let flushing = false;

export async function flush() {
  if (flushing) return;
  flushing = true;
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;
    let q = await read();
    const remaining = [];
    for (const item of q) {
      try {
        if (item.type === "review") await recordReview(item.wordId, item.grade);
        else if (item.type === "finish") await finishSession(item.sessionId, item.payload);
      } catch {
        const retries = (item.retries ?? 0) + 1;
        if (retries < 5) remaining.push({ ...item, retries });
      }
    }
    await write(remaining);
  } finally {
    flushing = false;
  }
}

export function startAutoFlush() {
  const unsub = NetInfo.addEventListener((state) => {
    if (state.isConnected) flush();
  });
  flush();
  return unsub;
}

/**
 * Review çağrısını güvenli sar: online'a çalış, başarısızsa queue'ya yaz.
 */
export async function safeRecordReview(wordId, grade) {
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await enqueueReview(wordId, grade);
      return { queued: true };
    }
    await recordReview(wordId, grade);
    return { queued: false };
  } catch {
    await enqueueReview(wordId, grade);
    return { queued: true };
  }
}

export async function safeFinishSession(sessionId, payload) {
  if (!sessionId) return;
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) {
      await enqueueFinishSession(sessionId, payload);
      return { queued: true };
    }
    await finishSession(sessionId, payload);
    return { queued: false };
  } catch {
    await enqueueFinishSession(sessionId, payload);
    return { queued: true };
  }
}
