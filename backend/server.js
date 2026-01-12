// server.js
const express = require('express');
const cors = require('cors');
const db = require("./db");

const cheerio = require('cheerio');
console.log('cheerio loaded:', typeof cheerio.load);

const app = express();
const PORT = 3000;

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

    // --- Validation: existence & datatype ---
    if (
      !name ||
      !metal ||
      !purchase_date ||
      quantity == null ||
      price_per_unit == null ||

      gross_weight_g == null ||
      purity == null

    ) {
      return res.status(400).json({
        error: "Missing required fields", 
          required: [
            "name",
            "metal",
            "quantity",
            "price_per_unit",
            "gross_weight_g",
            "purity"
          ]
      });
    }

    if (
      Number(quantity) <= 0 ||
      Number(price_per_unit) <= 0 ||
      Number(gross_weight_g) <= 0 ||
      Number(purity) <= 0 ||
      Number(purity) > 1
    ) {
      return res.status(400).json({
        error: "Invalid numeric values"
      });
    }


    const created_at = new Date().toISOString();

    // --- Calculations ---
    const { calculatePortfolioFields } = require("./portfolio.logic");

    const { total_price, fine_weight_g } =
      calculatePortfolioFields({
        quantity,
        price_per_unit,
        extra_costs,
        gross_weight_g,
        purity,
      });


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

    const inserted = db.prepare("SELECT * FROM portfolio WHERE id = ?").get(result.lastInsertRowid);

    res.status(201).json(inserted);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// PATCH Whitelist
const PATCH_ALLOWED_FIELDS = [
  // Pflicht / berechnungsrelevant
  "name",
  "metal",
  "quantity",
  "price_per_unit",
  "gross_weight_g",
  "purity",
  "extra_costs",

  // Optional
  "purchase_date",
  "dealer",
  "collector_value",
  "notes"
];

// PATCH-Answer
app.patch("/api/portfolio/:id", (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

    // PATCH-Whitelist Validatopn
    const invalidFields = keys.filter(key => !PATCH_ALLOWED_FIELDS.includes(key));

      if (invalidFields.length > 0) {
        return res.status(400).json({
          error: "invalid fields in request",
          invalidFields
        });
      }

      // Load existing data
      const existing = db.prepare("SELECT * FROM portfolio WHERE id = ?").get(id);

      if (!existing) {
        return res.status(404).json({ error: "Portfolio entry not found" });
      }

      // merge data
      const merged = { ...existing, ...fields };

      // validate merged data - existence & datatype
      if (
        !merged.name ||
        !merged.metal ||
        merged.quantity == null ||
        merged.price_per_unit == null ||
        merged.gross_weight_g == null ||
        merged.purity == null
      ) {
        return res.status(400).json({
          error: "Update would result in invalid state"
        });
      }

      if (
        Number(merged.quantity) <= 0 ||
        Number(merged.price_per_unit) <= 0 ||
        Number(merged.gross_weight_g) <= 0 ||
        Number(merged.purity) <= 0 ||
        Number(merged.purity) > 1
      ) {
        return res.status(400).json({
          error: "Invalid numeric values after update"
        });
      }

      // Calculations (not yet completed)
      const { calculatePortfolioFields } = require("./portfolio.logic");
      const { total_price, fine_weight_g } = calculatePortfolioFields(merged);

      const updateFields = { ...fields, total_price, fine_weight_g };

      const updateKeys = Object.keys(updateFields);

  // Update
  const setClause = updateKeys.map(k => `${k} = ?`).join(", ");
  const values = updateKeys.map(k => updateFields[k]);

  db.prepare(`UPDATE portfolio SET ${setClause} WHERE id = ?`).run(...values, id);

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
