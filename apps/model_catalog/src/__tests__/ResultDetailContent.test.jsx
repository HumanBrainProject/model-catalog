import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { mockResult } from "./helpers/fixtures";
import ResultDetailContent from "../ResultDetailContent";

describe("ResultDetailContent", () => {
    const defaultProps = {
        score: mockResult.score,
        normalized_score: mockResult.normalized_score,
        timestamp: mockResult.timestamp,
        project_id: mockResult.project_id,
        passed: mockResult.passed,
        uri: mockResult.uri,
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
    });

    it("displays the Score label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("Score:")).toBeInTheDocument();
    });

    it("displays the Normalized Score label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("Normalized Score:")).toBeInTheDocument();
    });

    it("displays the score value", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(
            screen.getByText(String(mockResult.score))
        ).toBeInTheDocument();
    });

    it("displays the TimeStamp label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("TimeStamp:")).toBeInTheDocument();
    });

    it("displays the Collab ID label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("Collab ID:")).toBeInTheDocument();
    });

    it("displays the Pass / Fail label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("Pass / Fail:")).toBeInTheDocument();
    });

    it("displays the KG URI label", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText("KG URI:")).toBeInTheDocument();
    });

    it("displays the normalized score value", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(
            screen.getByText(String(mockResult.normalized_score))
        ).toBeInTheDocument();
    });

    it("displays the project ID value", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(
            screen.getByText(mockResult.project_id)
        ).toBeInTheDocument();
    });

    it("displays the URI value", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        expect(screen.getByText(mockResult.uri)).toBeInTheDocument();
    });

    it("renders the Pass / Fail section when passed is true", () => {
        renderWithProviders(<ResultDetailContent {...defaultProps} />);
        // passed=true is a non-null boolean, so the label renders
        expect(screen.getByText("Pass / Fail:")).toBeInTheDocument();
    });

    it("renders without crashing when score is null", () => {
        // When value is null, ResultParameter returns empty div
        renderWithProviders(
            <ResultDetailContent {...defaultProps} score={null} />
        );
        // The component should still render without error
        expect(screen.getByText("Normalized Score:")).toBeInTheDocument();
    });

    it("renders without crashing when normalized_score is null", () => {
        renderWithProviders(
            <ResultDetailContent
                {...defaultProps}
                normalized_score={null}
            />
        );
        expect(screen.getByText("Score:")).toBeInTheDocument();
    });

    it("renders without crashing when URI is null", () => {
        renderWithProviders(
            <ResultDetailContent {...defaultProps} uri={null} />
        );
        expect(screen.getByText("Score:")).toBeInTheDocument();
    });

    it("renders Pass / Fail section when passed is false", () => {
        renderWithProviders(
            <ResultDetailContent {...defaultProps} passed={false} />
        );
        // passed=false is still a non-null value, so label renders
        expect(screen.getByText("Pass / Fail:")).toBeInTheDocument();
    });
});
