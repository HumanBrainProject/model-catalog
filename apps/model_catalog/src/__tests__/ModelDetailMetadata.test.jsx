import React from "react";
import { render, screen } from "@testing-library/react";
import { mockModel } from "./helpers/fixtures";
import ModelDetailMetadata from "../ModelDetailMetadata";

describe("ModelDetailMetadata", () => {
    const defaultProps = {
        species: mockModel.species,
        brainRegion: mockModel.brain_region,
        cellType: mockModel.cell_type,
        modelScope: mockModel.model_scope,
        abstractionLevel: mockModel.abstraction_level,
        projectID: null,
        organization: mockModel.organization,
    };

    it("renders without crashing", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
    });

    it("displays species", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockModel.species)).toBeInTheDocument();
        expect(screen.getByText("Species")).toBeInTheDocument();
    });

    it("displays brain region", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockModel.brain_region)).toBeInTheDocument();
        expect(screen.getByText("Brain region")).toBeInTheDocument();
    });

    it("displays cell type", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockModel.cell_type)).toBeInTheDocument();
    });

    it("displays model scope", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockModel.model_scope)).toBeInTheDocument();
    });

    it("displays abstraction level", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(
            screen.getByText(mockModel.abstraction_level)
        ).toBeInTheDocument();
    });

    it("displays organization", () => {
        render(<ModelDetailMetadata {...defaultProps} />);
        expect(screen.getByText(mockModel.organization)).toBeInTheDocument();
    });

    it("displays Collab ID link when projectID is a non-numeric string", () => {
        render(
            <ModelDetailMetadata
                {...defaultProps}
                projectID="model-validation"
            />
        );
        expect(screen.getByText("model-validation")).toBeInTheDocument();
        expect(screen.getByText("Collab ID")).toBeInTheDocument();
    });

    it("shows migration message when projectID is numeric string", () => {
        render(
            <ModelDetailMetadata {...defaultProps} projectID="12345" />
        );
        expect(
            screen.getByText(/Model has been migrated from Collaboratory v1/)
        ).toBeInTheDocument();
    });

    it("renders empty when all values are falsy", () => {
        const { container } = render(
            <ModelDetailMetadata
                species={null}
                brainRegion={null}
                cellType={null}
                modelScope={null}
                abstractionLevel={null}
                projectID={null}
                organization={null}
            />
        );
        expect(screen.queryByRole("list")).not.toBeInTheDocument();
    });
});
