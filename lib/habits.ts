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

export async function addHabit(name: string): Promise<number> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Habit name is required");

  const result = await db.execute({
    sql: "INSERT INTO habits (name, created_at) VALUES (?, ?)",
    args: [trimmed, new Date().toISOString()],
  });

  return Number(result.lastInsertRowid);
}

export async function listHabits(today: string = todayLocal()): Promise<Habit[]> {
  const habitsResult = await db.execute(
    "SELECT id, name, created_at AS createdAt FROM habits ORDER BY id"
  );
  const habits = habitsResult.rows as unknown as Array<{
    id: number;
    name: string;
    createdAt: string;
  }>;

  const completionsResult = await db.execute(
    "SELECT habit_id AS habitId, date FROM completions"
  );
  const completions = completionsResult.rows as unknown as Array<{
    habitId: number;
    date: string;
  }>;

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

export async function setCompletion(
  habitId: number,
  date: string,
  done: boolean
): Promise<void> {
  if (done) {
    await db.execute({
      sql: "INSERT OR IGNORE INTO completions (habit_id, date) VALUES (?, ?)",
      args: [habitId, date],
    });
  } else {
    await db.execute({
      sql: "DELETE FROM completions WHERE habit_id = ? AND date = ?",
      args: [habitId, date],
    });
  }
}