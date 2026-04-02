import React from "react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import CompareMultiResults from "../CompareMultiResults";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

vi.mock("react-plotly.js/factory", () => ({
    default: () => () => <div data-testid="plotly-mock" />,
}));

describe("CompareMultiResults (smoke test)", () => {
    it("renders without crashing", () => {
        renderWithProviders(
            <CompareMultiResults
                open={true}
                onClose={vi.fn()}
            />
        );
    });
});
