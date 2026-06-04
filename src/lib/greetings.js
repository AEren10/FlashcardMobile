/**
 * Greetings — saat + streak + günün gününe göre değişen motivasyonel açılış.
 *
 * Stüdyo tonu: sıcak, samimi, "sen" diliyle. Asla zorlayıcı değil, motive edici.
 * Deterministic seed = tarih (YYYY-MM-DD) → aynı gün açılan her seferde aynı.
 *
 * Kullanım:
 *   import { pickGreeting } from "../lib/greetings";
 *   const { headline, subline } = pickGreeting({ name, streak, hour });
 */

// Saat bandı → ton
const TIME_BANDS = {
  dawn: { hours: [5, 6, 7, 8], label: "sabah" },         // erken sabah
  morning: { hours: [9, 10, 11], label: "sabah" },       // sabah
  noon: { hours: [12, 13], label: "öğle" },              // öğle
  afternoon: { hours: [14, 15, 16, 17], label: "öğleden sonra" },
  evening: { hours: [18, 19, 20, 21], label: "akşam" },
  night: { hours: [22, 23, 0, 1, 2, 3, 4], label: "gece" },
};

function bandOf(hour) {
  for (const [key, b] of Object.entries(TIME_BANDS)) {
    if (b.hours.includes(hour)) return key;
  }
  return "morning";
}

// Selamlama prefiks — saatlik
const PREFIX = {
  dawn: ["Günaydın", "Merhaba", "Erken kalkmışsın"],
  morning: ["Günaydın", "Selam", "Merhaba"],
  noon: ["Merhaba", "İyi öğlenler", "Selam"],
  afternoon: ["Merhaba", "İyi günler", "Selam"],
  evening: ["İyi akşamlar", "Hoş geldin", "Merhaba"],
  night: ["İyi geceler", "Hâlâ ayakta mısın", "Merhaba"],
};

// Streak-aware subline havuzu — kategoriler
const SUBLINES = {
  // Hiç streak yok — başlatma daveti
  noStreak: [
    "Bugün küçük bir adımla başlayabiliriz",
    "5 dakika, 5 kelime — bu kadar basit",
    "Bir kelime bile başlangıçtır",
    "İlk gün her şeyin başlangıcı",
    "Bugün yeni bir sayfa açalım",
    "Sıfırdan başlamak da güzel",
  ],
  // 1-2 gün — momentum oluşuyor
  building: [
    "Momentum tutuyor, devam et",
    "Üst üste {streak} gün — alev tütüyor",
    "Bir gün daha eklersen seri başlar",
    "Bugün de bir kelime, yarın da",
    "Küçük günler büyük serilere döner",
  ],
  // 3-6 gün — alışkanlığa dönüşüyor
  flame: [
    "{streak} gündür devam — bu artık alışkanlık",
    "Alev tutuştu, söndürme",
    "Her gün biraz daha kolay olacak",
    "{streak}. günündesin, gurur duyabilirsin",
    "Bu seriye yazık olur, bir kelime at",
  ],
  // 7-29 gün — flame badge sonrası
  fire: [
    "{streak} gün — beynin artık İngilizce'ye aç",
    "Yangın büyüyor, odun atmaya devam",
    "Bu kadar tutarlılık nadirdir, biliyor musun?",
    "{streak}. gün ve hâlâ buradasın",
    "Disiplin böyle bir şey işte",
  ],
  // 30-99 gün — uzun mesafe
  longRun: [
    "{streak} gün — artık çoğu insandan öndesin",
    "Aylar geçiyor, sen hâlâ buradasın",
    "Bu seri bir tutku oldu",
    "{streak}. gün, vites yükselt",
    "Çoğu kişi bu noktayı görmez",
  ],
  // 100+ gün — efsane
  legend: [
    "{streak} gün. Sözcükler yetersiz",
    "Bu seri artık bir hikâye",
    "{streak}. gün — sen artık bir referansın",
    "Bu nokta için tebrikler az kalır",
    "Tarih yazıyorsun, biliyor musun?",
  ],
};

// Saatlik flavor — bazen subline yerine saatlik tonu ekle
const TIME_FLAVOR = {
  dawn: [
    "Şafakta çalışan beyne saygı",
    "Sabah erkenden — kafan en taze anı",
    "Bu saatte kelime, ekstra puan",
  ],
  morning: [
    "Güne 5 kelime ile başlamak iyi fikir",
    "Sabah beyni en açık olduğu zaman",
    "Kahveyle birlikte birkaç kelime?",
  ],
  noon: [
    "Öğle molasında küçük bir tekrar",
    "Bir kelime, sonra yemek",
    "15 dakikan var mı?",
  ],
  afternoon: [
    "Öğleden sonra hâlâ aktif misin?",
    "Günün yarısı bitti, bir hedef daha",
    "Kısa bir mola, sonra kelime",
  ],
  evening: [
    "Günün sonunda biraz tekrar",
    "Akşam beyni hatırlamaya hazır",
    "Bugüne küçük bir nokta koyalım",
  ],
  night: [
    "Geç vakit, ama buradasın",
    "Gece kuşlarına selam",
    "Uykudan önce 5 kelime, beyin pekiştirir",
  ],
};

/**
 * Tarihten deterministic random — aynı gün → aynı sonuç.
 * Hour da seed'e dahil — saat değişince selamlama da değişebilir.
 */
function dailySeed(hour) {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth() + 1;
  const d = now.getDate();
  // Saat band'ı da seed'e — sabah/akşam farklı greeting
  const h = Math.floor(hour / 4);
  return ((y * 372) + (m * 31) + d) * 7 + h;
}

function pick(arr, seed) {
  if (!arr || !arr.length) return null;
  return arr[Math.abs(seed) % arr.length];
}

function streakBucket(streak) {
  if (!streak || streak === 0) return "noStreak";
  if (streak < 3) return "building";
  if (streak < 7) return "flame";
  if (streak < 30) return "fire";
  if (streak < 100) return "longRun";
  return "legend";
}

/**
 * Ana selector. Her gün/saat aynı kullanıcıya aynı sonucu verir
 * ama farklı günlerde farklı.
 *
 * @param {object} opts
 * @param {string} opts.name — kullanıcı adı
 * @param {number} opts.streak — streakDays
 * @param {number} opts.hour — saat (0-23), default new Date().getHours()
 * @returns {{ headline: string, subline: string }}
 */
export function pickGreeting({ name = "", streak = 0, hour } = {}) {
  const h = typeof hour === "number" ? hour : new Date().getHours();
  const band = bandOf(h);
  const seed = dailySeed(h);

  const prefix = pick(PREFIX[band], seed) || "Merhaba";
  // headline = sade prefix (örn. "Günaydın") + name ayrı param ile gösterilir
  const headline = prefix;

  // Subline: %60 streak-aware, %40 time flavor — değişkenlik için
  const useStreak = (Math.abs(seed) % 10) < 6;
  const bucket = streakBucket(streak);
  const pool = useStreak ? SUBLINES[bucket] : TIME_FLAVOR[band];
  const raw = pick(pool, seed + 1) || "Bugün de bir adım atalım";
  const subline = raw.replace("{streak}", String(streak));

  return { headline, subline, name };
}

/** Test/preview için — belirli bir saat & streak'e göre. */
export function previewGreeting({ name, streak, hour }) {
  return pickGreeting({ name, streak, hour });
}
