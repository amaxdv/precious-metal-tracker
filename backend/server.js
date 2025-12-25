// server.js
const express = require('express');
const cors = require('cors');
const db = require("./db");

const app = express();
const PORT = 3000;

// PATCH Whitelist
const PATCH_ALLOWED_FIELDS = [
  "name",
  "purchase_date",
  "metal"
];


// Middleware
app.use(cors());
app.use(express.json());

// Test portfolio data 001
/*const existing = db.prepare("SELECT * FROM portfolio").get();

  if (!existing) {
    db.prepare(`
    INSERT INTO portfolio (name, created_at)
    VALUES (?, ?)
    `).run("Mein erstes Depot", new Date().toISOString());
  }*/

// ++ Routes ++
// Test-Route
app.get('/', (req, res) => {
  res.send('Express Backend läuft!');
});

//GET-Answer (Test 002) - Select all mit korrektem portfolio-schema
app.get("/api/portfolio", (req, res) => {
  const items = db.prepare("SELECT * FROM portfolio").all();
  res.json(items);

});

//POST-Answer (Test 003) - writing and calculating field-values
app.post("/api/portfolio", (req, res) => {
  try {
    const {
      name,
      metal,
      purchase_date,
      quantity,
      price_per_unit,
      purity = null,
      gross_weight_g = null,
      extra_costs = 0,
      dealer = null,
      collector_value = null,
      notes = null
    } = req.body;

    // --- Minimal-Validierung ---
    if (
      !name ||
      !metal ||
      !purchase_date ||
      quantity == null ||
      price_per_unit == null
    ) {
      return res.status(400).json({
        error: "Missing required fields"
      });
    }

    const created_at = new Date().toISOString();

    const total_price =
      Number(quantity) * Number(price_per_unit) + Number(extra_costs || 0);

    let fine_weight_g = null;
    if (gross_weight_g != null && purity != null) {
      fine_weight_g =
        Number(gross_weight_g) * Number(purity) * Number(quantity);
    }

    const stmt = db.prepare(`
      INSERT INTO portfolio (
        created_at,
        purchase_date,
        name,
        metal,
        purity,
        fine_weight_g,
        gross_weight_g,
        quantity,
        price_per_unit,
        extra_costs,
        total_price,
        dealer,
        collector_value,
        notes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      created_at,
      purchase_date,
      name,
      metal,
      purity,
      fine_weight_g,
      gross_weight_g,
      quantity,
      price_per_unit,
      extra_costs,
      total_price,
      dealer,
      collector_value,
      notes
    );

    const inserted = db
      .prepare("SELECT * FROM portfolio WHERE id = ?")
      .get(result.lastInsertRowid);

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PUT-Answer
/*app.put("/api/portfolio/:id", (req, res) => {
  const { id } = req.params;
  const { name, purchase_date, metal } = req.body;

  if (!name || !purchase_date || !metal) {
    return res.status(400).json({
      error: "PUT requires all fields: name, purchase_date, metal"
    });
  }

  const result = db.prepare(`
    UPDATE portfolio
    SET
      name = ?,
      purchase_date = ?,
      metal = ?
    WHERE id = ?
  `).run(name, purchase_date, metal, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Portfolio entry not found" });
  }

  res.json({ success: true });
});*/

// PATCH-Answer
app.patch("/api/portfolio/:id", (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  // PATCH WHitelist
  const invalidFields = keys.filter(
    key => !PATCH_ALLOWED_FIELDS.includes(key)
  );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        error: "invalid fields in request",
        invalidFields
      });
    }

  // Update
  const setClause = keys.map(key => `${key} = ?`).join(", ");
  const values = keys.map(key => fields[key]);

  const result = db.prepare(`
    UPDATE portfolio
    SET ${setClause}
    WHERE id = ?
  `).run(...values, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Portfolio entry not found" });
  }

  res.json({ success: true });
});

// DELETE-Answer
app.delete("/api/portfolio/:id", (req, res) => {
  const { id } = req.params;

  const result = db.prepare(`
    DELETE FROM portfolio
    WHERE id = ?
  `).run(id);

  if (result.changes === 0) {
    return res.status(404).json({
      error: "Portfolio entry not found"
    });
  }

  res.json({
    success: true,
    deletedId: Number(id)
  });
});

//Test 001 - einfaches select & get
/*app.get("/api/portfolio", (req, res) => {
  const portfolio = db.prepare("SELECT * FROM portfolio").get();
  res.json(portfolio);

});*/

// Data Connection Test 000
/*app.get("/api/portfolio", (req, res) => {
  res.json({
    name: "Test-Depot",
    assets: [],
    createdAt: new Date().toISOString()
  });
});*/

// ++ Server Start ++
app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});

// 500 Error Fallback
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: "Internal server error"
  });
});
