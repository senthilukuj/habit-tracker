import db from "../lib/db";

const result = await db.execute(
  "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name"
);
console.log(result.rows);
