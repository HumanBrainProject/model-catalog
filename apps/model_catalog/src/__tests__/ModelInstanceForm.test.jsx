import React from "react";
import { screen } from "@testing-library/react";
import Grid from "@material-ui/core/Grid";
import { renderWithContext } from "./helpers/renderWithProviders";
import { mockVocab } from "./helpers/fixtures";
import ModelInstanceForm from "../ModelInstanceForm";

describe("ModelInstanceForm", () => {
    const defaultValue = {
        version: "1.0",
        source: "https://example.com/code.py",
        code_format: "",
        license: "",
        description: "Test instance",
        parameters: "https://example.com/params.py",
        morphology: "",
    };

    const defaultProps = {
        value: defaultValue,
        modelScope: "network",
        onChange: vi.fn(),
    };

    const contextOverrides = {
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all expected fields", () => {
        renderWithContext(
            <Grid container><ModelInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        // MUI outlined TextField renders label text in both <label> and <legend><span>
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Code location (URL)").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Changes").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Parameters").length).toBeGreaterThanOrEqual(1);
    });

    it("does not render morphology field when modelScope is not single cell", () => {
        renderWithContext(
            <Grid container><ModelInstanceForm {...defaultProps} modelScope="network" /></Grid>,
            contextOverrides
        );
        expect(screen.queryByText("Morphology")).not.toBeInTheDocument();
    });

    it("renders morphology field when modelScope is single cell", () => {
        renderWithContext(
            <Grid container><ModelInstanceForm {...defaultProps} modelScope="single cell" /></Grid>,
            contextOverrides
        );
        expect(screen.getAllByText("Morphology").length).toBeGreaterThanOrEqual(1);
    });

    it("renders helper text for version field", () => {
        renderWithContext(
            <Grid container><ModelInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getByText(/version number should match the name of a tag/)).toBeInTheDocument();
    });

    it("renders helper text for parameters field", () => {
        renderWithContext(
            <Grid container><ModelInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getByText(/Location of a parameter file/)).toBeInTheDocument();
    });
});
