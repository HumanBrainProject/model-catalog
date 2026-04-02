import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModel, mockVocab, mockAuth } from "./helpers/fixtures";
import ModelEditForm from "../ModelEditForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("ModelEditForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        modelData: {
            id: mockModel.id,
            uri: mockModel.uri,
            name: mockModel.name,
            alias: mockModel.alias,
            author: mockModel.author,
            owner: mockModel.owner,
            project_id: mockModel.project_id,
            description: mockModel.description,
            species: mockModel.species,
            brain_region: mockModel.brain_region,
            cell_type: mockModel.cell_type,
            model_scope: mockModel.model_scope,
            abstraction_level: mockModel.abstraction_level,
            organization: mockModel.organization,
        },
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
        renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Edit an existing model in the catalog")).toBeInTheDocument();
    });

    it("renders key form fields", () => {
        renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Model Name").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText(/Model alias/).length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Organization").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Description").length).toBeGreaterThanOrEqual(1);
    });

    it("renders Cancel and Save changes buttons", () => {
        renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<ModelEditForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Edit an existing model in the catalog")).not.toBeInTheDocument();
    });

    describe("handleSubmit", () => {
        it("calls updateModel on successful submission", async () => {
            const { datastore } = await import("../datastore");
            const updatedModel = { id: mockModel.id, name: "Updated" };
            datastore.updateModel.mockResolvedValue(updatedModel);

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateModel).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(updatedModel);
            });
        });

        it("shows error when name is cleared and submit is clicked", async () => {
            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            // Clear the name field
            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'name' cannot be empty/)).toBeInTheDocument();
            });
        });

        it("shows error when alias is changed to a non-unique value", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockResolvedValue(false);

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "taken-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.modelAliasIsUnique).toHaveBeenCalledWith("taken-alias", expect.anything());
            });

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'alias' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when updateModel rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateModel.mockRejectedValue({
                response: "Update failed",
            });

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

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
            datastore.modelAliasIsUnique.mockResolvedValue(true);

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "new-alias" } });
            fireEvent.blur(aliasInput);

            await waitFor(() => {
                expect(datastore.modelAliasIsUnique).toHaveBeenCalled();
            });

            await waitFor(() => {
                expect(screen.getByText(/Great! This alias is unique/)).toBeInTheDocument();
            });
        });

        it("does not check uniqueness when alias is same as original", async () => {
            const { datastore } = await import("../datastore");
            datastore.modelAliasIsUnique.mockClear();

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: mockModel.alias } });
            fireEvent.blur(aliasInput);

            // Should not call modelAliasIsUnique when alias matches original
            expect(datastore.modelAliasIsUnique).not.toHaveBeenCalled();
        });
    });

    describe("checkAliasUnique", () => {
        it("sets isAliasNotUnique when alias is empty", async () => {
            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            const aliasInput = document.querySelector('input[name="alias"]');
            fireEvent.change(aliasInput, { target: { value: "" } });
            fireEvent.blur(aliasInput);

            // With empty alias, should show default helper text
            expect(screen.getByText(/Please choose a short name/)).toBeInTheDocument();
        });
    });

    describe("createPayload", () => {
        it("includes id and uri in the payload", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateModel.mockResolvedValue({});

            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateModel).toHaveBeenCalled();
                const payload = datastore.updateModel.mock.calls[0][0];
                expect(payload.id).toBe(mockModel.id);
                expect(payload.uri).toBe(mockModel.uri);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog and can close it", async () => {
            renderWithContext(<ModelEditForm {...defaultProps} />, contextOverrides);

            // Clear name to trigger error
            const nameInput = document.querySelector('input[name="name"]');
            fireEvent.change(nameInput, { target: { value: "" } });
            fireEvent.blur(nameInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model 'name' cannot be empty/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByText(/Model 'name' cannot be empty/)).not.toBeInTheDocument();
            });
        });
    });
});
