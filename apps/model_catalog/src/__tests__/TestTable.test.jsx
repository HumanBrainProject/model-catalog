import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTest, mockPerson } from "./helpers/fixtures";
import TestTable from "../TestTable";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("TestTable", () => {
    const columns = [
        { name: "ID", options: { display: false } },
        { name: "Name", options: { display: true } },
        { name: "Alias", options: { display: true } },
        { name: "Author", options: { display: true } },
        { name: "Status", options: { display: true } },
        { name: "Collab ID", options: { display: false } },
        { name: "Species", options: { display: true } },
        { name: "Brain Region", options: { display: true } },
        { name: "Cell Type", options: { display: true } },
        { name: "Test Type", options: { display: true } },
        { name: "Score Type", options: { display: true } },
        { name: "Data Type", options: { display: false } },
        { name: "Recording Modality", options: { display: false } },
        { name: "Data Location", options: { display: false } },
        { name: "Date Created", options: { display: false } },
        { name: "JSON", options: { display: false } },
    ];

    const defaultProps = {
        testData: [mockTest],
        columns: columns,
        display: "Only Tests",
        handleRowClick: vi.fn(),
        onColumnsChange: vi.fn(),
        changeTableWidth: vi.fn(),
        openAddTestForm: vi.fn(),
    };

    it("renders without crashing", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
    });

    it("displays the table title 'Tests'", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        const elements = screen.getAllByText("Tests");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays test name in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.name)).toBeInTheDocument();
    });

    it("displays test alias in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.alias)).toBeInTheDocument();
    });

    it("renders with empty test data", () => {
        renderWithProviders(<TestTable {...defaultProps} testData={[]} />);
        const elements = screen.getAllByText("Tests");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays formatted author names", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(
            screen.getByText("Frodo Baggins, Tom Bombadil")
        ).toBeInTheDocument();
    });

    it("displays species in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.species)).toBeInTheDocument();
    });

    it("displays brain region in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.brain_region)).toBeInTheDocument();
    });

    it("displays cell type in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.cell_type)).toBeInTheDocument();
    });

    it("displays test type in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.test_type)).toBeInTheDocument();
    });

    it("displays score type in the table", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.score_type)).toBeInTheDocument();
    });

    it("displays implementation status", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getByText(mockTest.implementation_status)).toBeInTheDocument();
    });

    it("renders with multiple tests", () => {
        const test2 = {
            ...mockTest,
            id: "other-test-id",
            name: "Second Test",
            alias: "second-test",
            author: [mockPerson],
        };
        renderWithProviders(
            <TestTable {...defaultProps} testData={[mockTest, test2]} />
        );
        expect(screen.getByText(mockTest.name)).toBeInTheDocument();
        expect(screen.getByText("Second Test")).toBeInTheDocument();
    });

    it("displays column headers", () => {
        renderWithProviders(<TestTable {...defaultProps} />);
        expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Alias").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Author").length).toBeGreaterThan(0);
    });
});
