import React from 'react';
import ReactDOM from 'react-dom';
import initAuth from './auth';
import App from './App';


function renderApp(auth) {
  ReactDOM.render(
    <React.StrictMode>
        <App auth={auth} />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

// In development, if VITE_DEV_TOKEN is set in .env.local, use it directly.
// Otherwise fall through to the normal Keycloak login flow.
// See .env.local.example for setup instructions.
if (import.meta.env.DEV && import.meta.env.VITE_DEV_TOKEN) {
  window.addEventListener("DOMContentLoaded", () => renderApp({ token: import.meta.env.VITE_DEV_TOKEN }));
} else {
  window.addEventListener('DOMContentLoaded', () => initAuth(renderApp));
}
