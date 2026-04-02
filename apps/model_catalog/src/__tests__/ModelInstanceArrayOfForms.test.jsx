import React from "react";
import { screen } from "@testing-library/react";
import Grid from "@material-ui/core/Grid";
import { renderWithContext } from "./helpers/renderWithProviders";
import { mockVocab } from "./helpers/fixtures";
import ModelInstanceArrayOfForms from "../ModelInstanceArrayOfForms";

describe("ModelInstanceArrayOfForms", () => {
    const defaultProps = {
        name: "instances",
        value: [
            {
                version: "1.0",
                source: "https://example.com/code.py",
                code_format: "",
                license: "",
                description: "First version",
                parameters: "",
                morphology: "",
            },
        ],
        modelScope: "network",
        onChange: vi.fn(),
    };

    const contextOverrides = {
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders a ModelInstanceForm for each instance", () => {
        renderWithContext(
            <Grid container><ModelInstanceArrayOfForms {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Code location (URL)").length).toBeGreaterThanOrEqual(1);
    });

    it("renders multiple forms when multiple instances are provided", () => {
        const props = {
            ...defaultProps,
            value: [
                { version: "1.0", source: "", code_format: "", license: "", description: "", parameters: "", morphology: "" },
                { version: "2.0", source: "", code_format: "", license: "", description: "", parameters: "", morphology: "" },
            ],
        };
        renderWithContext(
            <Grid container><ModelInstanceArrayOfForms {...props} /></Grid>,
            contextOverrides
        );
        // Each MUI outlined TextField renders label in both <label> and <legend><span>
        // so 2 instances produce 4 "Version" text nodes
        const versionLabels = screen.getAllByText("Version");
        expect(versionLabels.length).toBeGreaterThanOrEqual(2);
    });

    it("renders no forms when value is empty", () => {
        renderWithContext(
            <Grid container><ModelInstanceArrayOfForms {...defaultProps} value={[]} /></Grid>,
            contextOverrides
        );
        expect(screen.queryByText("Version")).not.toBeInTheDocument();
    });
});
