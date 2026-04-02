import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModel, mockPerson, mockPerson2 } from "./helpers/fixtures";
import ModelTable from "../ModelTable";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("ModelTable", () => {
    const columns = [
        { name: "ID", options: { display: false } },
        { name: "Name", options: { display: true } },
        { name: "Alias", options: { display: true } },
        { name: "Author", options: { display: true } },
        { name: "Visibility", options: { display: true } },
        { name: "Collab ID", options: { display: false } },
        { name: "Species", options: { display: true } },
        { name: "Brain Region", options: { display: true } },
        { name: "Cell Type", options: { display: true } },
        { name: "Model Scope", options: { display: true } },
        { name: "Abstraction Level", options: { display: false } },
        { name: "Owner", options: { display: false } },
        { name: "Organization", options: { display: false } },
        { name: "Date Created", options: { display: false } },
        { name: "JSON", options: { display: false } },
    ];

    const defaultProps = {
        modelData: [mockModel],
        columns: columns,
        display: "Only Models",
        handleRowClick: vi.fn(),
        onColumnsChange: vi.fn(),
        changeTableWidth: vi.fn(),
        openAddModelForm: vi.fn(),
    };

    it("renders without crashing", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
    });

    it("displays the table title 'Models'", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        const elements = screen.getAllByText("Models");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays model name in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.name)).toBeInTheDocument();
    });

    it("displays model alias in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.alias)).toBeInTheDocument();
    });

    it("renders with empty model data", () => {
        renderWithProviders(<ModelTable {...defaultProps} modelData={[]} />);
        const elements = screen.getAllByText("Models");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays formatted author names", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(
            screen.getByText("Frodo Baggins, Tom Bombadil")
        ).toBeInTheDocument();
    });

    it("displays species in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.species)).toBeInTheDocument();
    });

    it("displays brain region in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.brain_region)).toBeInTheDocument();
    });

    it("displays cell type in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.cell_type)).toBeInTheDocument();
    });

    it("displays model scope in the table", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText(mockModel.model_scope)).toBeInTheDocument();
    });

    it("displays visibility as Public for non-private model", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        expect(screen.getByText("Public")).toBeInTheDocument();
    });

    it("displays visibility as Private for private model", () => {
        const privateModel = { ...mockModel, private: true };
        renderWithProviders(
            <ModelTable {...defaultProps} modelData={[privateModel]} />
        );
        expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("renders with multiple models", () => {
        const model2 = {
            ...mockModel,
            id: "other-model-id",
            name: "Second Model",
            alias: "second-model",
            author: [mockPerson],
            owner: [mockPerson2],
        };
        renderWithProviders(
            <ModelTable {...defaultProps} modelData={[mockModel, model2]} />
        );
        expect(screen.getByText(mockModel.name)).toBeInTheDocument();
        expect(screen.getByText("Second Model")).toBeInTheDocument();
    });

    it("displays column headers", () => {
        renderWithProviders(<ModelTable {...defaultProps} />);
        // "Name" appears as both column header and data, so check it exists
        expect(screen.getAllByText("Name").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Alias").length).toBeGreaterThan(0);
        expect(screen.getAllByText("Author").length).toBeGreaterThan(0);
    });
});
