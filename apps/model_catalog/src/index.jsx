import "./init";
import React from 'react';
import ReactDOM from 'react-dom';
import initAuth from './auth';
import { datastore } from "./datastore";
import { ContextMainProvider } from "./ContextMain";
import { SnackbarProvider } from "notistack";
import ValidationFramework from "./ValidationFramework";

function renderApp(auth) {
    datastore.auth = auth;
    ReactDOM.render(
        <ContextMainProvider>
            <SnackbarProvider maxSnack={3}>
                <ValidationFramework auth={auth} />
            </SnackbarProvider>
        </ContextMainProvider>,
        document.getElementById('root')
    );
};

// In development, if VITE_DEV_TOKEN is set in .env.local, use it directly.
// Otherwise fall through to the normal Keycloak login flow.
// See .env.local.example for setup instructions.
if (import.meta.env.DEV && import.meta.env.VITE_DEV_TOKEN) {
  window.addEventListener("DOMContentLoaded", () => renderApp({ token: import.meta.env.VITE_DEV_TOKEN, authenticated: true }));
} else {
  window.addEventListener('DOMContentLoaded', () => initAuth(renderApp));
}
