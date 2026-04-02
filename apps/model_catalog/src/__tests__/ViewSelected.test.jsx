import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import ViewSelected from "../ViewSelected";

describe("ViewSelected", () => {
    const sampleModel = {
        name: "Test Model",
        id: "abc-123",
        alias: "test-model",
        date_created: "2024-01-15",
        species: "Mouse",
        brain_region: "Hippocampus",
        cell_type: "Pyramidal",
        model_scope: "Network",
        abstraction_level: "Spiking",
        author: [{ given_name: "John", family_name: "Doe" }],
        owner: [{ given_name: "Jane", family_name: "Smith" }],
        organization: "EBRAINS",
        project_id: "proj-1",
        private: false,
    };

    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        entity: "models",
        selectedData: [sampleModel],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders 'View Model(s)' title for models entity", () => {
        renderWithProviders(<ViewSelected {...defaultProps} />);
        expect(screen.getByText("View Model(s)")).toBeInTheDocument();
    });

    it("renders 'View Test(s)' title for tests entity", () => {
        renderWithProviders(
            <ViewSelected {...defaultProps} entity="tests" />
        );
        expect(screen.getByText("View Test(s)")).toBeInTheDocument();
    });

    it("displays model data in the table", () => {
        renderWithProviders(<ViewSelected {...defaultProps} />);
        expect(screen.getByText("Test Model")).toBeInTheDocument();
        expect(screen.getByText("abc-123")).toBeInTheDocument();
    });

    it("displays formatted parameter labels", () => {
        renderWithProviders(<ViewSelected {...defaultProps} />);
        expect(screen.getByText("Name")).toBeInTheDocument();
        expect(screen.getByText("ID")).toBeInTheDocument();
        expect(screen.getByText("Alias")).toBeInTheDocument();
    });

    it("calls onClose when Ok button is clicked", () => {
        renderWithProviders(<ViewSelected {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /ok/i }));
        expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
    });

    it("does not render dialog when open is false", () => {
        renderWithProviders(<ViewSelected {...defaultProps} open={false} />);
        expect(screen.queryByText("View Model(s)")).not.toBeInTheDocument();
    });
});
