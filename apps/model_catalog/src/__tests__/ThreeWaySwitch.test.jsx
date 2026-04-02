import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ThreeWaySwitch from "../ThreeWaySwitch";

describe("ThreeWaySwitch", () => {
    const defaultProps = {
        values: ["all", "public", "private"],
        selected: "all",
        onChange: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders all option labels in title case", () => {
        render(<ThreeWaySwitch {...defaultProps} />);
        expect(screen.getByText("All")).toBeInTheDocument();
        expect(screen.getByText("Public")).toBeInTheDocument();
        expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("calls onChange when a label is clicked", () => {
        render(<ThreeWaySwitch {...defaultProps} />);
        fireEvent.click(screen.getByText("Public"));
        expect(defaultProps.onChange).toHaveBeenCalledWith("public");
    });

    it("renders three radio inputs", () => {
        const { container } = render(<ThreeWaySwitch {...defaultProps} />);
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios).toHaveLength(3);
    });

    it("has the initially selected radio checked", () => {
        const { container } = render(<ThreeWaySwitch {...defaultProps} />);
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios[0]).toBeChecked();
        expect(radios[1]).not.toBeChecked();
    });

    it("updates checked state after clicking a different option", () => {
        const { container } = render(<ThreeWaySwitch {...defaultProps} />);
        fireEvent.click(screen.getByText("Private"));
        const radios = container.querySelectorAll('input[type="radio"]');
        expect(radios[0]).not.toBeChecked();
        expect(radios[2]).toBeChecked();
    });
});
