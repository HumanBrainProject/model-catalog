import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import CustomToolbar from "../MUIDataTableCustomToolbar";

describe("MUIDataTableCustomToolbar", () => {
    const defaultProps = {
        addNew: vi.fn(),
        changeTableWidth: vi.fn(),
        display: "Models and Tests",
        tableType: "models",
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders Table Width button when display is 'Models and Tests'", () => {
        renderWithProviders(<CustomToolbar {...defaultProps} />);
        // MUI Tooltip sets the title attribute on the button
        const buttons = screen.getAllByRole("button");
        expect(buttons.length).toBeGreaterThanOrEqual(1);
    });

    it("calls changeTableWidth when the flip icon button is clicked", () => {
        renderWithProviders(<CustomToolbar {...defaultProps} />);
        // The first button is the Table Width (flip) button
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);
        expect(defaultProps.changeTableWidth).toHaveBeenCalledTimes(1);
    });

    it("renders fewer buttons when display is not 'Models and Tests'", () => {
        const { container: container1 } = renderWithProviders(
            <CustomToolbar {...defaultProps} display="Models and Tests" />
        );
        const buttons1 = container1.querySelectorAll("button");

        const { container: container2 } = renderWithProviders(
            <CustomToolbar {...defaultProps} display="Models" />
        );
        const buttons2 = container2.querySelectorAll("button");

        // "Models and Tests" has the Table Width button, "Models" doesn't
        expect(buttons1.length).toBeGreaterThan(buttons2.length);
    });

    it("does not show Add button when user is not authenticated", () => {
        renderWithProviders(<CustomToolbar {...defaultProps} />);
        // Default context has empty auth (not authenticated), so no Add button
        // Only the Table Width button should be present
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(1);
    });
});
