import React from "react";
import { screen, render } from "@testing-library/react";
import ResultGraphs from "../ResultGraphs";
import {
    mockModel,
    mockTest,
    mockModelInstance,
    mockModelInstance2,
    mockTestInstance,
    mockResultSummary,
} from "./helpers/fixtures";

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

vi.mock("react-plotly.js/factory", () => ({
    default: () => () => <div data-testid="plotly-mock" />,
}));

vi.mock("plotly.js", () => ({ default: {} }));

vi.mock("../datastore", () => ({
    datastore: {
        getResult: vi.fn().mockResolvedValue({}),
    },
}));

describe("ResultGraphs", () => {
    it("renders loading indicator when loadingResult is true", () => {
        render(
            <ResultGraphs
                id="test-id"
                results={[]}
                loadingResult={true}
            />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders no results message when results are empty", () => {
        render(
            <ResultGraphs
                id="test-id"
                results={[]}
                loadingResult={false}
            />
        );
        expect(
            screen.getByText(/No results have yet been registered/)
        ).toBeInTheDocument();
    });

    it("renders graphs when result summaries are provided", () => {
        const results = [
            {
                ...mockResultSummary,
                id: "result-1",
            },
        ];
        render(
            <ResultGraphs
                id={mockModel.id}
                results={results}
                loadingResult={false}
            />
        );
        // Should render the test alias/name in an accordion
        expect(screen.getByText(/hippo-ca1-firing-rate/)).toBeInTheDocument();
    });

    it("renders test version label with results", () => {
        const results = [mockResultSummary];
        render(
            <ResultGraphs
                id={mockModel.id}
                results={results}
                loadingResult={false}
            />
        );
        expect(screen.getByText(/Test Version:/)).toBeInTheDocument();
        expect(screen.getByText(mockTestInstance.version, { exact: false })).toBeInTheDocument();
    });

    it("renders plotly chart when results have scores", () => {
        const results = [mockResultSummary];
        render(
            <ResultGraphs
                id={mockModel.id}
                results={results}
                loadingResult={false}
            />
        );
        expect(screen.getAllByTestId("plotly-mock").length).toBeGreaterThan(0);
    });

    it("renders score type and data type labels", () => {
        const results = [mockResultSummary];
        render(
            <ResultGraphs
                id={mockModel.id}
                results={results}
                loadingResult={false}
            />
        );
        expect(screen.getByText(/Observation Data Type:/)).toBeInTheDocument();
        expect(screen.getByText(/Test Score Type:/)).toBeInTheDocument();
    });

    it("renders multiple test results grouped by test", () => {
        const result2 = {
            ...mockResultSummary,
            id: "result-2",
            test_id: "other-test-id",
            test_name: "Another Test",
            test_alias: "another-test",
            model_version: mockModelInstance2.version,
            model_instance_id: mockModelInstance2.id,
        };
        render(
            <ResultGraphs
                id={mockModel.id}
                results={[mockResultSummary, result2]}
                loadingResult={false}
            />
        );
        expect(screen.getByText(/hippo-ca1-firing-rate/)).toBeInTheDocument();
        expect(screen.getByText(/another-test/)).toBeInTheDocument();
    });

    it("renders with multiResultsCompare format", () => {
        const extendedResult = {
            id: "result-1",
            model_instance_id: mockModelInstance.id,
            test_instance_id: mockTestInstance.id,
            score: 0.5,
            timestamp: "2024-01-15T10:30:45.123456",
            model_instance: mockModelInstance,
            test_instance: mockTestInstance,
            model: mockModel,
            test: mockTest,
        };
        render(
            <ResultGraphs
                id={mockModel.id}
                results={[extendedResult]}
                loadingResult={false}
                multiResultsCompare={true}
            />
        );
        expect(screen.getByText(/hippo-ca1-firing-rate/)).toBeInTheDocument();
    });

    it("does not show loading when loadingResult is false", () => {
        render(
            <ResultGraphs
                id="test-id"
                results={[mockResultSummary]}
                loadingResult={false}
            />
        );
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });
});
