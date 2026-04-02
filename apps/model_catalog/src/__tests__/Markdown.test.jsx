import React from "react";
import { render, screen } from "@testing-library/react";

vi.mock("react-mathjax", () => ({
    default: {
        Provider: ({ children }) => <div data-testid="mathjax-provider">{children}</div>,
        Node: ({ formula }) => <span data-testid="mathjax-node">{formula}</span>,
    },
    __esModule: false,
}));

vi.mock("remark-math", () => ({ default: () => {} }));

import Markdown from "../Markdown";

describe("Markdown", () => {
    it("renders within a MathJax provider", () => {
        render(<Markdown source="Hello world" />);
        expect(screen.getByTestId("mathjax-provider")).toBeInTheDocument();
    });

    it("renders markdown content", () => {
        render(<Markdown source="Hello world" />);
        expect(screen.getByText("Hello world")).toBeInTheDocument();
    });
});
