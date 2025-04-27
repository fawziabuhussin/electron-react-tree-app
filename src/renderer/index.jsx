import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './style.css';

// sanity check
console.log('🟢 index.jsx loaded, mounting <App />…');

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
