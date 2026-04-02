import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTest, mockTestInstance } from "./helpers/fixtures";
import TestDetail from "../TestDetail";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

describe("TestDetail", () => {
    const defaultProps = {
        open: true,
        testData: { ...mockTest },
        onClose: vi.fn(),
        updateCurrentTestData: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing when open", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
    });

    it("displays test name", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(screen.getByText(mockTest.name)).toBeInTheDocument();
    });

    it("displays the Info tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(screen.getByRole("tab", { name: /info/i })).toBeInTheDocument();
    });

    it("displays the Discussion tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /discussion/i })
        ).toBeInTheDocument();
    });

    it("displays the Validations tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /validations/i })
        ).toBeInTheDocument();
    });

    it("has a close button", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /close/i })
        ).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
        renderWithProviders(
            <TestDetail {...defaultProps} open={false} />
        );
        expect(screen.queryByText(mockTest.name)).not.toBeInTheDocument();
    });

    it("displays test alias in header", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(screen.getByText(mockTest.alias)).toBeInTheDocument();
    });

    it("displays the test description in Info tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(
            screen.getByText(mockTest.description)
        ).toBeInTheDocument();
    });

    it("displays instance versions in Info tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.version)
        ).toBeInTheDocument();
    });

    it("displays metadata in the Info tab sidebar", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        // TestDetailMetadata displays species, brain region, etc.
        expect(screen.getByText(mockTest.species)).toBeInTheDocument();
        expect(screen.getByText(mockTest.brain_region)).toBeInTheDocument();
    });

    it("Validations tab is clickable", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        const validationsTab = screen.getByRole("tab", {
            name: /validations/i,
        });
        fireEvent.click(validationsTab);
        expect(validationsTab).toBeInTheDocument();
    });

    it("can switch to Discussion tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        const discussionTab = screen.getByRole("tab", {
            name: /discussion/i,
        });
        fireEvent.click(discussionTab);
        expect(discussionTab).toHaveAttribute("aria-selected", "true");
    });

    it("displays the Versions heading in content", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(screen.getByText("Versions")).toBeInTheDocument();
    });

    it("displays data location in Info tab", () => {
        renderWithProviders(<TestDetail {...defaultProps} />);
        expect(screen.getByText("Data Location:")).toBeInTheDocument();
    });
});
