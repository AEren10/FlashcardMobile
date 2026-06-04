/**
 * useMilestoneWatcher — kullanıcı stats'ı değişince yeni milestone tetiklenir mi diye bakar.
 * Tetiklenirse modal göstersin diye state döndürür; dismiss edilince AsyncStorage'a yazılır.
 *
 * Pattern: AchievementsContext'e benzer ama event-based (ilk-X).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { detectNewMilestones, getMilestone } from "../lib/milestones";

const STORAGE_KEY = "@fc:milestones_unlocked";

async function loadUnlocked() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

async function saveUnlocked(keys) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  } catch {
    /* ignore */
  }
}

/**
 * @param {object} stats — { totalWords, streakDays, listsCompleted, perfectQuizCount, favoriteWordsCount }
 * @returns { current: milestone|null, dismiss: () => void }
 */
export default function useMilestoneWatcher(stats) {
  const [unlocked, setUnlocked] = useState(null); // null = henüz yüklenmedi
  const [queue, setQueue] = useState([]); // bekleyen milestone key'leri
  const [current, setCurrent] = useState(null);
  const initialized = useRef(false);

  // İlk yükleme — storage'tan unlocked listeyi çek
  useEffect(() => {
    loadUnlocked().then((keys) => {
      setUnlocked(keys);
      initialized.current = true;
    });
  }, []);

  // Stats değişince yeni milestone'lar tetiklenir mi bak
  useEffect(() => {
    if (!initialized.current || unlocked === null || !stats) return;
    const fresh = detectNewMilestones(stats, unlocked);
    if (fresh.length === 0) return;
    // Queue'ya ekle ve hemen göster
    setQueue((q) => {
      const next = [...q];
      for (const k of fresh) {
        if (!next.includes(k)) next.push(k);
      }
      return next;
    });
  }, [stats, unlocked]);

  // Queue'da bir şey varsa ve şu an gösterilen yoksa, sıradakini göster
  useEffect(() => {
    if (current || queue.length === 0) return;
    const next = queue[0];
    const m = getMilestone(next);
    if (m) setCurrent(m);
  }, [current, queue]);

  const dismiss = useCallback(async () => {
    if (!current) return;
    const key = current.key;
    setCurrent(null);
    setQueue((q) => q.filter((k) => k !== key));
    setUnlocked((u) => {
      const next = [...(u || []), key];
      saveUnlocked(next);
      return next;
    });
  }, [current]);

  return { current, dismiss };
}
