"use server";

import { revalidatePath } from "next/cache";
import { addHabit } from "@/lib/habits";

export async function addHabitAction(formData: FormData) {
  const name = formData.get("name");
  if (typeof name !== "string" || name.trim() === "") return;

  addHabit(name);
  revalidatePath("/");
}