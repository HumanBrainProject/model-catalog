import React from "react";
import { screen } from "@testing-library/react";
import Grid from "@material-ui/core/Grid";
import { renderWithContext } from "./helpers/renderWithProviders";
import { mockVocab } from "./helpers/fixtures";
import TestInstanceArrayOfForms from "../TestInstanceArrayOfForms";

describe("TestInstanceArrayOfForms", () => {
    const defaultProps = {
        name: "instances",
        value: [
            {
                version: "1.0",
                repository: "https://example.com/test.py",
                path: "mylib.tests.MyTest",
                description: "First version",
                parameters: "",
            },
        ],
        onChange: vi.fn(),
    };

    const contextOverrides = {
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders a TestInstanceForm for each instance", () => {
        renderWithContext(
            <Grid container><TestInstanceArrayOfForms {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Repository (URL)").length).toBeGreaterThanOrEqual(1);
    });

    it("renders multiple forms when multiple instances are provided", () => {
        const props = {
            ...defaultProps,
            value: [
                { version: "1.0", repository: "", path: "", description: "", parameters: "" },
                { version: "2.0", repository: "", path: "", description: "", parameters: "" },
            ],
        };
        renderWithContext(
            <Grid container><TestInstanceArrayOfForms {...props} /></Grid>,
            contextOverrides
        );
        // Each MUI outlined TextField renders label in both <label> and <legend><span>
        const versionLabels = screen.getAllByText("Version");
        expect(versionLabels.length).toBeGreaterThanOrEqual(2);
    });

    it("renders no forms when value is empty", () => {
        renderWithContext(
            <Grid container><TestInstanceArrayOfForms {...defaultProps} value={[]} /></Grid>,
            contextOverrides
        );
        expect(screen.queryByText("Version")).not.toBeInTheDocument();
    });
});
