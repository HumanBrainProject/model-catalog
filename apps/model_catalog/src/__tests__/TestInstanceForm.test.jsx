import React from "react";
import { screen } from "@testing-library/react";
import Grid from "@material-ui/core/Grid";
import { renderWithContext } from "./helpers/renderWithProviders";
import { mockVocab } from "./helpers/fixtures";
import TestInstanceForm from "../TestInstanceForm";

describe("TestInstanceForm", () => {
    const defaultValue = {
        version: "1.0",
        repository: "https://example.com/test_code.py",
        path: "mylib.tests.MyTest",
        description: "Test instance",
        parameters: "",
    };

    const defaultProps = {
        value: defaultValue,
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
            <Grid container><TestInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Repository (URL)").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("path").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("description").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("parameters").length).toBeGreaterThanOrEqual(1);
    });

    it("renders helper text for version field", () => {
        renderWithContext(
            <Grid container><TestInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getByText(/version number should match the name of a tag/)).toBeInTheDocument();
    });

    it("renders helper text for repository field", () => {
        renderWithContext(
            <Grid container><TestInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getByText(/Specify the location of test source code/)).toBeInTheDocument();
    });

    it("renders helper text for path field", () => {
        renderWithContext(
            <Grid container><TestInstanceForm {...defaultProps} /></Grid>,
            contextOverrides
        );
        expect(screen.getByText(/Specify the Python path within test module/)).toBeInTheDocument();
    });
});
