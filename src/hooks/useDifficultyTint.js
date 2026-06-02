/**
 * useDifficultyTint — bir liste açıldığında o listenin zorluk seviyesine
 * göre o ekrandaki tint renkleri döndürür.
 *
 * Component'ler bu hook'tan tint'i alıp button/badge/glow için kullanır.
 * Brand renk (tab indicator, FAB) bundan etkilenmez.
 *
 * Kullanım:
 *   const tint = useDifficultyTint(list.level);
 *   <Button style={{ backgroundColor: tint.color }}>...</Button>
 */
import { useMemo } from "react";
import { getDifficulty } from "../themes/difficulty";

export default function useDifficultyTint(level) {
  return useMemo(() => getDifficulty(level), [level]);
}
