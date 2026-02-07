import { useEffect, useState } from 'react';

function PortfolioSummary() {
  const [summaries, setSummaries] = useState([]);
  const [totals, setTotals] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/portfolio/summary/metals').then(res => {
      if (!res.ok) throw new Error('API error');
      return res.json();
      }).then(data => {
        setSummaries(data.metalResults);
        setTotals(data.totalResults);
      }).catch(err => setError(err.message));
  }, []);

    if (error) return <p>Fehler: {error}</p>;

    if (!totals) return <p>Lade Portfolio-Zusammenfassung …</p>;

  return (
    <div className="portfolio-summary">
      
      {/*Zusammenfassung*/} 
      <section> <h2>Zusammenfassung</h2>
        <ul>
          <li>Gesamtwert: {totals.total_asset_value.toFixed(2)} €</li>
          <li>Investiert: {totals.total_invested.toFixed(2)} €</li>
          <li>Bilanz: {totals.total_net_value.toFixed(2)} €</li>
        </ul>
      </section>

      {/*Metalle*/} 
      {summaries.map(s => (
        <section key={s.metal}>
          <h2>{s.metal}</h2>
          <ul>
            <li>Feingewicht: {s.sum_fine_weight_g.toFixed(2)} g</li>
            <li>Investiert: {s.sum_total_price.toFixed(2)} €</li>
            <li>Spotpreis: {s.spot_price_eur_per_g.toFixed(2)} €/g</li>
            <li>Wert: {s.asset_value.toFixed(2)} €</li>
            <li>Bilanz: {s.net_value.toFixed(2)} €</li>
          </ul>
        </section>
      ))}

    </div>
  );
}

export default PortfolioSummary;
