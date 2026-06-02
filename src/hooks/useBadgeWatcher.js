/**
 * useBadgeWatcher — kullanıcı yeni bir rozet kazandığında AchievementModal tetikler.
 * Persist edilen son-görülen eşiği AsyncStorage'da tutar.
 * Daha önce görülen rozet tekrar gösterilmez.
 */
import { useEffect, useState, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STREAK_BADGES, WORDS_BADGES } from "../lib/badges";

const KEY_SEEN = "@fc:seenBadges";

export default function useBadgeWatcher({ streakDays, totalWords, enabled = true }) {
  const [newBadge, setNewBadge] = useState(null);
  const [seenBadges, setSeenBadges] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(KEY_SEEN);
        setSeenBadges(raw ? JSON.parse(raw) : []);
      } catch {
        setSeenBadges([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!enabled || seenBadges == null) return;

    // Find the highest unlocked badge that hasn't been seen.
    const candidates = [];
    for (const b of STREAK_BADGES) {
      if (streakDays >= b.threshold) {
        const key = `streak:${b.key}`;
        if (!seenBadges.includes(key)) candidates.push({ ...b, _seenKey: key });
      }
    }
    for (const b of WORDS_BADGES) {
      if (totalWords >= b.threshold) {
        const key = `words:${b.key}`;
        if (!seenBadges.includes(key)) candidates.push({ ...b, _seenKey: key });
      }
    }

    if (candidates.length > 0) {
      const top = candidates[candidates.length - 1];
      setNewBadge({
        emoji: top.emoji,
        label: top.label,
        description: top.description || `${top.threshold}+ eşiği aşıldı, harikasın!`,
        _seenKey: top._seenKey,
      });
    }
  }, [enabled, streakDays, totalWords, seenBadges]);

  const dismiss = useCallback(async () => {
    if (!newBadge) return;
    const next = [...(seenBadges || []), newBadge._seenKey];
    setSeenBadges(next);
    setNewBadge(null);
    try {
      await AsyncStorage.setItem(KEY_SEEN, JSON.stringify(next));
    } catch {}
  }, [newBadge, seenBadges]);

  return { newBadge, dismiss };
}
