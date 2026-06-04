/**
 * @deprecated — Tüm kategori bilgileri artık `src/lib/categoryMeta.js`'de.
 * Geriye uyumluluk için re-export ediyoruz. Yeni kodda direkt categoryMeta kullan.
 */
import {
  CATEGORIES,
  getCategoryName,
  getCategoryStops,
  normalizeCategorySlug,
} from "../lib/categoryMeta";

// Eski API ile uyum: CATS[slug] yapısı
export const CATS = Object.fromEntries(
  Object.entries(CATEGORIES).map(([slug, meta]) => [
    slug,
    { name: meta.name, stops: meta.stops },
  ])
);

export const catName = getCategoryName;
export const catStops = getCategoryStops;

export { normalizeCategorySlug };
