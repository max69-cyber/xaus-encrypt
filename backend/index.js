import express from "express"
import sqlite3 from "sqlite3"
import cors from "cors"

const app = express()
app.use(cors())
app.use(express.json())

const db = new sqlite3.Database("../database.sqlite")

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY,
  login TEXT,
  password_hash TEXT
)
`)

db.run(`
CREATE TABLE IF NOT EXISTS encrypted_texts (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  plain_text TEXT,
  encrypted_text TEXT,
  algorithm TEXT,
  created_at TEXT
)
`)

app.post("/encrypt", (req,res)=>{
    res.json({ ok:true })
})

app.listen(3000, ()=>console.log("Backend running"))
