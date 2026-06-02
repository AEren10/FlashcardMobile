/**
 * SRS — SM-2 light.
 * Grade: 0=Again, 1=Hard, 2=Good, 3=Easy
 * Mevcut ilerleme kaydından bir sonraki interval + ease + due_at üretir.
 */

const MIN_EASE = 1.3;

export function nextProgress(prev, grade) {
  const p = {
    ease: prev?.ease ?? 2.5,
    interval_days: prev?.interval_days ?? 0,
    repetitions: prev?.repetitions ?? 0,
    lapses: prev?.lapses ?? 0,
  };

  let { ease, interval_days, repetitions, lapses } = p;

  if (grade === 0) {
    // Again — reset
    repetitions = 0;
    interval_days = 0;
    lapses += 1;
    ease = Math.max(MIN_EASE, ease - 0.2);
  } else {
    if (repetitions === 0) interval_days = grade === 3 ? 3 : 1;
    else if (repetitions === 1) interval_days = grade === 3 ? 6 : 3;
    else interval_days = Math.round(interval_days * ease);

    // ease tuning
    if (grade === 1) ease = Math.max(MIN_EASE, ease - 0.15);
    if (grade === 3) ease = ease + 0.1;

    repetitions += 1;
  }

  const due = new Date();
  due.setDate(due.getDate() + Math.max(interval_days, 0));
  // Again ise 10 dk sonra
  if (grade === 0) due.setTime(Date.now() + 10 * 60 * 1000);

  return {
    ease,
    interval_days,
    repetitions,
    lapses,
    due_at: due.toISOString(),
    last_reviewed: new Date().toISOString(),
  };
}

export const GRADE = { AGAIN: 0, HARD: 1, GOOD: 2, EASY: 3 };
