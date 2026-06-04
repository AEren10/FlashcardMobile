/**
 * AchievementsContext — Global rozet tetik sistemi.
 *
 * Kullanım:
 *   const { trigger, unlocked, refresh } = useAchievements();
 *
 *   // Bir kelime listesi oluşturulduğunda:
 *   trigger("list_created");
 *
 *   // Quiz tamamlandığında:
 *   trigger("quiz_completed");
 *   if (score === 100) trigger("perfect_quiz");
 *
 * Yeni bir achievement açıldığında AchievementModal otomatik gösterir.
 */
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ACHIEVEMENTS,
  getUnlockedKeys,
  getAchievementByKey,
} from "../lib/achievements";

const STORAGE_KEY = "@fc:achievements";
const EVENT_KEY = "@fc:achievements:events";

const AchievementsContext = createContext({
  unlocked: new Set(),
  events: new Set(),
  trigger: () => {},
  syncStats: () => {},
  refresh: () => {},
  newlyUnlocked: null,
  dismissNew: () => {},
});

export function AchievementsProvider({ children }) {
  const [events, setEvents] = useState(new Set());
  const [unlocked, setUnlocked] = useState(new Set());
  const [newlyUnlocked, setNewlyUnlocked] = useState(null);
  const lastStatsRef = useRef({});

  // Load persisted state
  useEffect(() => {
    (async () => {
      const [savedEvents, savedUnlocked] = await Promise.all([
        AsyncStorage.getItem(EVENT_KEY),
        AsyncStorage.getItem(STORAGE_KEY),
      ]);
      if (savedEvents) {
        try {
          setEvents(new Set(JSON.parse(savedEvents)));
        } catch {}
      }
      if (savedUnlocked) {
        try {
          setUnlocked(new Set(JSON.parse(savedUnlocked)));
        } catch {}
      }
    })();
  }, []);

  const persistEvents = useCallback((next) => {
    AsyncStorage.setItem(EVENT_KEY, JSON.stringify([...next])).catch(() => {});
  }, []);
  const persistUnlocked = useCallback((next) => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([...next])).catch(() => {});
  }, []);

  /**
   * Yeni bir event tetikle (örn. list_created, quiz_completed)
   */
  const trigger = useCallback(
    (eventName) => {
      // Event-based achievement bul
      const match = ACHIEVEMENTS.find(
        (a) => a.type === "event" && a.trigger === eventName
      );
      if (!match) return;
      if (events.has(match.key)) return; // zaten tetiklendi

      const newEvents = new Set(events);
      newEvents.add(match.key);
      setEvents(newEvents);
      persistEvents(newEvents);

      // Unlocked listesine ekle ve modalı tetikle
      if (!unlocked.has(match.key)) {
        const newUnlocked = new Set(unlocked);
        newUnlocked.add(match.key);
        setUnlocked(newUnlocked);
        persistUnlocked(newUnlocked);
        setNewlyUnlocked(match);
      }
    },
    [events, unlocked, persistEvents, persistUnlocked]
  );

  /**
   * Stats güncellendiğinde çağır — threshold'ları kontrol et
   * @param {object} stats — { streakDays, totalWords, totalSessions, accuracy, favoritedWords }
   */
  const syncStats = useCallback(
    (stats) => {
      lastStatsRef.current = stats;
      const all = getUnlockedKeys(stats, events);
      // Yeni unlock var mı?
      let firstNew = null;
      for (const k of all) {
        if (!unlocked.has(k) && !firstNew) {
          firstNew = getAchievementByKey(k);
        }
      }
      if (all.size > unlocked.size) {
        setUnlocked(all);
        persistUnlocked(all);
      }
      if (firstNew) setNewlyUnlocked(firstNew);
    },
    [events, unlocked, persistUnlocked]
  );

  const refresh = useCallback(() => {
    if (lastStatsRef.current) syncStats(lastStatsRef.current);
  }, [syncStats]);

  const dismissNew = useCallback(() => setNewlyUnlocked(null), []);

  return (
    <AchievementsContext.Provider
      value={{
        unlocked,
        events,
        trigger,
        syncStats,
        refresh,
        newlyUnlocked,
        dismissNew,
      }}
    >
      {children}
    </AchievementsContext.Provider>
  );
}

export function useAchievements() {
  return useContext(AchievementsContext);
}
