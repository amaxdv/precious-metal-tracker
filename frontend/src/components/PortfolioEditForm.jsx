import { useState } from "react";
import { updatePortfolioEntry } from "../api/portfolio";

function PortfolioEditForm({ entry, onCancel, onUpdated }) {
    const [name, setName] = useState(entry.name);
    const [metal, setMetal] = useState(entry.metal);
    const [purchaseDate, setPurchaseDate] = useState(entry.purchase_date);
    const [quantity, setQuantity] = useState(entry.quantity);
    const [pricePerUnit, setPricePerUnit] = useState(entry.price_per_unit);

    const [purity, setPurity] = useState(entry.purity);
    const [grossWeight, setGrossWeight] = useState(entry.gross_weight_g);
    const [extraCosts, setExtraCosts] = useState(entry.extra_costs);
    const [dealer, setDealer] = useState(entry.dealer);
    const [collectorValue, setCollectorValue] = useState(entry.collector_value);
    const [notes, setNotes] = useState(entry.notes);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updated = await updatePortfolioEntry(entry.id, {
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

      onUpdated(updated);

    } catch (err) {
        setError(err.message);

    } finally {
        setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3>Eintrag bearbeiten</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
    
    
      {/* <input value={entry.id} readOnly={true}/>
      <input value={name} onChange={e => setName(e.target.value)} />
      <input value={metal} onChange={e => setMetal(e.target.value)} />
      <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} />
      <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} />
      <input type="number" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} />
       */}

        <input value={entry.id} readOnly={true}/>
        <label>Name*
        <input value={name} onChange={e => setName(e.target.value)} required /><br/></label>
        <label>Metall*
        <input value={metal} onChange={e => setMetal(e.target.value)} required/><br/></label>
        <label>Kaufdatum
        <input type="date" value={purchaseDate} onChange={e => setPurchaseDate(e.target.value)} /><br/></label>
        <label>Stückzahl*
        <input type="number" min="1" step="1" value={quantity} onChange={e => setQuantity(e.target.value)} required /><br/></label>
        <label>Preis pro Stück [€]*
        <input type="number" min="0" step="0.01" value={pricePerUnit} onChange={e => setPricePerUnit(e.target.value)} required /><br/></label>

        <label>Feingehalt*
        <input type="number" value={purity} onChange={e => setPurity(e.target.value)} required /><br/></label>
        <label>Gesamtgewicht [g]*
        <input type="number" value={grossWeight} onChange={e => setGrossWeight(e.target.value)} required /><br/></label>
        <label>Kaufnebenkosten*
        <input type="number" value={extraCosts} onChange={e => setExtraCosts(e.target.value)} required /><br/></label>
        <label>Händler
        <input value={dealer} onChange={e => setDealer(e.target.value)} /><br/></label>
        <label>Sammlerwert
        <input type="number" value={collectorValue} onChange={e => setCollectorValue(e.target.value)}  /><br/></label>
        <label>Notiz
        <input value={notes} onChange={e => setNotes(e.target.value)} /><br/></label>


      <button type="submit" disabled={loading}>
        {loading ? "Speichern…" : "Speichern"}
      </button>

      <button type="button" onClick={onCancel}>
        Abbrechen
      </button>
    </form>
  );
}

export default PortfolioEditForm;
