import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModelInstance, mockVocab, mockAuth } from "./helpers/fixtures";
import ModelInstanceEditForm from "../ModelInstanceEditForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("ModelInstanceEditForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        modelID: mockModelInstance.model_id,
        modelScope: "network",
        instance: {
            id: mockModelInstance.id,
            version: mockModelInstance.version,
            description: mockModelInstance.description,
            parameters: mockModelInstance.parameters,
            morphology: mockModelInstance.morphology || "",
            source: mockModelInstance.source,
            code_format: mockModelInstance.code_format,
            license: mockModelInstance.license,
            hash: mockModelInstance.hash || "",
            timestamp: mockModelInstance.timestamp,
            uri: mockModelInstance.uri,
        },
    };

    const contextOverrides = {
        auth: [mockAuth, vi.fn()],
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the dialog with title", () => {
        renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Edit an existing model instance")).toBeInTheDocument();
    });

    it("renders Cancel and Save changes buttons", () => {
        renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<ModelInstanceEditForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Edit an existing model instance")).not.toBeInTheDocument();
    });

    it("renders instance form fields", () => {
        renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Code location (URL)").length).toBeGreaterThanOrEqual(1);
    });

    describe("handleSubmit", () => {
        it("calls updateModelInstance when version unchanged (no uniqueness check needed)", async () => {
            const { datastore } = await import("../datastore");
            const updatedInstance = { id: mockModelInstance.id };
            datastore.updateModelInstance.mockResolvedValue(updatedInstance);

            renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateModelInstance).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(updatedInstance);
            });
        });

        it("shows error when version is changed to a non-unique value", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [{ id: "other" }] });

            renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);

            // Change version via the sub-form
            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "99.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model instance 'version' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when updateModelInstance rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateModelInstance.mockRejectedValue({
                response: "Update failed",
            });

            renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Update failed/)).toBeInTheDocument();
            });
        });
    });

    describe("createPayload", () => {
        it("includes instance fields from state in the payload", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateModelInstance.mockResolvedValue({});

            renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateModelInstance).toHaveBeenCalled();
                const payload = datastore.updateModelInstance.mock.calls[0][1];
                expect(payload.version).toBe(mockModelInstance.version);
                expect(payload.id).toBe(mockModelInstance.id);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog and can close it", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateModelInstance.mockRejectedValue({
                response: "Error occurred",
            });

            renderWithContext(<ModelInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Error occurred/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByText(/Error occurred/)).not.toBeInTheDocument();
            });
        });
    });
});
