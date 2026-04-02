import React from "react";
import { render, screen } from "@testing-library/react";
import WarningBox from "../WarningBox";

describe("WarningBox", () => {
    it("renders the warning message when a message is provided", () => {
        render(<WarningBox message="This is a warning" />);
        expect(screen.getByText("This is a warning")).toBeInTheDocument();
    });

    it("renders nothing when message is null", () => {
        const { container } = render(<WarningBox message={null} />);
        expect(container.textContent).toBe("");
    });

    it("renders nothing when message is undefined", () => {
        const { container } = render(<WarningBox />);
        expect(container.textContent).toBe("");
    });

    it('renders nothing when message is "ok"', () => {
        const { container } = render(<WarningBox message="ok" />);
        expect(container.textContent).toBe("");
    });

    it("renders nothing when message is an empty string", () => {
        const { container } = render(<WarningBox message="" />);
        expect(container.textContent).toBe("");
    });
});
