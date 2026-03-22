import { DatabaseSync } from "node:sqlite";
import path from "path";

const dbPath = process.env.DB_PATH
  ? path.join(process.env.DB_PATH, "database.sqlite")
  : path.join(__dirname, "../database.sqlite");

export const database = new DatabaseSync(dbPath);
database.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password_hash TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);

database.exec(`
CREATE TABLE IF NOT EXISTS encrypted_texts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  plain_text TEXT,
  encrypted_text TEXT,
  algorithm TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
)
`);
