const Database = require("better-sqlite3");

// Datenbank-Datei (liegt im backend-Ordner)
const db = new Database("portfolio.db");

// Fremdschlüssel optional aktivieren (zukunftssicher)
db.pragma("foreign_keys = ON");

// Portfolio-Tabelle initialisieren
db.prepare(`
  CREATE TABLE IF NOT EXISTS portfolio (
    id INTEGER PRIMARY KEY AUTOINCREMENT,

    created_at TEXT NOT NULL,          -- Eintragsdatum (ISO-8601)
    purchase_date TEXT NOT NULL,       -- Kaufdatum (ISO-8601)

    name TEXT NOT NULL,                -- Münzname / Typ
    metal TEXT NOT NULL,               -- Gold | Silber | Platin | Bronze

    purity REAL,                       -- z.B. 0.9167
    fine_weight_g REAL,                -- Feingewicht gesamt
    gross_weight_g REAL,               -- Gesamtgewicht

    quantity INTEGER NOT NULL,         -- Stückzahl

    price_per_unit REAL NOT NULL,      -- Kaufpreis pro Stück (brutto)
    extra_costs REAL DEFAULT 0,        -- Kaufnebenkosten gesamt
    total_price REAL NOT NULL,         -- Gesamtpreis (redundant, bewusst)

    dealer TEXT,                       -- Händler / Quelle
    collector_value REAL,              -- Sammlerwert
    notes TEXT
  )
`).run();

module.exports = db;