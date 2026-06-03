/**
 * SRS — SM-2 light + Ease-Hell guard + Graduate bypass.
 *
 * Grade: 0=Again, 1=Hard, 2=Good, 3=Easy, 4=GRADUATE (Bu kelimeyi biliyorum)
 *
 * Ease-Hell koruması:
 *   - 4+ lapse sonrası kart "leech" sayılır → ease 2.0'a reset, interval 1 güne sıfırla
 *   - Ease tabanı MIN_EASE=1.5'e yükseltildi (önceden 1.3 idi, çok düşüktü)
 *   - Interval cap: 60 gün (sonsuza gitmesin — gerçekten unutulursa tekrar görsün)
 *
 * Graduate (4): kullanıcı "Bu kelimeyi biliyorum" derse → ease 2.7, interval 21 gün → 1 yıl sonra döner.
 */

const MIN_EASE = 1.5;
const MAX_INTERVAL = 60; // gün
const LEECH_THRESHOLD = 4; // bu kadar lapse'ten sonra ease reset

export const GRADE = {
  AGAIN: 0,
  HARD: 1,
  GOOD: 2,
  EASY: 3,
  GRADUATE: 4, // Bu kelimeyi biliyorum, SRS'ten çıkar
};

export function nextProgress(prev, grade) {
  const p = {
    ease: prev?.ease ?? 2.5,
    interval_days: prev?.interval_days ?? 0,
    repetitions: prev?.repetitions ?? 0,
    lapses: prev?.lapses ?? 0,
  };

  let { ease, interval_days, repetitions, lapses } = p;

  // GRADUATE — kullanıcı bu kelimeyi bildiğini söyledi
  if (grade === GRADE.GRADUATE) {
    ease = 2.7;
    interval_days = 21;
    repetitions = Math.max(repetitions, 3);
    const due = new Date();
    due.setDate(due.getDate() + interval_days);
    return {
      ease,
      interval_days,
      repetitions,
      lapses,
      due_at: due.toISOString(),
      last_reviewed: new Date().toISOString(),
      graduated: true,
    };
  }

  if (grade === GRADE.AGAIN) {
    repetitions = 0;
    interval_days = 0;
    lapses += 1;
    ease = Math.max(MIN_EASE, ease - 0.2);

    // Ease-Hell guard: leech kartı reset et
    if (lapses >= LEECH_THRESHOLD) {
      ease = 2.0;
      lapses = 0; // counter sıfırla
    }
  } else {
    if (repetitions === 0) interval_days = grade === GRADE.EASY ? 3 : 1;
    else if (repetitions === 1) interval_days = grade === GRADE.EASY ? 6 : 3;
    else interval_days = Math.round(interval_days * ease);

    // Interval cap
    if (interval_days > MAX_INTERVAL) interval_days = MAX_INTERVAL;

    if (grade === GRADE.HARD) ease = Math.max(MIN_EASE, ease - 0.15);
    if (grade === GRADE.EASY) ease = ease + 0.1;

    repetitions += 1;
  }

  const due = new Date();
  due.setDate(due.getDate() + Math.max(interval_days, 0));
  if (grade === GRADE.AGAIN) due.setTime(Date.now() + 10 * 60 * 1000);

  return {
    ease,
    interval_days,
    repetitions,
    lapses,
    due_at: due.toISOString(),
    last_reviewed: new Date().toISOString(),
  };
}
