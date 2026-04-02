import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import {
    mockModel,
    mockTest,
    mockModelInstance,
    mockTestInstance,
} from "./helpers/fixtures";
import ResultModelTestInfo from "../ResultModelTestInfo";

describe("ResultModelTestInfo (smoke test)", () => {
    const defaultProps = {
        model: mockModel,
        model_instance: mockModelInstance,
        test: mockTest,
        test_instance: mockTestInstance,
    };

    it("renders without crashing", () => {
        renderWithProviders(<ResultModelTestInfo {...defaultProps} />);
    });

    it("displays Common Parameters heading", () => {
        renderWithProviders(<ResultModelTestInfo {...defaultProps} />);
        expect(
            screen.getByText("Model & Test: Common Parameters")
        ).toBeInTheDocument();
    });

    it("displays Other Parameters heading", () => {
        renderWithProviders(<ResultModelTestInfo {...defaultProps} />);
        expect(
            screen.getByText("Model & Test: Other Parameters")
        ).toBeInTheDocument();
    });

    it("displays Descriptions heading", () => {
        renderWithProviders(<ResultModelTestInfo {...defaultProps} />);
        expect(
            screen.getByText("Model & Test: Descriptions")
        ).toBeInTheDocument();
    });
});
