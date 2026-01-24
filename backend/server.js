// server.js
const express = require('express');
const cors = require('cors');
const db = require("./db");

const cheerio = require('cheerio');
//console.log('cheerio loaded:', typeof cheerio.load);

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

// ++ Scraping (fixed price) ++
app.get('/api/spot/silver', async (req, res) => {
  /* // ++ Dummy ++
  res.json({
    metal: 'silver',
    price_eur_per_g: 0.75,
    source: 'dummy',
    timestamp: new Date().toISOString()
  });
  */

   try {
    // ++ Daten laden ++
    const response = await fetch('https://www.gold.de/kurse/silberpreis/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 ' +
          '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8'
      }
    });
    
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    
    // ++ Daten Selektieren ++
    const $ = cheerio.load(html);

    // Selector 
    const rawPrice = $('div.em_preis_ml.au_silber_eur').first().text();

    if (!rawPrice) {
      throw new Error('Spotpreis nicht gefunden');
    }

    // ++ Daten verarbeiten ++

    // Beispiel: "0,92 €"
    const normalized = rawPrice.replace('EUR', '').replace(',', '.').trim();

    const price = Number(normalized);

    if (Number.isNaN(price)) {
      throw new Error(`Ungültiger Preiswert: ${rawPrice}`);
    }

    const priceConvert = price / 31.103;

    // ++ load ++

    res.json({
      metal: 'silver',
      price_eur_per_g: priceConvert,
      source: 'gold.de',
      timestamp: new Date().toISOString()
    });

  } catch (err) {
    console.error('Scraping error:', err.message);

    res.status(500).json({
      error: 'Scraping failed',
      details: err.message
    });
  }
});

// Orchestrate Calculations
app.get('/api/portfolio/summary/metals', async (req, res) => {
  
  try {
    // Data from SQL
    const entries = db.prepare('SELECT * FROM portfolio').all();

    // spotprice
    const spotResponse = await fetch('http://localhost:3000/api/spot/silver');
    const spotData = await spotResponse.json();

    // call calculation and give Arguments
    const { calculateMetalSummary } = require('./portfolio.logic');
    const summary = calculateMetalSummary(entries, 'Silber', spotData.price_eur_per_g);

    // response result as json
    res.json(summary);

  } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Summary calculation failed' });
  }
});



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
