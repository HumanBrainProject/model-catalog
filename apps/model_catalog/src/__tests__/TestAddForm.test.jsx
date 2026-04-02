import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockVocab, mockAuth } from "./helpers/fixtures";
import TestAddForm from "../TestAddForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("TestAddForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
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
        renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Add a new test to the library")).toBeInTheDocument();
    });

    it("renders key form fields", () => {
        renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Test Name").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Test alias/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Description").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Data Location (URL)").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Cancel and Add Test buttons", () => {
        renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Test" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<TestAddForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Add a new test to the library")).not.toBeInTheDocument();
    });

    it("renders with duplicate data when provided", () => {
        const duplicateData = {
            name: "Duplicate Test",
            alias: "dup-test",
            author: [],
            project_id: "",
            description: "A duplicated test",
            data_location: [],
            species: "",
            brain_region: "",
            cell_type: "",
            test_type: "",
            score_type: "",
            recording_modality: "",
            instances: [{ version: "1.0", repository: "", path: "", description: "", parameters: null }],
        };
        renderWithContext(<TestAddForm {...defaultProps} duplicateData={duplicateData} />, contextOverrides);
        expect(screen.getByText("Add a new test to the library")).toBeInTheDocument();
    });

    describe("handleSubmit", () => {
        it("calls createTest on successful submission with a name", async () => {
            const { datastore } = await import("../datastore");
            const mockTest = { id: "new-id", name: "Test Test" };
            datastore.createTest.mockResolvedValue(mockTest);

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test Test" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(datastore.createTest).toHaveBeenCalled();
            });
        });

        it("shows error when name is empty and submit is clicked", async () => {
            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test 'name' cannot be empty/)).toBeInTheDocument();
            });
        });

        it("shows error when alias is not unique", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockResolvedValue(false);

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test" } });
            fireEvent.blur(nameInput);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "taken-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.testAliasIsUnique).toHaveBeenCalledWith("taken-alias", expect.anything());
            });

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test 'alias' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when createTest rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.createTest.mockRejectedValue({
                response: "Server error occurred",
            });

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Server error occurred/)).toBeInTheDocument();
            });
        });

        it("creates payload without instances when instance fields are empty", async () => {
            const { datastore } = await import("../datastore");
            datastore.createTest.mockResolvedValue({ id: "new" });

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(datastore.createTest).toHaveBeenCalled();
                const payload = datastore.createTest.mock.calls[0][0];
                // When all instance fields are empty, instances should be []
                expect(payload.instances).toEqual([]);
            });
        });
    });

    describe("handleFieldChange", () => {
        it("triggers alias uniqueness check when alias field changes", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockResolvedValue(true);

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "my-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.testAliasIsUnique).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/Great! This alias is unique/)).toBeInTheDocument();
            });
        });

        it("parses data_location as comma-separated list", async () => {
            const { datastore } = await import("../datastore");
            datastore.createTest.mockResolvedValue({ id: "new" });

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test" } });
            fireEvent.blur(nameInput);

            const dataLocInput = document.querySelector('textarea[name="data_location"]');
            fireEvent.change(dataLocInput, { target: { value: "https://example.com/a.csv, https://example.com/b.csv" } });
            fireEvent.blur(dataLocInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(datastore.createTest).toHaveBeenCalled();
                const payload = datastore.createTest.mock.calls[0][0];
                expect(payload.data_location).toEqual([
                    "https://example.com/a.csv",
                    "https://example.com/b.csv",
                ]);
            });
        });
    });

    describe("checkAliasUnique", () => {
        it("does not call testAliasIsUnique when alias is empty", async () => {
            const { datastore } = await import("../datastore");
            datastore.testAliasIsUnique.mockClear();

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "" } });
            fireEvent.blur(aliasInput);

            expect(datastore.testAliasIsUnique).not.toHaveBeenCalled();
        });
    });

    describe("createPayload", () => {
        it("uses default author when none provided", async () => {
            const { datastore } = await import("../datastore");
            datastore.createTest.mockResolvedValue({ id: "new" });

            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "New Test" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
            });

            await waitFor(() => {
                expect(datastore.createTest).toHaveBeenCalled();
                const payload = datastore.createTest.mock.calls[0][0];
                expect(payload.author).toEqual([{ given_name: null, family_name: null }]);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog when there is an error and can close it", async () => {
            renderWithContext(<TestAddForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test" }));
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
