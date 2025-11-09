// client/src/index.js (example)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import setAuthToken from './utils/setAuthToken'; // <-- 1. Import utility

// 2. Check localStorage for token
const token = localStorage.getItem('token');

// 3. Set the Axios header immediately if the token exists
if (token) {
    setAuthToken(token);
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);