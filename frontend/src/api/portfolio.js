// API service
const BASE_URL = "http://localhost:3000/api/portfolio";

// GET / READ
export async function fetchPortfolio() {
    const response = await fetch(BASE_URL); // have a response

    if (!response.ok) { // if its not ok..
        throw new Error("Failed to fetch portfolio"); // ..throw error
    }

    return response.json(); // otherwise return json
}

// POST / CREATE
export async function createPortfolioEntry(data) {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Fehler beim Anlegen des Eintrags");
    }

    return response.json();
}

// DELETE / DELETE
export async function deletePortfolioEntry(id) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Fehler beim Löschen des Eintrags");
    }
}

// UPDATE / PATCH
export async function updatePortfolioEntry(id, data) {
    const response = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Eintrags");
    }

    return response.json();
}
