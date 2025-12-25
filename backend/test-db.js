const Database = require("better-sqlite3");

// DB-Datei wird automatisch angelegt
const db = new Database("test.db");

// Test-Tabelle
db.prepare(`
  CREATE TABLE IF NOT EXISTS test (
    id INTEGER PRIMARY KEY,
    name TEXT
  )
`).run();

// Test-Daten einfügen
db.prepare(`
  INSERT INTO test (name) VALUES (?)
`).run("SQLite läuft");

// Daten lesen
const rows = db.prepare("SELECT * FROM test").all();
console.log(rows);
