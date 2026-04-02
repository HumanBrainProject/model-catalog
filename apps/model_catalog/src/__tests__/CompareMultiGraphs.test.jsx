import React from "react";
import { render } from "@testing-library/react";
import CompareMultiGraphs from "../CompareMultiGraphs";

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

vi.mock("react-plotly.js/factory", () => ({
    default: () => () => <div data-testid="plotly-mock" />,
}));

vi.mock("plotly.js", () => ({}));

describe("CompareMultiGraphs (smoke test)", () => {
    it("renders without crashing with empty results", () => {
        render(
            <CompareMultiGraphs
                results={[]}
                model_ids={[]}
                test_ids={[]}
            />
        );
    });
});
