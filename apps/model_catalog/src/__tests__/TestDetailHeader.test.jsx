import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders, renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTest } from "./helpers/fixtures";
import TestDetailHeader from "../TestDetailHeader";
import { formatAuthors } from "../utils";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("TestDetailHeader", () => {
    const defaultProps = {
        name: mockTest.name,
        authors: formatAuthors(mockTest.author),
        id: mockTest.id,
        alias: mockTest.alias,
        dateCreated: mockTest.date_created,
        testData: mockTest,
        updateCurrentTestData: vi.fn(),
        compareFlag: null,
        addTestCompare: vi.fn(),
        removeTestCompare: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
    });

    it("displays the test name", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.name)).toBeInTheDocument();
    });

    it("displays the test ID", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.id)).toBeInTheDocument();
    });

    it("displays the test alias", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.alias)).toBeInTheDocument();
    });

    it("displays the authors", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(
            screen.getByText(formatAuthors(mockTest.author))
        ).toBeInTheDocument();
    });

    it("shows edit button (status is not read-only by default)", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /edit test/i })
        ).toBeInTheDocument();
    });

    it("shows duplicate button", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /duplicate test/i })
        ).toBeInTheDocument();
    });

    it("displays the date created", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
    });

    it("shows compare button when compareFlag is false", () => {
        renderWithProviders(
            <TestDetailHeader {...defaultProps} compareFlag={false} />
        );
        expect(screen.getByTitle("Add test to compare")).toBeInTheDocument();
    });

    it("shows remove from compare when compareFlag is true", () => {
        renderWithProviders(
            <TestDetailHeader {...defaultProps} compareFlag={true} />
        );
        expect(
            screen.getByTitle("Remove test from compare")
        ).toBeInTheDocument();
    });

    it("shows disabled compare when compareFlag is null (no instances)", () => {
        renderWithProviders(
            <TestDetailHeader {...defaultProps} compareFlag={null} />
        );
        expect(
            screen.getByTitle("Cannot add to compare (no test instances)")
        ).toBeInTheDocument();
    });

    it("displays alias label when alias exists", () => {
        renderWithProviders(<TestDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Alias:/)).toBeInTheDocument();
    });

    it("does not display alias label when alias is empty", () => {
        renderWithProviders(
            <TestDetailHeader {...defaultProps} alias="" />
        );
        expect(screen.queryByText(/Alias:/)).not.toBeInTheDocument();
    });

    it("displays implementation status when provided", () => {
        renderWithProviders(
            <TestDetailHeader
                {...defaultProps}
                implementation_status="published"
            />
        );
        expect(
            screen.getByText(/Implementation Status:/)
        ).toBeInTheDocument();
        expect(screen.getByText("published")).toBeInTheDocument();
    });

    it("hides edit and duplicate buttons when status is read-only", () => {
        renderWithContext(
            <TestDetailHeader {...defaultProps} />,
            { status: ["read-only", vi.fn()] }
        );
        expect(
            screen.queryByRole("button", { name: /edit test/i })
        ).not.toBeInTheDocument();
        expect(
            screen.queryByRole("button", { name: /duplicate test/i })
        ).not.toBeInTheDocument();
    });
});
