import React from "react";
import { render } from "@testing-library/react";
import ContextMain, { ContextMainProvider } from "../../ContextMain";
import { SnackbarProvider } from "notistack";

export function renderWithProviders(ui, options = {}) {
    function Wrapper({ children }) {
        return (
            <ContextMainProvider>
                <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </ContextMainProvider>
        );
    }
    return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Render with pre-populated context values.
 * Useful for components that read from context in their constructor
 * and would crash if values like validFilterValues are null.
 */
export function renderWithContext(ui, contextOverrides = {}, options = {}) {
    const defaultContext = {
        auth: [{}, vi.fn()],
        filters: [{}, vi.fn()],
        validFilterValues: [null, vi.fn()],
        compareModels: [{}, vi.fn()],
        compareTests: [{}, vi.fn()],
        status: ["", vi.fn()],
        ...contextOverrides,
    };
    function Wrapper({ children }) {
        return (
            <ContextMain.Provider value={defaultContext}>
                <SnackbarProvider maxSnack={3}>{children}</SnackbarProvider>
            </ContextMain.Provider>
        );
    }
    return render(ui, { wrapper: Wrapper, ...options });
}
