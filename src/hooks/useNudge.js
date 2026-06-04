/**
 * useNudge — kullanıcı HomeScreen'deyken bazen tatlı bir öneri pop-up'ı gösterir.
 *
 * Tetikleme kuralları:
 *   1. Aynı oturum içinde en fazla 1 nudge gösterilir
 *   2. Aynı tip nudge en az 12 saatte bir tekrar gösterilebilir
 *   3. HomeScreen'e en az 2 odaklanma sonrasında gösterilir (hemen ezici olmasın)
 *   4. Stats yüklenmiş olmalı
 *
 * Seçim:
 *   - Yanlış kelime sayısı >= 5 → mistake_focus (warning glow, target ikon)
 *   - Bilinen kelime >= 10 → known_review (cobalt, refresh ikon)
 *   - Yeni öğrenmediği büyük public liste varsa → discover (accent, sparkle)
 */
import { useCallback, useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ICONS } from "../components/design/Icon";

const STORAGE_KEY = "@fc:nudge_log"; // { [type]: timestamp }
const COOLDOWN_MS = 12 * 60 * 60 * 1000; // 12 saat
const MIN_FOCUS_COUNT = 2; // En az 2. focus'ta göster

async function loadLog() {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

async function saveLog(log) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

function buildCandidates({ stats, mistakesCount, knownCount }) {
  const out = [];
  if (mistakesCount >= 5) {
    out.push({
      type: "mistake_focus",
      title: "Sana özel",
      headline: "Sık yanlış yaptığın kelimeleri hızlıca pekiştirelim",
      sub: `${mistakesCount} kelime bekliyor — 5 dakikan var mı?`,
      icon: ICONS.target,
      color: "#C13E5C",
      ctaLabel: "Hemen başla",
      action: "open_mistakes",
    });
  }
  if (knownCount >= 10) {
    out.push({
      type: "known_review",
      title: "Sana özel",
      headline: "Bildiklerini tekrar etmek ister misin?",
      sub: `${knownCount} öğrendiğin kelime arasından rastgele seçelim`,
      icon: ICONS.sparkle,
      color: "#7BAEC8",
      ctaLabel: "Hemen başla",
      action: "open_random_review",
    });
  }
  if ((stats?.streakDays || 0) >= 3 && (stats?.totalWords || 0) >= 20) {
    out.push({
      type: "challenge",
      title: "Meydan okuma",
      headline: "Bugün 10 kelime daha öğrenmeye var mısın?",
      sub: "Seriyi büyütmenin en hızlı yolu",
      icon: ICONS.bolt,
      color: "#D4AE5E",
      ctaLabel: "Başla",
      action: "open_challenge",
    });
  }
  return out;
}

/**
 * @param {object} opts
 * @param {object} opts.stats — { streakDays, totalWords }
 * @param {number} opts.mistakesCount — kullanıcının "Bilemediğin Kelimeler" listesi
 * @param {number} opts.knownCount — bilinen kelime sayısı
 * @param {boolean} opts.ready — stats yüklenmiş mi (true ise tetikleyebilir)
 * @returns { nudge, accept(), dismiss() }
 */
export default function useNudge({ stats, mistakesCount = 0, knownCount = 0, ready = false }) {
  const [nudge, setNudge] = useState(null);
  const [log, setLog] = useState(null);
  const focusCount = useRef(0);
  const shownThisSession = useRef(false);

  useEffect(() => {
    loadLog().then(setLog);
  }, []);

  // Stats hazır olduğunda, ilk uygun nudge'ı seç ve göster
  useEffect(() => {
    if (!ready || log === null || shownThisSession.current) return;
    focusCount.current += 1;
    if (focusCount.current < MIN_FOCUS_COUNT) return;

    const candidates = buildCandidates({ stats, mistakesCount, knownCount });
    const now = Date.now();
    const fresh = candidates.find((c) => {
      const last = log[c.type] || 0;
      return now - last >= COOLDOWN_MS;
    });
    if (!fresh) return;

    // 2 saniye gecikme — sayfa yerleşmeden ezici olmasın
    const t = setTimeout(() => {
      shownThisSession.current = true;
      setNudge(fresh);
    }, 2000);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, log, mistakesCount, knownCount, stats?.streakDays, stats?.totalWords]);

  const dismiss = useCallback(async () => {
    if (!nudge) return;
    const type = nudge.type;
    setNudge(null);
    const next = { ...(log || {}), [type]: Date.now() };
    setLog(next);
    saveLog(next);
  }, [nudge, log]);

  const accept = useCallback(async () => {
    if (!nudge) return null;
    const action = nudge.action;
    await dismiss();
    return action;
  }, [nudge, dismiss]);

  return { nudge, accept, dismiss };
}
