import {DatabaseSync} from "node:sqlite";

export const database = new DatabaseSync('../database.sqlite');

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
`)
