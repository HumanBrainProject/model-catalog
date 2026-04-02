import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CustomToolbarSelect from "../MUIDataTableCustomRowToolbar";

describe("MUIDataTableCustomRowToolbar", () => {
    const defaultProps = {
        selectedRows: { data: [{ index: 0 }] },
        viewSelectedItems: vi.fn(),
        downloadSelectedJSON: vi.fn(),
        hideTableRows: vi.fn(),
        addCompare: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders four action buttons", () => {
        render(<CustomToolbarSelect {...defaultProps} />);
        const buttons = screen.getAllByRole("button");
        expect(buttons).toHaveLength(4);
    });

    it("calls viewSelectedItems when the first button is clicked", () => {
        render(<CustomToolbarSelect {...defaultProps} />);
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[0]);
        expect(defaultProps.viewSelectedItems).toHaveBeenCalledWith(
            defaultProps.selectedRows
        );
    });

    it("calls downloadSelectedJSON when the second button is clicked", () => {
        render(<CustomToolbarSelect {...defaultProps} />);
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[1]);
        expect(defaultProps.downloadSelectedJSON).toHaveBeenCalledWith(
            defaultProps.selectedRows
        );
    });

    it("calls hideTableRows when the third button is clicked", () => {
        render(<CustomToolbarSelect {...defaultProps} />);
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[2]);
        expect(defaultProps.hideTableRows).toHaveBeenCalledWith(
            defaultProps.selectedRows
        );
    });

    it("calls addCompare when the fourth button is clicked", () => {
        render(<CustomToolbarSelect {...defaultProps} />);
        const buttons = screen.getAllByRole("button");
        fireEvent.click(buttons[3]);
        expect(defaultProps.addCompare).toHaveBeenCalledWith(
            defaultProps.selectedRows
        );
    });
});
