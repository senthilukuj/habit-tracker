import Database from "better-sqlite3";
import path from "node:path";

const db = new Database(path.join(process.cwd(), "habits.db"));

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS habits (
    id         INTEGER PRIMARY KEY,
    name       TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS completions (
    id       INTEGER PRIMARY KEY,
    habit_id INTEGER NOT NULL REFERENCES habits(id),
    date     TEXT NOT NULL,
    UNIQUE (habit_id, date)
  );
`);

export default db;