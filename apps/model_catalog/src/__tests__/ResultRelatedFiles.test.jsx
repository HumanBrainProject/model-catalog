import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockResultFile } from "./helpers/fixtures";
import ResultRelatedFiles from "../ResultRelatedFiles";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore(),
}));

describe("ResultRelatedFiles (smoke test)", () => {
    it("renders without crashing with result files", () => {
        renderWithProviders(
            <ResultRelatedFiles result_files={[mockResultFile]} />
        );
    });

    it("displays files header when files exist", () => {
        renderWithProviders(
            <ResultRelatedFiles result_files={[mockResultFile]} />
        );
        expect(
            screen.getByText(
                /File\(s\) generated during the validation process/
            )
        ).toBeInTheDocument();
    });

    it("displays no files message when result_files is empty", () => {
        renderWithProviders(<ResultRelatedFiles result_files={[]} />);
        expect(
            screen.getByText(
                /No files were generated during the validation process/
            )
        ).toBeInTheDocument();
    });

    it("displays Loading when result_files is null/undefined", () => {
        renderWithProviders(
            <ResultRelatedFiles result_files={null} />
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("displays file name extracted from URL", async () => {
        renderWithProviders(
            <ResultRelatedFiles result_files={[mockResultFile]} />
        );
        // The filename is extracted from download_url: "validation_result_20240115"
        await waitFor(() => {
            expect(
                screen.getAllByText(/validation_result_20240115/).length
            ).toBeGreaterThan(0);
        });
    });

    it("renders multiple files", async () => {
        const file2 = {
            ...mockResultFile,
            download_url: "https://example.com/another_result_file",
            size: 2048,
        };
        renderWithProviders(
            <ResultRelatedFiles result_files={[mockResultFile, file2]} />
        );
        await waitFor(() => {
            expect(
                screen.getAllByText(/validation_result_20240115/).length
            ).toBeGreaterThan(0);
            expect(
                screen.getAllByText(/another_result_file/).length
            ).toBeGreaterThan(0);
        });
    });

    it("shows file index numbers", async () => {
        renderWithProviders(
            <ResultRelatedFiles result_files={[mockResultFile]} />
        );
        await waitFor(() => {
            expect(screen.getByText(/1\)/)).toBeInTheDocument();
        });
    });
});
