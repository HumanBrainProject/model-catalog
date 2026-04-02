import React from "react";
import { render, screen } from "@testing-library/react";
import LoadingIndicatorModal from "../LoadingIndicatorModal";

describe("LoadingIndicatorModal", () => {
    it("renders a progress indicator when open", () => {
        render(<LoadingIndicatorModal open={true} />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders a dialog when open", () => {
        render(<LoadingIndicatorModal open={true} />);
        expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("does not render a dialog when closed", () => {
        render(<LoadingIndicatorModal open={false} />);
        expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
});
