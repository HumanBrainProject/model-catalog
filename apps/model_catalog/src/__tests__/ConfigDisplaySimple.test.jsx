import React from "react";
import { render, screen } from "@testing-library/react";
import ConfigDisplaySimple from "../ConfigDisplaySimple";

describe("ConfigDisplaySimple", () => {
    const defaultFilters = {
        species: ["Rattus norvegicus"],
        brain_region: ["CA1 field of hippocampus"],
        cell_type: [],
        model_scope: [],
        abstraction_level: [],
        test_type: [],
        score_type: [],
        recording_modality: [],
        implementation_status: [],
        project_id: [],
    };

    it("renders filter chips for active filters", () => {
        render(
            <ConfigDisplaySimple display="Models and Tests" filters={defaultFilters} />
        );
        expect(screen.getByText("Rattus norvegicus")).toBeInTheDocument();
        expect(screen.getByText("CA1 field of hippocampus")).toBeInTheDocument();
    });

    it("renders no chips when all filters are empty", () => {
        const emptyFilters = {
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
        render(
            <ConfigDisplaySimple display="Models and Tests" filters={emptyFilters} />
        );
        expect(screen.queryByRole("button")).not.toBeInTheDocument();
    });

    it("shows only model filters when display is Only Models", () => {
        const filters = {
            ...defaultFilters,
            test_type: ["single cell"],
        };
        render(
            <ConfigDisplaySimple display="Only Models" filters={filters} />
        );
        // Model filters should be shown
        expect(screen.getByText("Rattus norvegicus")).toBeInTheDocument();
        // Test-only filters should not be shown
        expect(screen.queryByText("single cell")).not.toBeInTheDocument();
    });

    it("shows only test filters when display is Only Tests", () => {
        const filters = {
            ...defaultFilters,
            model_scope: ["network"],
            test_type: ["single cell"],
        };
        render(
            <ConfigDisplaySimple display="Only Tests" filters={filters} />
        );
        // Test filters should be shown
        expect(screen.getByText("single cell")).toBeInTheDocument();
        // Model-only filters should not be shown
        expect(screen.queryByText("network")).not.toBeInTheDocument();
    });
});
