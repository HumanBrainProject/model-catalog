import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModel, mockModelInstance } from "./helpers/fixtures";
import ModelDetail from "../ModelDetail";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

vi.mock("react-plotly.js", () => ({
    default: () => <div data-testid="plotly-mock" />,
}));

describe("ModelDetail", () => {
    const defaultProps = {
        open: true,
        modelData: mockModel,
        onClose: vi.fn(),
        updateCurrentModelData: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing when open", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
    });

    it("displays model name", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(screen.getByText(mockModel.name)).toBeInTheDocument();
    });

    it("displays the Info tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(screen.getByRole("tab", { name: /info/i })).toBeInTheDocument();
    });

    it("displays the Discussion tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /discussion/i })
        ).toBeInTheDocument();
    });

    it("displays the Validations tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(
            screen.getByRole("tab", { name: /validations/i })
        ).toBeInTheDocument();
    });

    it("has a close button", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /close/i })
        ).toBeInTheDocument();
    });

    it("does not render when open is false", () => {
        const { container } = renderWithProviders(
            <ModelDetail {...defaultProps} open={false} />
        );
        // Dialog should not be visible
        expect(screen.queryByText(mockModel.name)).not.toBeInTheDocument();
    });

    it("displays model alias in header", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(screen.getByText(mockModel.alias)).toBeInTheDocument();
    });

    it("displays the model description in Info tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(
            screen.getByText(mockModel.description)
        ).toBeInTheDocument();
    });

    it("displays instance versions in Info tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(
            screen.getByText(mockModelInstance.version)
        ).toBeInTheDocument();
    });

    it("displays metadata in the Info tab sidebar", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        // ModelDetailMetadata displays species, brain region, etc.
        expect(screen.getByText(mockModel.species)).toBeInTheDocument();
        expect(screen.getByText(mockModel.brain_region)).toBeInTheDocument();
    });

    it("Validations tab is clickable", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        const validationsTab = screen.getByRole("tab", {
            name: /validations/i,
        });
        // Verify the tab exists and can be clicked without error
        fireEvent.click(validationsTab);
        expect(validationsTab).toBeInTheDocument();
    });

    it("can switch to Discussion tab", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        const discussionTab = screen.getByRole("tab", {
            name: /discussion/i,
        });
        fireEvent.click(discussionTab);
        expect(discussionTab).toHaveAttribute("aria-selected", "true");
    });

    it("displays the Versions heading in content", () => {
        renderWithProviders(<ModelDetail {...defaultProps} />);
        expect(screen.getByText("Versions")).toBeInTheDocument();
    });
});
