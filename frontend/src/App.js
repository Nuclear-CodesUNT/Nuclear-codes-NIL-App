import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
  // test endpoint
  fetch('/api/test')
    .then(res => res.json())
    .then(data => setMessage(data.message))
    .catch(err => console.error("Error fetching data:", err));
}, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>NIL Project Frontend</h1>
        <p>Message from Backend: <strong>{message || "Loading..."}</strong></p>
      </header>
    </div>
  );
}

export default App;