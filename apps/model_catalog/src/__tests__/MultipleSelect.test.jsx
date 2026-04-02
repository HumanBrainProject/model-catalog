import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import MultipleSelect from "../MultipleSelect";

describe("MultipleSelect", () => {
    const defaultProps = {
        label: "species",
        itemNames: ["Mouse", "Rat", "Human"],
        value: [],
        handleChange: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders with the formatted label", () => {
        render(<MultipleSelect {...defaultProps} />);
        expect(screen.getByText("Species")).toBeInTheDocument();
    });

    it("renders all options when the select is opened", () => {
        render(<MultipleSelect {...defaultProps} />);
        // Open the select by clicking on it
        fireEvent.mouseDown(screen.getByRole("button"));
        expect(screen.getByText("Mouse")).toBeInTheDocument();
        expect(screen.getByText("Rat")).toBeInTheDocument();
        expect(screen.getByText("Human")).toBeInTheDocument();
    });

    it("displays selected values as comma-separated text", () => {
        render(<MultipleSelect {...defaultProps} value={["Mouse", "Rat"]} />);
        expect(screen.getByText("Mouse, Rat")).toBeInTheDocument();
    });

    it("calls handleChange when an option is selected", () => {
        render(<MultipleSelect {...defaultProps} />);
        fireEvent.mouseDown(screen.getByRole("button"));
        fireEvent.click(screen.getByText("Mouse"));
        expect(defaultProps.handleChange).toHaveBeenCalled();
    });
});
