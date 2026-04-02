import React from "react";
import { render, screen } from "@testing-library/react";
import ColoredCircularProgress from "../ColoredCircularProgress";

describe("ColoredCircularProgress", () => {
    it("renders a progress indicator", () => {
        render(<ColoredCircularProgress />);
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
});
