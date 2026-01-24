import { useState } from 'react';

function SpotPricePanel() {
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadSpotPrice = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3000/api/spot/silver');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load spot price');
      }

      setSpot(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Silber-Spotpreis</h3>

      <button onClick={loadSpotPrice} disabled={loading}>
        {loading ? 'Lade…' : 'Spotpreis abrufen'}
      </button>

      {spot && (
        <div>
          <p>
            Preis: <strong>{spot.price_eur_per_g} €/g</strong>
          </p>
          <small>
            Stand: {new Date(spot.timestamp).toLocaleString()}
          </small>
        </div>
      )}

      {error && (
        <p style={{ color: 'red' }}>
          Fehler: {error}
        </p>
      )}
    </div>
  );
}

export default SpotPricePanel;
