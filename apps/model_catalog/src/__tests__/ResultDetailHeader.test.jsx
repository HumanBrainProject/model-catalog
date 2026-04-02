import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import {
    mockResultExtended,
    mockModel,
    mockTest,
    mockModelInstance,
    mockTestInstance,
} from "./helpers/fixtures";
import ResultDetailHeader from "../ResultDetailHeader";

describe("ResultDetailHeader", () => {
    const defaultProps = {
        id: mockResultExtended.id,
        timestamp: mockResultExtended.timestamp,
        modelID: mockModel.id,
        modelName: mockModel.name,
        modelAlias: mockModel.alias,
        modelInstID: mockModelInstance.id,
        modelVersion: mockModelInstance.version,
        testID: mockTest.id,
        testName: mockTest.name,
        testAlias: mockTest.alias,
        testInstID: mockTestInstance.id,
        testVersion: mockTestInstance.version,
        loading: false,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
    });

    it("displays the result ID", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(
            screen.getByText(mockResultExtended.id)
        ).toBeInTheDocument();
    });

    it("displays 'Validated Model' label", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Validated Model/)).toBeInTheDocument();
    });

    it("displays 'Validation Test' label", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Validation Test/)).toBeInTheDocument();
    });

    it("displays the model name", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.name)).toBeInTheDocument();
    });

    it("displays the test name", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.name)).toBeInTheDocument();
    });

    it("shows loading indicator when loading", () => {
        renderWithProviders(
            <ResultDetailHeader {...defaultProps} loading={true} />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("does not show loading indicator when not loading", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    });

    it("displays the timestamp", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        // formatTimeStampToLongString formats the timestamp
        expect(screen.getByText(/Timestamp/)).toBeInTheDocument();
    });

    it("displays model alias", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.alias)).toBeInTheDocument();
    });

    it("displays model version", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModelInstance.version)).toBeInTheDocument();
    });

    it("displays model ID", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModel.id)).toBeInTheDocument();
    });

    it("displays model instance ID", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockModelInstance.id)).toBeInTheDocument();
    });

    it("displays test alias", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.alias)).toBeInTheDocument();
    });

    it("displays test version", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTestInstance.version)).toBeInTheDocument();
    });

    it("displays test ID", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTest.id)).toBeInTheDocument();
    });

    it("displays test instance ID", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(mockTestInstance.id)).toBeInTheDocument();
    });

    it("displays 'Model ID' label when not loading", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Model ID:/)).toBeInTheDocument();
    });

    it("displays 'Instance ID' labels when not loading", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        const instanceLabels = screen.getAllByText(/Instance ID:/);
        expect(instanceLabels.length).toBe(2); // model instance and test instance
    });

    it("displays 'Test ID' label when not loading", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        expect(screen.getByText(/Test ID:/)).toBeInTheDocument();
    });

    it("hides model/test details when loading", () => {
        renderWithProviders(
            <ResultDetailHeader {...defaultProps} loading={true} />
        );
        expect(screen.queryByText(mockModel.name)).not.toBeInTheDocument();
        expect(screen.queryByText(mockTest.name)).not.toBeInTheDocument();
    });

    it("still displays result ID when loading", () => {
        renderWithProviders(
            <ResultDetailHeader {...defaultProps} loading={true} />
        );
        expect(
            screen.getByText(mockResultExtended.id)
        ).toBeInTheDocument();
    });

    it("displays Alias labels for model and test", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        const aliasLabels = screen.getAllByText(/Alias:/);
        expect(aliasLabels.length).toBe(2);
    });

    it("displays Version labels for model and test", () => {
        renderWithProviders(<ResultDetailHeader {...defaultProps} />);
        const versionLabels = screen.getAllByText(/Version:/);
        expect(versionLabels.length).toBe(2);
    });
});
