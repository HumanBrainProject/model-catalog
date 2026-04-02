import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockVocab, mockAuth } from "./helpers/fixtures";
import ModelAddForm from "../ModelAddForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("ModelAddForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
    };

    const emptyFilters = {
        species: [],
        brain_region: [],
        cell_type: [],
        model_scope: [],
        abstraction_level: [],
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
        renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Add a new model to the catalog")).toBeInTheDocument();
    });

    it("renders key form fields", () => {
        renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Model Name").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Model alias/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Organization").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Description").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Cancel and Add Model buttons", () => {
        renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Model" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<ModelAddForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Add a new model to the catalog")).not.toBeInTheDocument();
    });

    it("renders with duplicate data when provided", () => {
        const duplicateData = {
            name: "Duplicate Model",
            alias: "dup-model",
            author: [],
            owner: [],
            project_id: "",
            description: "A duplicated model",
            species: "",
            brain_region: "",
            cell_type: "",
            model_scope: "",
            abstraction_level: "",
            organization: "",
            instances: [{ version: "1.0", description: "", parameters: null, morphology: "", source: "", code_format: "", license: "" }],
        };
        renderWithContext(<ModelAddForm {...defaultProps} duplicateData={duplicateData} />, contextOverrides);
        expect(screen.getByText("Add a new model to the catalog")).toBeInTheDocument();
    });

    describe("handleSubmit", () => {
        it("calls createModel on successful submission with a name", async () => {
            const { datastore } = await import("../datastore");
            const mockModel = { id: "new-id", name: "Test Model" };
            datastore.createModel.mockResolvedValue(mockModel);

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            // Set the name field via input[name="name"]
            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test Model" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(datastore.createModel).toHaveBeenCalled();
            });
        });

        it("shows error when name is empty and submit is clicked", async () => {
            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'name' cannot be empty/)).toBeInTheDocument();
            });
        });

        it("shows error when alias is not unique", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockResolvedValue(false);

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            // Set name
            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test Model" } });
            fireEvent.blur(nameInput);

            // Set alias
            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "taken-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.modelAliasIsUnique).toHaveBeenCalledWith("taken-alias", expect.anything());
            });

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'alias' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when createModel rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.createModel.mockRejectedValue({
                response: "Server error occurred",
            });

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "Test Model" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Server error occurred/)).toBeInTheDocument();
            });
        });
    });

    describe("handleFieldChange", () => {
        it("triggers alias uniqueness check when alias field changes", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockResolvedValue(true);

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "my-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.modelAliasIsUnique).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/Great! This alias is unique/)).toBeInTheDocument();
            });
        });

        it("shows alias not unique message when alias already exists", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockResolvedValue(false);

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "existing-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(screen.getByText(/This alias aready exists/)).toBeInTheDocument();
            });
        });
    });

    describe("checkAliasUnique", () => {
        it("does not call modelAliasIsUnique when alias is empty", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockClear();

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "" } });
            fireEvent.blur(aliasInput);

            // With empty alias, modelAliasIsUnique should not be called
            expect(datastore.modelAliasIsUnique).not.toHaveBeenCalled();
            // The helper text should be the default optional message
            expect(screen.getByText(/Please choose a short name/)).toBeInTheDocument();
        });
    });

    describe("createPayload", () => {
        it("uses default author/owner when none provided", async () => {
            const { datastore } = await import("../datastore");
            datastore.createModel.mockResolvedValue({ id: "new" });

            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "New Model" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(datastore.createModel).toHaveBeenCalled();
                const payload = datastore.createModel.mock.calls[0][0];
                // When no author/owner is provided, it defaults to empty name object
                // replaceEmptyStringsWithNull converts "" to null
                expect(payload.author).toEqual([{ given_name: null, family_name: null }]);
                expect(payload.owner).toEqual([{ given_name: null, family_name: null }]);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog when there is an error and can close it", async () => {
            renderWithContext(<ModelAddForm {...defaultProps} />, contextOverrides);

            // Trigger error by submitting without name
            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'name' cannot be empty/)).toBeInTheDocument();
            });

            // Close error dialog
            const closeButton = screen.getByRole("button", { name: /close/i });
            fireEvent.click(closeButton);

            await waitFor(() => {
                expect(screen.queryByText(/Model 'name' cannot be empty/)).not.toBeInTheDocument();
            });
        });
    });
});
