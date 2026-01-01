const BASE_URL = "http://localhost:3000/api/portfolio";

async function run() {
  console.log("DELETE -> id = 2");

  const delRes = await fetch(`${BASE_URL}/3`, {
    method: "DELETE"
  });

  const delData = await delRes.json();
  console.log("DELETE response:", delData);

  console.log("GET -> aktuelle Einträge");

  const getRes = await fetch(BASE_URL);
  const data = await getRes.json();

  console.log("Aktueller DB-Stand:", data);
}

run().catch(console.error);
