import { useEffect, useState } from "react"; 
import { fetchPortfolio } from "../api/portfolio";
import { deletePortfolioEntry } from "../api/portfolio";


export default function PortfolioList({ refreshKey, onEdit }) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //const [editingId, setEditingId] = useState(null); // Edit Entry

    useEffect(() => {
    setLoading(true);
    fetchPortfolio()
        .then(setData)
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }, [refreshKey]); // <<< zentraler Punkt

    if (loading) return <p>Lade Portfolio…</p>;
    if (error) return <p style={{ color: "red" }}>Fehler: {error}</p>;
    if (data.length === 0) return <p>Keine Portfolio-Einträge vorhanden.</p>;

    // handle delete direct within list (no component requeired) 
    async function handleDelete(id) {
        const confirmed = window.confirm("Eintrag wirklich löschen?");

        if (!confirmed) return;

        try {
            await deletePortfolioEntry(id);
            setData(prev => prev.filter(e => e.id !== id));
        } catch (err) {
            alert(err.message);
        }
    }

    return (
        <>
        <table>
            <thead>
            <tr>
                <th>ID</th>
                <th>Eintragsdatum</th>
                <th>Kaufdatum</th>
                <th>Name</th>
                <th>Metall</th>

                <th>Gewicht [g]</th>
                <th>Feingehalt</th>
                <th>Feingewicht [g]</th>

                <th>Stückzahl</th>
                <th>Preis pro Stück</th>
                <th>Kaufnebenkosten</th>
                <th>Gesamtpreis</th>

                <th>Händler</th>
                <th>Sammlerwert</th>
                <th>Notizen</th>

                <th>Aktionen</th>
            </tr>
            </thead>
            <tbody>
            {data.map(entry => (
                <tr key={entry.id}>
                <td>{entry.id}</td>
                <td>{entry.created_at}</td>
                <td>{entry.purchase_date}</td>
                <td>{entry.name}</td>
                <td>{entry.metal}</td>

                <td>{entry.gross_weight_g}</td>
                <td>{entry.purity}</td>
                <td>{entry.fine_weight_g}</td>
                
                <td>{entry.quantity}</td>
                <td>{entry.price_per_unit}</td>
                <td>{entry.extra_costs}</td>
                <td>{entry.total_price}</td>

                <td>{entry.dealer}</td>
                <td>{entry.collector_value}</td>
                <td>{entry.notes}</td>

                <td>
                    <button onClick={() => onEdit(entry)}>Bearbeiten</button>
                    <button onClick={() => handleDelete(entry.id)}>Löschen</button>
                </td>
                </tr>
            ))}
            </tbody>
        </table>
        </>
    );
}
