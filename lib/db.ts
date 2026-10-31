import { createClient } from "@libsql/client";

// Locally, this reads/writes ./habits.db directly — no account needed.
// In production, set TURSO_DATABASE_URL and TURSO_AUTH_TOKEN to point at a
// hosted Turso database so data survives redeploys.
const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? "file:habits.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

await db.execute(`
  CREATE TABLE IF NOT EXISTS habits (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

await db.execute(`
  CREATE TABLE IF NOT EXISTS completions (
    id       INTEGER PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id),
    date     TEXT NOT NULL,
    UNIQUE (habit_id, date)
  )
`);

export default db;
