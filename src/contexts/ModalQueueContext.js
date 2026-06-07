/**
 * ModalQueueContext — milestone / achievement / nudge tek queue.
 *
 * Audit #8 fix: 3 ayrı kaynak (useMilestoneWatcher, useBadgeWatcher, useNudge)
 * aynı anda tetiklendiğinde 3 modal üst üste binebiliyordu.
 *
 * Bu context ortak bir kuyruk tutar; eklenen modal sıraya girer, biri
 * dismiss edildiğinde sıradaki açılır.
 *
 * Priority sırası: "milestone" > "achievement" > "nudge"
 */
import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

const ModalQueueContext = createContext(null);

const PRIORITY = { milestone: 3, achievement: 2, nudge: 1 };

export function ModalQueueProvider({ children }) {
  const [queue, setQueue] = useState([]);
  // dedup için anahtar setı — aynı modal'ı 2 kez kuyruğa eklemesin
  const seenKeysRef = useRef(new Set());

  const enqueue = useCallback((modal) => {
    if (!modal || !modal.type) return;
    const key = modal.key || `${modal.type}:${modal.id ?? Date.now()}`;
    if (seenKeysRef.current.has(key)) return;
    seenKeysRef.current.add(key);

    setQueue((q) => {
      const next = [...q, { ...modal, key }];
      // Priority-aware: yüksek priority önce gelsin
      next.sort((a, b) => (PRIORITY[b.type] ?? 0) - (PRIORITY[a.type] ?? 0));
      return next;
    });
  }, []);

  const dismiss = useCallback((key) => {
    setQueue((q) => {
      const next = q.filter((m) => m.key !== key);
      // Dismiss sonrası key set'ten çıkar — aynı modal sonra tekrar tetiklenebilir
      seenKeysRef.current.delete(key);
      return next;
    });
  }, []);

  const current = queue[0] || null;

  const value = useMemo(
    () => ({ current, enqueue, dismiss, depth: queue.length }),
    [current, enqueue, dismiss, queue.length]
  );

  return <ModalQueueContext.Provider value={value}>{children}</ModalQueueContext.Provider>;
}

export function useModalQueue() {
  const ctx = useContext(ModalQueueContext);
  if (!ctx) {
    // Provider yoksa no-op (test/storybook için safe)
    return {
      current: null,
      enqueue: () => {},
      dismiss: () => {},
      depth: 0,
    };
  }
  return ctx;
}
