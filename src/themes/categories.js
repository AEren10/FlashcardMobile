/**
 * Semantic category palette — listelerin kategorisine göre cover gradient.
 * Design v2: brand-aligned saturated → muted.
 */
export const CATS = {
  daily:    { name: "Günlük Hayat", stops: ["#6FCB3E", "#3E8F1E", "#2C6614"] },
  business: { name: "İş",           stops: ["#6E8CFF", "#3B5BDB", "#27408F"] },
  travel:   { name: "Seyahat",      stops: ["#FFC861", "#F59E0B", "#B45309"] },
  academic: { name: "Akademik",     stops: ["#B07BEA", "#8B5CF6", "#5B2E94"] },
  popular:  { name: "Popüler",      stops: ["#FF8B73", "#F4674E", "#B23A2E"] },
  other:    { name: "Diğer",        stops: ["#94A2B2", "#6B7785", "#48535F"] },
};

export const catName = (cat) => (CATS[cat] || CATS.other).name;

export const catStops = (cat) => (CATS[cat] || CATS.other).stops;
