"use server";

import { revalidatePath } from "next/cache";
import { addHabit, setCompletion } from "@/lib/habits";
import { todayLocal } from "@/lib/dates";

export async function addHabitAction(formData: FormData) {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") return;

  addHabit(name);
  revalidatePath("/");
}

export async function toggleDoneAction(formData: FormData) {
  const habitId = Number(formData.get("habitId"));
  const done = formData.get("done") === "true";
  if (!Number.isInteger(habitId)) return;

  setCompletion(habitId, todayLocal(), done);
  revalidatePath("/");
}