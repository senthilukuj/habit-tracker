import { addHabit, listHabits, setCompletion } from "../lib/habits";
import { todayLocal } from "../lib/dates";

const today = todayLocal();
console.log("today:", today);

const id = await addHabit("Read 20 min");
console.log("added habit id:", id);

console.log("before ticking:", await listHabits());

await setCompletion(id, today, true);
await setCompletion(id, today, true); // ticking twice should be harmless
console.log("after ticking:", await listHabits());

await setCompletion(id, today, false);
console.log("after unticking:", await listHabits());

await setCompletion(id, today, true); // leave it ticked for Step 4
