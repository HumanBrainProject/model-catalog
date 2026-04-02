import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTest, mockTestInstance } from "./helpers/fixtures";
import TestDetailContent from "../TestDetailContent";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("TestDetailContent", () => {
    const defaultProps = {
        dataLocation: mockTest.data_location,
        description: mockTest.description,
        instances: mockTest.instances,
        id: mockTest.id,
        results: [],
        loading: false,
        addTestInstanceCompare: vi.fn(),
        removeTestInstanceCompare: vi.fn(),
        canEdit: false,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
    });

    it("displays the Data Location label", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(screen.getByText("Data Location:")).toBeInTheDocument();
    });

    it("displays the Description label", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        const elements = screen.getAllByText("Description:");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays the Versions heading", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(screen.getByText("Versions")).toBeInTheDocument();
    });

    it("displays instance version numbers", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.version)
        ).toBeInTheDocument();
    });

    it("shows no-instances message when instances is empty", () => {
        renderWithProviders(
            <TestDetailContent {...defaultProps} instances={[]} />
        );
        expect(
            screen.getByText(
                /No test instances have yet been registered/
            )
        ).toBeInTheDocument();
    });

    it("shows loading indicator when loading and no instances", () => {
        renderWithProviders(
            <TestDetailContent
                {...defaultProps}
                instances={[]}
                loading={true}
            />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("shows data location URLs", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTest.data_location[0])
        ).toBeInTheDocument();
    });

    it("does not show 'Add new version' button when canEdit is false", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.queryByRole("button", { name: /add new version/i })
        ).not.toBeInTheDocument();
    });

    it("shows 'Add new version' button when canEdit is true", () => {
        renderWithProviders(
            <TestDetailContent {...defaultProps} canEdit={true} />
        );
        expect(
            screen.getByRole("button", { name: /add new version/i })
        ).toBeInTheDocument();
    });

    it("displays instance IDs", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.id)
        ).toBeInTheDocument();
    });

    it("displays instance descriptions", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.description)
        ).toBeInTheDocument();
    });

    it("displays source/repository for instances", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.repository)
        ).toBeInTheDocument();
    });

    it("displays path for instances", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockTestInstance.path)
        ).toBeInTheDocument();
    });

    it("displays compare icons for each instance", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        const compareButtons = screen.getAllByRole("button", {
            name: /compare test/i,
        });
        expect(compareButtons.length).toBeGreaterThan(0);
    });

    it("shows edit instance button when canEdit is true", () => {
        renderWithProviders(
            <TestDetailContent {...defaultProps} canEdit={true} />
        );
        const editButtons = screen.getAllByRole("button", {
            name: /edit test instance/i,
        });
        expect(editButtons.length).toBeGreaterThan(0);
    });

    it("does not show edit instance button when canEdit is false", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(
            screen.queryByRole("button", { name: /edit test instance/i })
        ).not.toBeInTheDocument();
    });

    it("displays Description label in instance details", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        // "Description:" appears for both the main description and instance description
        const descLabels = screen.getAllByText("Description:");
        expect(descLabels.length).toBeGreaterThanOrEqual(1);
    });

    it("displays Source label for instances", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(screen.getByText(/Source:/)).toBeInTheDocument();
    });

    it("displays Path label for instances", () => {
        renderWithProviders(<TestDetailContent {...defaultProps} />);
        expect(screen.getByText(/Path:/)).toBeInTheDocument();
    });
});
