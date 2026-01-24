import { useEffect, useState } from 'react';

function PortfolioSummary() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/portfolio/summary/metals')
      .then(res => res.json())
      .then(setSummary)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p>Fehler: {error}</p>;
  if (!summary) return <p>Lade Portfolio-Zusammenfassung …</p>;

  return (
    <div className="portfolio-summary">
      
      <section> <h2>Zusammenfassung</h2>
        <ul>
        </ul>
      </section>
      
      <section> <h2>Gold</h2>
        <ul>
        </ul>
      </section>

      <section> <h2>Silbert</h2>
        <ul>
          <li>Feingewicht gesamt: {summary.sum_fine_weight_g.toFixed(2)} g</li>
          <li>Investiert gesamt: {summary.sum_total_price.toFixed(2)} €</li>
          <li>Spotpreis: {summary.spot_price_eur_per_g.toFixed(2)} €/g</li>
          <li>Aktueller Wert: {summary.asset_value.toFixed(2)} €</li>
          <li>
            Bilanz: {summary.net_value.toFixed(2)} €
          </li>
        </ul>
      </section>

      <section> <h2>Kupfer</h2>
        <ul>
        </ul>
      </section>

    </div>
  );
}

export default PortfolioSummary;
