import db from "./db";
import { todayLocal } from "./dates";

export type Habit = {
  id: number;
  name: string;
  createdAt: string;
  doneToday: boolean;
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
  const rows = db
    .prepare(
      `SELECT
         h.id,
         h.name,
         h.created_at AS createdAt,
         EXISTS (
           SELECT 1 FROM completions c
           WHERE c.habit_id = h.id AND c.date = ?
         ) AS doneToday
       FROM habits h
       ORDER BY h.id`
    )
    .all(today) as Array<Omit<Habit, "doneToday"> & { doneToday: number }>;

  return rows.map((r) => ({ ...r, doneToday: r.doneToday === 1 }));
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