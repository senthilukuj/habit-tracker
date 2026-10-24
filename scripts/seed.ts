import { addHabit, setCompletion } from "../lib/habits";
import { addDays, todayLocal } from "../lib/dates";

const today = todayLocal();

// offsets = how many days ago each completion happened (0 = today)
function seed(name: string, offsets: number[]) {
  const id = addHabit(name);
  for (const o of offsets) setCompletion(id, addDays(today, -o), true);
}

seed("Seed: today + 3 days before", [0, 1, 2, 3]); // expect 4
seed("Seed: yesterday + 2 before", [1, 2, 3]); // expect 3
seed("Seed: gap", [0, 1, 3, 4, 5]); // expect 2
seed("Seed: stale", [2, 3, 4]); // expect 0
seed("Seed: none", []); // expect 0

console.log("Seeded 5 habits for", today);