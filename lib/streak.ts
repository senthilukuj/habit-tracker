import { addDays } from "./dates";

/**
 * Current streak: consecutive days ending today or yesterday.
 * `dates` are 'YYYY-MM-DD' strings in any order; duplicates are harmless.
 */
export function calcStreak(dates: string[], today: string): number {
  const done = new Set(dates);

  let cursor: string;
  if (done.has(today)) cursor = today;
  else if (done.has(addDays(today, -1))) cursor = addDays(today, -1);
  else return 0;

  let streak = 0;
  while (done.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}