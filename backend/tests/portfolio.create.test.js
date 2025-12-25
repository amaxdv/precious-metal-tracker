const BASE_URL = "http://localhost:3000/api/portfolio";

async function run() {
  console.log("== Portfolio API Test ==");

  // --- 1. POST ---
  console.log("\n[1] Creating portfolio entry...");

  const createResponse = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Krugerrand",
      metal: "Gold",
      purchase_date: "2024-02-15",
      quantity: 2,
      price_per_unit: 2150,
      extra_costs: 10,
      purity: 0.9167,
      gross_weight_g: 33.93,
      dealer: "Degussa",
      notes: "2023er Prägung, Stempelglanz"
    })
  });

  const created = await createResponse.json();
  console.log("Created:", created);

  // --- 2. GET ---
  console.log("\n[2] Fetching portfolio list...");

  const listResponse = await fetch(BASE_URL);
  const list = await listResponse.json();

  console.log("Portfolio entries:", list);

  console.log("\n== Test finished ==");
}

run().catch(err => {
  console.error("Test failed:", err);
});
