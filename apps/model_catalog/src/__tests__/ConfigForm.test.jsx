import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { mockVocab } from "./helpers/fixtures";
import ConfigForm from "../ConfigForm";

describe("ConfigForm", () => {
    const defaultConfig = {
        species: [],
        brain_region: [],
        cell_type: [],
        model_scope: [],
        abstraction_level: [],
        test_type: [],
        score_type: [],
        recording_modality: [],
        implementation_status: [],
        project_id: [],
    };

    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        config: defaultConfig,
        display: "Models and Tests",
    };

    const contextOverrides = {
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the dialog with title", () => {
        renderWithContext(<ConfigForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Configure App")).toBeInTheDocument();
    });

    it("renders Cancel and Ok buttons", () => {
        renderWithContext(<ConfigForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Ok" })).toBeInTheDocument();
    });

    it("calls onClose with cancel flag when Cancel is clicked", () => {
        renderWithContext(<ConfigForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalledWith(
            "Models and Tests",
            defaultConfig,
            true
        );
    });

    it("calls onClose without cancel flag when Ok is clicked", () => {
        renderWithContext(<ConfigForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Ok" }));
        expect(defaultProps.onClose).toHaveBeenCalledWith(
            "Models and Tests",
            defaultConfig
        );
    });

    it("does not render when open is false", () => {
        renderWithContext(<ConfigForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Configure App")).not.toBeInTheDocument();
    });

    it("renders the display switch options", () => {
        renderWithContext(<ConfigForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Only Models")).toBeInTheDocument();
        expect(screen.getByText("Only Tests")).toBeInTheDocument();
    });
});
