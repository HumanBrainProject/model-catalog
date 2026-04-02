import React from "react";
import { screen, render } from "@testing-library/react";
import Introduction from "../Introduction";

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

vi.mock("react-plotly.js/factory", () => ({
    default: () => () => <div data-testid="plotly-mock" />,
}));

vi.mock("plotly.js", () => ({}));

// Mock react-slick to avoid layout issues in tests
vi.mock("react-slick", () => ({
    default: ({ children }) => <div data-testid="slider-mock">{children}</div>,
}));

// Mock react-lines-ellipsis
vi.mock("react-lines-ellipsis", () => ({
    default: (props) => <span>{props.text}</span>,
}));

vi.mock("react-lines-ellipsis/lib/responsiveHOC", () => ({
    default: () => (Component) => Component,
}));

// Mock fetch for stats
globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

describe("Introduction (smoke test)", () => {
    it("renders without crashing", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
    });

    it("displays the main title", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(
            screen.getByText("EBRAINS Model Catalog")
        ).toBeInTheDocument();
    });

    it("displays Getting started section", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByText("Getting started")).toBeInTheDocument();
    });

    it("displays About section", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByText("About")).toBeInTheDocument();
    });

    it("displays Featured Models section", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByText("Featured Models")).toBeInTheDocument();
    });

    it("renders the slider/carousel mock", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByTestId("slider-mock")).toBeInTheDocument();
    });

    it("displays the subtitle about collaborative modelling", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(
            screen.getByText(/collaborative and reproducible modelling/)
        ).toBeInTheDocument();
    });

    it("displays See documentation link", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByText("See documentation")).toBeInTheDocument();
    });

    it("displays More information link", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        expect(screen.getByText("More information")).toBeInTheDocument();
    });

    it("displays View Model buttons in carousel cards", () => {
        render(
            <Introduction
                handleSelectFeaturedModel={vi.fn()}
                handleConfig={vi.fn()}
            />
        );
        const viewButtons = screen.getAllByText("View Model");
        expect(viewButtons.length).toBeGreaterThan(0);
    });
});
