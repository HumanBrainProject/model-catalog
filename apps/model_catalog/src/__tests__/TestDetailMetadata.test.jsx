import React from "react";
import { render, screen } from "@testing-library/react";
import { mockTest } from "./helpers/fixtures";
import TestDetailMetadata from "../TestDetailMetadata";

describe("TestDetailMetadata", () => {
    const defaultProps = {
        species: mockTest.species,
        brainRegion: mockTest.brain_region,
        cellType: mockTest.cell_type,
        recording_modality: mockTest.recording_modality,
        dataType: mockTest.data_type,
        testType: mockTest.test_type,
        scoreType: mockTest.score_type,
    };

    it("renders without crashing", () => {
        render(<TestDetailMetadata {...defaultProps} />);
    });

    it("displays species", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.species)).toBeInTheDocument();
        expect(screen.getByText("Species")).toBeInTheDocument();
    });

    it("displays brain region", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.brain_region)).toBeInTheDocument();
        expect(screen.getByText("Brain region")).toBeInTheDocument();
    });

    it("displays cell type", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.cell_type)).toBeInTheDocument();
    });

    it("displays recording modality", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(
            screen.getByText(mockTest.recording_modality)
        ).toBeInTheDocument();
    });

    it("displays data type", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.data_type)).toBeInTheDocument();
    });

    it("displays test type", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.test_type)).toBeInTheDocument();
    });

    it("displays score type", () => {
        render(<TestDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockTest.score_type)).toBeInTheDocument();
    });

    it("renders empty when all values are falsy", () => {
        render(
            <TestDetailMetadata
                species={null}
                brainRegion={null}
                cellType={null}
                recording_modality={null}
                dataType={null}
                testType={null}
                scoreType={null}
            />
        );
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
});
