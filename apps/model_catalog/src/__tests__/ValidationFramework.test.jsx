import React from "react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

vi.mock("react-plotly.js/factory", () => ({
    default: () => () => <div data-testid="plotly-mock" />,
}));

vi.mock("plotly.js", () => ({}));

vi.mock("react-slick", () => ({
    default: ({ children }) => <div data-testid="slider-mock">{children}</div>,
}));

vi.mock("react-lines-ellipsis", () => ({
    default: (props) => <span>{props.text}</span>,
}));

vi.mock("react-lines-ellipsis/lib/responsiveHOC", () => ({
    default: () => (Component) => Component,
}));

vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn(() => ({
        "roles": { "team": [] },
        "sub": "test-user",
    })),
}));

// Mock fetch for stats
globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

describe("ValidationFramework (smoke test)", () => {
    it("renders without crashing", async () => {
        // Dynamic import to ensure all mocks are in place
        const { default: ValidationFramework } = await import(
            "../ValidationFramework"
        );
        renderWithProviders(
            <ValidationFramework auth={{ token: "mock-jwt-token" }} />
        );
    });
});
