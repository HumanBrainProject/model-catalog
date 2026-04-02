import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockResultExtended } from "./helpers/fixtures";
import ResultDetail from "../ResultDetail";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("ResultDetail", () => {
    const defaultProps = {
        open: true,
        result: { ...mockResultExtended },
        onClose: vi.fn(),
        onUpdate: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing when open", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
    });

    it("displays the result ID", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByText(mockResultExtended.id)
        ).toBeInTheDocument();
    });

    it("displays model name", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByText(mockResultExtended.model.name)
        ).toBeInTheDocument();
    });

    it("displays test name", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByText(mockResultExtended.test.name)
        ).toBeInTheDocument();
    });

    it("displays the Result Info tab", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /result info/i })
        ).toBeInTheDocument();
    });

    it("displays the Result Files tab", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /result files/i })
        ).toBeInTheDocument();
    });

    it("displays the Model/Test Info tab", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /model\/test info/i })
        ).toBeInTheDocument();
    });

    it("has a close button", () => {
        renderWithProviders(<ResultDetail {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /close/i })
        ).toBeInTheDocument();
    });

    it("fetches result data when model is not present", async () => {
        const { datastore } = await import("../datastore");
        const resultWithoutModel = {
            ...mockResultExtended,
            model: undefined,
        };
        renderWithProviders(
            <ResultDetail {...defaultProps} result={resultWithoutModel} />
        );
        expect(datastore.getResult).toHaveBeenCalled();
    });
});
