import React from "react";
import { render, screen } from "@testing-library/react";
import SearchBar from "../SearchBar";

describe("SearchBar", () => {
    it("renders a text input", () => {
        render(<SearchBar />);
        expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
});
