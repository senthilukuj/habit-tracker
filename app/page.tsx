import { listHabits } from "@/lib/habits";
import { todayLocal } from "@/lib/dates";
import { addHabitAction, toggleDoneAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const today = todayLocal();
  const habits = listHabits(today);

  return (
    <main>
      <h1>Habit Tracker</h1>
      <p>{today}</p>

      <form action={addHabitAction}>
        <input name="name" placeholder="New habit name" required />
        <button type="submit">Add</button>
      </form>

      <ul>
        {habits.map((h) => (
          <li key={h.id}>
            <form action={toggleDoneAction}>
              <input type="hidden" name="habitId" value={h.id} />
              <input type="hidden" name="done" value={String(!h.doneToday)} />
              <button type="submit">{h.doneToday ? "[x]" : "[ ]"}</button>{" "}
                {h.name} 🔥 {h.streak}
            </form>
          </li>
        ))}
      </ul>
    </main>
  );
}