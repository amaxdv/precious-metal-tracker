/* //Default React Landingpage
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}*/


import { useState } from "react";
import PortfolioList from "./components/PortfolioList";
import PortfolioCreateForm from "./components/PortfolioCreateForm";
import PortfolioEditForm from "./components/PortfolioEditForm";
import SpotPricePanel from "./components/SpotPricePanel";
import PortfolioSummary from './components/PortfolioSummary';
import './App.css'



function App() {
  
  /*return (
    <div>
      <h1>Mein Portfolio</h1>
      <PortfolioList />
    </div>
  );*/

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingEntry, setEditingEntry] = useState(null);

  function handleCreated() {
    setRefreshKey(k => k + 1);
  }

  function handleEdit(entry) {
    setEditingEntry(entry);
  }

  function handleUpdated(updated) {
    setEditingEntry(null);
    setRefreshKey(k => k + 1); // list reload
  }

  function handleCancelEdit() {
    setEditingEntry(null);
  }

  
  return (
    <div>
      <h1>Spotprice</h1>

      <SpotPricePanel />

      <h1>Dashboard</h1>

      <PortfolioSummary />

      <h1>Mein Portfolio</h1>

      <PortfolioCreateForm onCreated={handleCreated} />

      {editingEntry && (
        <PortfolioEditForm entry={editingEntry} onUpdated={handleUpdated} onCancel={handleCancelEdit} />
      )}

      <PortfolioList refreshKey={refreshKey} onEdit={handleEdit} />
    </div>
  );
}

export default App
