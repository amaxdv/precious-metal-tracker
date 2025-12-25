const BASE_URL = "http://localhost:3000/api/portfolio";

async function run() {
  /*console.log("PUT: vollständiges Update (id=1)");

  await fetch(`${BASE_URL}/1`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Depot via PUT aktualisiert",
      purchase_date: "2024-01-01",
      metal: "Gold"
    })
  });*/

  console.log("PATCH: partielles Update (id=2)");

  await fetch(`${BASE_URL}/2`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Depot via PATCH umbenannt"
    })
  });

  const res = await fetch(BASE_URL);
  const data = await res.json();

  console.log("Aktueller DB-Stand:", data);
}

run().catch(console.error);
