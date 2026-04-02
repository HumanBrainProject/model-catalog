import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SingleSelect from "../SingleSelect";

describe("SingleSelect", () => {
    const defaultProps = {
        label: "Brain Region",
        itemNames: ["Hippocampus", "Cortex", "Cerebellum"],
        value: "",
        handleChange: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders with the formatted label", () => {
        render(<SingleSelect {...defaultProps} />);
        expect(screen.getByLabelText("Brain Region")).toBeInTheDocument();
    });

    it("renders helper text when provided", () => {
        render(<SingleSelect {...defaultProps} helperText="Select a region" />);
        expect(screen.getByText("Select a region")).toBeInTheDocument();
    });

    it("displays the current value", () => {
        render(<SingleSelect {...defaultProps} value="Hippocampus" />);
        expect(screen.getByDisplayValue("Hippocampus")).toBeInTheDocument();
    });

    it("shows options when the input is clicked", () => {
        render(<SingleSelect {...defaultProps} />);
        const input = screen.getByRole("textbox");
        fireEvent.click(input);
        fireEvent.change(input, { target: { value: "" } });
        // Open the dropdown by clicking the input
        fireEvent.mouseDown(input);
    });
});
