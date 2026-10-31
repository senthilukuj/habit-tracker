import { addHabit, setCompletion } from "../lib/habits";
import { addDays, todayLocal } from "../lib/dates";

const today = todayLocal();

// offsets = how many days ago each completion happened (0 = today)
async function seed(name: string, offsets: number[]) {
  const id = await addHabit(name);
  for (const o of offsets) await setCompletion(id, addDays(today, -o), true);
}

await seed("Seed: today + 3 days before", [0, 1, 2, 3]); // expect 4
await seed("Seed: yesterday + 2 before", [1, 2, 3]); // expect 3
await seed("Seed: gap", [0, 1, 3, 4, 5]); // expect 2
await seed("Seed: stale", [2, 3, 4]); // expect 0
await seed("Seed: none", []); // expect 0

console.log("Seeded 5 habits for", today);
