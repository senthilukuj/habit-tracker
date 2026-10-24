import db from "./db";
import { todayLocal } from "./dates";
import { calcStreak } from "./streak";

export type Habit = {
  id: number;
  name: string;
  createdAt: string;
  doneToday: boolean;
  streak: number;
};

export function addHabit(name: string): number {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Habit name is required");

  const result = db
    .prepare("INSERT INTO habits (name, created_at) VALUES (?, ?)")
    .run(trimmed, new Date().toISOString());

  return Number(result.lastInsertRowid);
}

export function listHabits(today: string = todayLocal()): Habit[] {
  const habits = db
    .prepare(
      "SELECT id, name, created_at AS createdAt FROM habits ORDER BY id"
    )
    .all() as Array<{ id: number; name: string; createdAt: string }>;

  const completions = db
    .prepare("SELECT habit_id AS habitId, date FROM completions")
    .all() as Array<{ habitId: number; date: string }>;

  const datesByHabit = new Map<number, string[]>();
  for (const c of completions) {
    const list = datesByHabit.get(c.habitId) ?? [];
    list.push(c.date);
    datesByHabit.set(c.habitId, list);
  }

  return habits.map((h) => {
    const dates = datesByHabit.get(h.id) ?? [];
    return {
      ...h,
      doneToday: dates.includes(today),
      streak: calcStreak(dates, today),
    };
  });
}

export function setCompletion(
  habitId: number,
  date: string,
  done: boolean
): void {
  if (done) {
    db.prepare(
      "INSERT OR IGNORE INTO completions (habit_id, date) VALUES (?, ?)"
    ).run(habitId, date);
  } else {
    db.prepare("DELETE FROM completions WHERE habit_id = ? AND date = ?").run(
      habitId,
      date
    );
  }
}