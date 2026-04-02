import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModel, mockModelInstance, mockModelInstance2 } from "./helpers/fixtures";
import ModelDetailContent from "../ModelDetailContent";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("ModelDetailContent", () => {
    const defaultProps = {
        description: mockModel.description,
        instances: mockModel.instances,
        id: mockModel.id,
        modelScope: mockModel.model_scope,
        canEdit: false,
        results: [],
        loading: false,
        addModelInstanceCompare: vi.fn(),
        removeModelInstanceCompare: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
    });

    it("displays the description label", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        const elements = screen.getAllByText("Description:");
        expect(elements.length).toBeGreaterThan(0);
    });

    it("displays the Versions heading", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(screen.getByText("Versions")).toBeInTheDocument();
    });

    it("displays instance version numbers", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(screen.getByText(mockModelInstance.version)).toBeInTheDocument();
        expect(screen.getByText(mockModelInstance2.version)).toBeInTheDocument();
    });

    it("shows no-instances message when instances is empty", () => {
        renderWithProviders(
            <ModelDetailContent {...defaultProps} instances={[]} />
        );
        expect(
            screen.getByText(
                /No model instances have yet been registered/
            )
        ).toBeInTheDocument();
    });

    it("shows loading indicator when loading is true and no instances", () => {
        renderWithProviders(
            <ModelDetailContent
                {...defaultProps}
                instances={[]}
                loading={true}
            />
        );
        // LoadingIndicator renders a progress element
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("does not show 'Add new version' button when canEdit is false", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(
            screen.queryByRole("button", { name: /add new version/i })
        ).not.toBeInTheDocument();
    });

    it("shows 'Add new version' button when canEdit is true", () => {
        renderWithProviders(
            <ModelDetailContent {...defaultProps} canEdit={true} />
        );
        expect(
            screen.getByRole("button", { name: /add new version/i })
        ).toBeInTheDocument();
    });

    it("displays instance IDs", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(screen.getByText(mockModelInstance.id)).toBeInTheDocument();
        expect(screen.getByText(mockModelInstance2.id)).toBeInTheDocument();
    });

    it("displays instance descriptions", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockModelInstance.description)
        ).toBeInTheDocument();
    });

    it("displays source URLs for instances", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockModelInstance.source)
        ).toBeInTheDocument();
    });

    it("displays code format for instances", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        const codeFormats = screen.getAllByText(mockModelInstance.code_format);
        expect(codeFormats.length).toBeGreaterThan(0);
    });

    it("displays license for instances", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        const licenses = screen.getAllByText(mockModelInstance.license);
        expect(licenses.length).toBeGreaterThan(0);
    });

    it("displays download button for each instance", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        const downloadButtons = screen.getAllByTitle(
            "Download model instance"
        );
        expect(downloadButtons.length).toBe(2);
    });

    it("displays compare icons for each instance", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        const compareButtons = screen.getAllByRole("button", {
            name: /compare model/i,
        });
        expect(compareButtons.length).toBe(2);
    });

    it("shows edit instance button when canEdit is true", () => {
        renderWithProviders(
            <ModelDetailContent {...defaultProps} canEdit={true} />
        );
        const editButtons = screen.getAllByRole("button", {
            name: /edit model instance/i,
        });
        expect(editButtons.length).toBeGreaterThan(0);
    });

    it("does not show edit instance button when canEdit is false", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        expect(
            screen.queryByRole("button", { name: /edit model instance/i })
        ).not.toBeInTheDocument();
    });

    it("displays KG link out for instances with alternatives", () => {
        renderWithProviders(<ModelDetailContent {...defaultProps} />);
        // mockModelInstance has a search.kg.ebrains.eu alternative
        expect(
            screen.getByAltText("Link to EBRAINS Knowledge Graph Search")
        ).toBeInTheDocument();
    });
});
