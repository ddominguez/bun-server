import { Database } from "bun:sqlite";

const db = new Database("sqlite.db", { create: true })

db.run(`CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY,
  author TEXT,
  body TEXT);`)

db.run(`insert into posts (author, body)
values
  ('alice', 'sample post'),
  ('bob', 'example post'),
  ('carlos', 'test post');`)
