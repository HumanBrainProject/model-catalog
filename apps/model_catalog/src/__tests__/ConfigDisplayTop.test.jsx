import React from "react";
import { render, screen } from "@testing-library/react";
import ConfigDisplayTop from "../ConfigDisplayTop";

describe("ConfigDisplayTop", () => {
    const defaultFilters = {
        species: ["Rattus norvegicus"],
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

    it("renders the accordion with header text", () => {
        render(
            <ConfigDisplayTop display="Models and Tests" filters={defaultFilters} />
        );
        expect(screen.getByText("View Current Configuration")).toBeInTheDocument();
    });

    it("renders the display chip", () => {
        render(
            <ConfigDisplayTop display="Models and Tests" filters={defaultFilters} />
        );
        expect(screen.getByText("Models and Tests")).toBeInTheDocument();
    });

    it("renders active filter values as chips", () => {
        render(
            <ConfigDisplayTop display="Models and Tests" filters={defaultFilters} />
        );
        expect(screen.getByText("Rattus norvegicus")).toBeInTheDocument();
    });

    it("renders '<< all >>' for empty filter values", () => {
        render(
            <ConfigDisplayTop display="Models and Tests" filters={defaultFilters} />
        );
        // brain_region and others are empty, so they should show "<< all >>"
        const allChips = screen.getAllByText("<< all >>");
        expect(allChips.length).toBeGreaterThan(0);
    });

    it("renders configure instruction text", () => {
        render(
            <ConfigDisplayTop display="Models and Tests" filters={defaultFilters} />
        );
        expect(
            screen.getByText(/To re-configure the app, click on the configure icon/)
        ).toBeInTheDocument();
    });

    it("shows only model filters when display is Only Models", () => {
        const filters = {
            ...defaultFilters,
            test_type: ["single cell"],
        };
        render(
            <ConfigDisplayTop display="Only Models" filters={filters} />
        );
        expect(screen.getByText("Rattus norvegicus")).toBeInTheDocument();
        // test_type is test-only, should not appear
        expect(screen.queryByText("single cell")).not.toBeInTheDocument();
    });
});
