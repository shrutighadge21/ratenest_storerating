import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

window.addEventListener('unhandledrejection', function (event) {
  fetch('http://localhost:5001/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `UNHANDLED PROMISE: ${event.reason}` }),
  }).catch(() => null);
});

window.onerror = function (msg, url, lineNo, columnNo, error) {
  fetch('http://localhost:5001/log', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: `GLOBAL ERROR: ${msg} at ${url}:${lineNo}:${columnNo} \n ${error?.stack}` }),
  }).catch(() => null);
  return false;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
