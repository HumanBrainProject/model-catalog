import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTest, mockVocab, mockAuth } from "./helpers/fixtures";
import TestEditForm from "../TestEditForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("TestEditForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        testData: {
            id: mockTest.id,
            uri: mockTest.uri,
            name: mockTest.name,
            alias: mockTest.alias,
            author: mockTest.author,
            project_id: mockTest.project_id,
            description: mockTest.description,
            data_location: mockTest.data_location,
            species: mockTest.species,
            brain_region: mockTest.brain_region,
            cell_type: mockTest.cell_type,
            test_type: mockTest.test_type,
            score_type: mockTest.score_type,
            recording_modality: mockTest.recording_modality,
        },
    };

    const emptyFilters = {
        species: [],
        brain_region: [],
        cell_type: [],
        test_type: [],
        score_type: [],
        recording_modality: [],
        implementation_status: [],
    };

    const contextOverrides = {
        auth: [mockAuth, vi.fn()],
        validFilterValues: [mockVocab, vi.fn()],
        filters: [emptyFilters, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the dialog with title", () => {
        renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Edit an existing test in the library")).toBeInTheDocument();
    });

    it("renders key form fields", () => {
        renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Test Name").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Test alias/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Description").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Data Location (URL)").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Cancel and Save changes buttons", () => {
        renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<TestEditForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Edit an existing test in the library")).not.toBeInTheDocument();
    });

    describe("handleSubmit", () => {
        it("calls updateTest on successful submission", async () => {
            const { datastore } = await import("../datastore");
            const updatedTest = { id: mockTest.id, name: "Updated" };
            datastore.updateTest.mockResolvedValue(updatedTest);

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateTest).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(updatedTest);
            });
        });

        it("shows error when name is cleared and submit is clicked", async () => {
            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test 'name' cannot be empty/)).toBeInTheDocument();
            });
        });

        it("shows error when alias is changed to a non-unique value", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockResolvedValue(false);

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "taken-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.testAliasIsUnique).toHaveBeenCalledWith("taken-alias", expect.anything());
            });

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test 'alias' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when updateTest rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateTest.mockRejectedValue({
                response: "Update failed",
            });

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Update failed/)).toBeInTheDocument();
            });
        });
    });

    describe("handleFieldChange", () => {
        it("triggers alias uniqueness check when alias changes to a new value", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockResolvedValue(true);

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "new-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.testAliasIsUnique).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/Great! This alias is unique/)).toBeInTheDocument();
            });
        });

        it("does not check uniqueness when alias is same as original", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockClear();

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: mockTest.alias } });
            fireEvent.blur(aliasInput);

            expect(datastore.testAliasIsUnique).not.toHaveBeenCalled();
        });

        it("parses data_location as comma-separated list", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateTest.mockResolvedValue({});

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const dataLocInput = document.querySelector('textarea[name="data_location"]');
            fireEvent.change(dataLocInput, { target: { value: "https://a.com, https://b.com" } });
            fireEvent.blur(dataLocInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateTest).toHaveBeenCalled();
                const payload = datastore.updateTest.mock.calls[0][0];
                expect(payload.data_location).toEqual(["https://a.com", "https://b.com"]);
            });
        });
    });

    describe("createPayload", () => {
        it("includes id and uri in the payload", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateTest.mockResolvedValue({});

            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateTest).toHaveBeenCalled();
                const payload = datastore.updateTest.mock.calls[0][0];
                expect(payload.id).toBe(mockTest.id);
                expect(payload.uri).toBe(mockTest.uri);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog and can close it", async () => {
            renderWithContext(<TestEditForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test 'name' cannot be empty/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByText(/Test 'name' cannot be empty/)).not.toBeInTheDocument();
            });
        });
    });
});
