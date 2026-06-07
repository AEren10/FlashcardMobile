/**
 * Offline Study Queue
 * Offline iken recordReview + finishSession çağrılarını AsyncStorage'da biriktirir,
 * online olunca sırayla flush eder.
 *
 * Audit #15 fix:
 *   - read+write atomic değildi → paralel enqueue = item kaybı
 *   - Serial mutex eklendi (tüm queue mutasyonları sırada)
 *   - Dead-letter sub-key (5x retry sonrası kaybolmuyor, debug edilebilir)
 */
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { recordReview, finishSession } from "../supabase/progress";

const KEY = "@fc:offlineQueue";
const DEAD_KEY = "@fc:offlineQueueDead";
const MAX_QUEUE = 500;
const MAX_RETRIES = 5;

// --- Mutex ---
// Tüm queue read+write işlemleri bu zincirde sıralanır.
// Paralel enqueueReview/enqueueFinishSession → seri olarak işlenir.
let _chain = Promise.resolve();
function withLock(fn) {
  const next = _chain.then(fn, fn);
  // Hata propagation engellemek için zincire silent geç
  _chain = next.then(
    () => {},
    () => {}
  );
  return next;
}

async function readRaw() {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeRaw(items) {
  await AsyncStorage.setItem(KEY, JSON.stringify(items));
}

async function appendDead(items) {
  if (!items.length) return;
  try {
    const raw = await AsyncStorage.getItem(DEAD_KEY);
    const dead = raw ? JSON.parse(raw) : [];
    const all = [...dead, ...items].slice(-200); // dead-letter cap
    await AsyncStorage.setItem(DEAD_KEY, JSON.stringify(all));
  } catch {
    /* sessiz */
  }
}

function cap(q) {
  return q.length > MAX_QUEUE ? q.slice(q.length - MAX_QUEUE) : q;
}

let _seq = 0;
function nextSeq() {
  _seq = (_seq + 1) % Number.MAX_SAFE_INTEGER;
  return Date.now() * 1000 + _seq;
}

export async function enqueueReview(wordId, grade) {
  return withLock(async () => {
    const q = await readRaw();
    q.push({ type: "review", wordId, grade, ts: Date.now(), seq: nextSeq() });
    await writeRaw(cap(q));
  });
}

export async function enqueueFinishSession(sessionId, payload) {
  if (!sessionId) return;
  return withLock(async () => {
    const q = await readRaw();
    q.push({ type: "finish", sessionId, payload, ts: Date.now(), seq: nextSeq() });
    await writeRaw(cap(q));
  });
}

let flushing = false;

export async function flush() {
  if (flushing) return;
  flushing = true;
  try {
    const state = await NetInfo.fetch();
    if (!state.isConnected) return;

    // Snapshot al + queue'yu boşalt (mutex altında)
    const snapshot = await withLock(async () => {
      const q = await readRaw();
      await writeRaw([]);
      return q;
    });

    // Seq sırasında işle
    const sorted = [...snapshot].sort((a, b) => (a.seq ?? a.ts) - (b.seq ?? b.ts));
    const failed = [];
    const dead = [];

    for (const item of sorted) {
      try {
        if (item.type === "review") await recordReview(item.wordId, item.grade);
        else if (item.type === "finish") await finishSession(item.sessionId, item.payload);
      } catch {
        const retries = (item.retries ?? 0) + 1;
        if (retries < MAX_RETRIES) {
          failed.push({ ...item, retries });
        } else {
          dead.push({ ...item, retries, deadAt: Date.now() });
        }
      }
    }

    // Failed item'ları geri kuyruğa ekle (mutex altında — flush sırasında gelen yeni item'ları korur)
    if (failed.length) {
      await withLock(async () => {
        const current = await readRaw();
        const merged = [...failed, ...current].sort(
          (a, b) => (a.seq ?? a.ts) - (b.seq ?? b.ts)
        );
        await writeRaw(cap(merged));
      });
    }

    // Dead-letter — Sentry'de görmek için ayrı key'de tut
    if (dead.length) await appendDead(dead);
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

/** Debug için dead-letter listesini oku */
export async function getDeadLetters() {
  try {
    const raw = await AsyncStorage.getItem(DEAD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
