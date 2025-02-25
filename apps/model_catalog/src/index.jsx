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

// For local development, uncomment the lines below, paste in a valid token, then comment out the bottom line
// const auth = {
//     token: "eyJ..."
// }
// window.addEventListener('DOMContentLoaded', () => renderApp(auth));
window.addEventListener('DOMContentLoaded', () => initAuth(renderApp));
