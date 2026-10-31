import { listHabits } from "@/lib/habits";
import { todayLocal } from "@/lib/dates";
import { addHabitAction, toggleDoneAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const today = todayLocal();
  const habits = await listHabits(today);
  const prettyDate = new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <main>
      <h1>Habit Tracker</h1>
      <p className="date">{prettyDate}</p>

      <form action={addHabitAction} className="add-form">
        <input name="name" placeholder="New habit name" required />
        <button type="submit">Add</button>
      </form>

      {habits.length === 0 ? (
        <p className="empty">No habits yet. Add your first one above.</p>
      ) : (
        <ul className="habits">
          {habits.map((h) => (
            <li key={h.id} className={`habit${h.doneToday ? " done" : ""}`}>
              <form action={toggleDoneAction}>
                <input type="hidden" name="habitId" value={h.id} />
                <input type="hidden" name="done" value={String(!h.doneToday)} />
                <button
                  type="submit"
                  className="toggle"
                  aria-label={
                    h.doneToday
                      ? `Mark ${h.name} as not done today`
                      : `Mark ${h.name} as done today`
                  }
                >
                  {h.doneToday ? "✓" : ""}
                </button>
              </form>
              <span className="name">{h.name}</span>
              <span className="streak">🔥 {h.streak}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}