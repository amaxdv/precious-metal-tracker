import { useState } from "react";
import { createPortfolioEntry } from "../api/portfolio.api";

function PortfolioCreateForm({ onCreated }) {
    const [name, setName] = useState("");
    const [metal, setMetal] = useState("");
    const [purchaseDate, setPurchaseDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [pricePerUnit, setPricePerUnit] = useState("");

    const [purity, setPurity] = useState("");
    const [grossWeight, setGrossWeight] = useState("");
    const [extraCosts, setExtraCosts] = useState("");
    const [dealer, setDealer] = useState("");
    const [collectorValue, setCollectorValue] = useState("");
    const [notes, setNotes] = useState("");


    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await createPortfolioEntry({
                name,
                metal,
                purchase_date: purchaseDate,
                quantity: Number(quantity),
                price_per_unit: Number(pricePerUnit),

                purity: purity ? Number(purity) : null,
                gross_weight_g: grossWeight ? Number(grossWeight) : null,
                extra_costs: extraCosts ? Number(extraCosts) : 0,

                dealer: dealer || null,
                collector_value: collectorValue ? Number(collectorValue) : null,
                notes: notes || null,
            });

        setName("");
        setMetal("");
        setPurchaseDate("");
        setQuantity("");
        setPricePerUnit("");

        setPurity("");
        setGrossWeight("");
        setExtraCosts("");
        setDealer("");
        setCollectorValue("");
        setNotes("");

        onCreated();
        } catch (err) {
            setError(err.message);
            } finally {
                setLoading(false);
                }
    }

    function fillTestData() {
        setName("Krugerrand");
        setMetal("Gold");
        setPurchaseDate("2024-02-15");
        setQuantity("2");
        setPricePerUnit("100");

        setPurity("0.5");
        setGrossWeight("10");
        setExtraCosts("4");
        setDealer("Degussa");
        setCollectorValue("123");
        setNotes("Kommentar");
    }
    
    return (
        <form onSubmit={handleSubmit}>
        <h2>Neuen Eintrag anlegen</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <label>Name*
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Krügerrand" required /><br/></label>
        <label>Metall*
        <input value={metal} onChange={e => setMetal(e.target.value)} placeholder="Gold" required/><br/></label>
        <label>Kaufdatum
        <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} /><br/></label>
        <label>Stückzahl*
        <input type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="3" required /><br/></label>
        <label>Preis pro Stück [€]*
        <input type="number" min="0" step="0.01" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} placeholder="49,99" required /><br/></label>

        <label>Feingehalt*
        <input type="number" value={purity} onChange={e => setPurity(e.target.value)} placeholder="0,999" required /><br/></label>
        <label>Gesamtgewicht [g]*
        <input type="number" value={grossWeight} onChange={e => setGrossWeight(e.target.value)} placeholder="32,00" required /><br/></label>
        <label>Kaufnebenkosten*
        <input type="number" value={extraCosts} onChange={e => setExtraCosts(e.target.value)} placeholder="4,99" required /><br/></label>
        <label>Händler
        <input value={dealer} onChange={e => setDealer(e.target.value)} placeholder="Degussa" /><br/></label>
        <label>Sammlerwert
        <input type="number" value={collectorValue} onChange={e => setCollectorValue(e.target.value)} placeholder="100,00" /><br/></label>
        <label>Notiz
        <input value={notes} onChange={e => setNotes(e.target.value)} placeholder="..." /><br/></label>

        <div style={{ marginTop: "1rem" }}>
            <button type="button" onClick={fillTestData}>Testdaten</button>
            <button type="submit" disabled={loading}>{loading ? "Speichern…" : "Speichern"}</button>
        </div>
        
        <br/><br/>
        </form>
    );
}

export default PortfolioCreateForm;
