import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import SwitchMultiWay from "../SwitchMultiWay";

describe("SwitchMultiWay", () => {
    const defaultProps = {
        values: ["models", "tests", "results"],
        selected: "models",
        onChange: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all option labels in title case", () => {
        render(<SwitchMultiWay {...defaultProps} />);
        expect(screen.getByText("Models")).toBeInTheDocument();
        expect(screen.getByText("Tests")).toBeInTheDocument();
        expect(screen.getByText("Results")).toBeInTheDocument();
    });

    it("calls onChange when a label is clicked", () => {
        render(<SwitchMultiWay {...defaultProps} />);
        fireEvent.click(screen.getByText("Tests"));
        expect(defaultProps.onChange).toHaveBeenCalledWith("tests");
    });

    it("calls onChange with the correct value for each option", () => {
        render(<SwitchMultiWay {...defaultProps} />);
        fireEvent.click(screen.getByText("Results"));
        expect(defaultProps.onChange).toHaveBeenCalledWith("results");
    });

    it("renders a radio input for each value", () => {
        const { container } = render(<SwitchMultiWay {...defaultProps} />);
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios).toHaveLength(3);
    });

    it("has the initially selected radio checked", () => {
        const { container } = render(<SwitchMultiWay {...defaultProps} />);
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();
        expect(radios[2]).not.toBeChecked();
    });
});
