import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { mockModel, mockPerson, mockPerson2 } from "./helpers/fixtures";
import { createMockDatastore } from "./helpers/mockDatastore";
import ModelDetailHeader from "../ModelDetailHeader";
import { formatAuthors } from "../utils";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("ModelDetailHeader", () => {
    const defaultProps = {
        name: mockModel.name,
        authors: formatAuthors(mockModel.author),
        private: mockModel.private,
        id: mockModel.id,
        alias: mockModel.alias,
        dateCreated: mockModel.date_created,
        owner: formatAuthors(mockModel.owner),
        modelData: mockModel,
        canEdit: false,
        updateCurrentModelData: vi.fn(),
        compareFlag: null,
        addModelCompare: vi.fn(),
        removeModelCompare: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
    });

    it("displays the model name", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.name)).toBeInTheDocument();
    });

    it("displays the model ID", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.id)).toBeInTheDocument();
    });

    it("displays the model alias", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.alias)).toBeInTheDocument();
    });

    it("displays the authors", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(
            screen.getByText(formatAuthors(mockModel.author))
        ).toBeInTheDocument();
    });

    it("shows public icon when model is not private", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        // PublicIcon renders with title "public"
        expect(screen.getByTitle("public")).toBeInTheDocument();
    });

    it("shows lock icon when model is private", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} private={true} />
        );
        expect(screen.getByTitle("private")).toBeInTheDocument();
    });

    it("does not show edit button when canEdit is false", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(
            screen.queryByRole("button", { name: /edit model/i })
        ).not.toBeInTheDocument();
    });

    it("shows edit button when canEdit is true", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} canEdit={true} />
        );
        expect(
            screen.getByRole("button", { name: /edit model/i })
        ).toBeInTheDocument();
    });

    it("displays the date created", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it("displays the custodian/owner", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Custodian:/)).toBeInTheDocument();
        expect(
            screen.getByText(formatAuthors(mockModel.owner))
        ).toBeInTheDocument();
    });

    it("shows compare button when compareFlag is false", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} compareFlag={false} />
        );
        expect(screen.getByTitle("Add model to compare")).toBeInTheDocument();
    });

    it("shows remove from compare when compareFlag is true", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} compareFlag={true} />
        );
        expect(
            screen.getByTitle("Remove model from compare")
        ).toBeInTheDocument();
    });

    it("shows disabled compare when compareFlag is null (no instances)", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} compareFlag={null} />
        );
        expect(
            screen.getByTitle("Cannot add to compare (no model instances)")
        ).toBeInTheDocument();
    });

    it("shows duplicate button when status is not read-only", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /duplicate model/i })
        ).toBeInTheDocument();
    });

    it("displays alias label when alias exists", () => {
        renderWithProviders(<ModelDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Alias:/)).toBeInTheDocument();
    });

    it("does not display alias label when alias is empty", () => {
        renderWithProviders(
            <ModelDetailHeader {...defaultProps} alias="" />
        );
        expect(screen.queryByText(/Alias:/)).not.toBeInTheDocument();
    });
});
