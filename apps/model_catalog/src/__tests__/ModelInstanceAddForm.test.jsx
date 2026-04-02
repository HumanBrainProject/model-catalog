import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockVocab, mockAuth } from "./helpers/fixtures";
import ModelInstanceAddForm from "../ModelInstanceAddForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("ModelInstanceAddForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        modelID: "95866c59-26d2-4d84-b1aa-95e1f9cf53bd",
        modelScope: "network",
    };

    const contextOverrides = {
        auth: [mockAuth, vi.fn()],
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the dialog with title", () => {
        renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Add a new model instance")).toBeInTheDocument();
    });

    it("renders Cancel and Add Model Version buttons", () => {
        renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Model Version" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<ModelInstanceAddForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Add a new model instance")).not.toBeInTheDocument();
    });

    it("renders instance form fields", () => {
        renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Code location (URL)").length).toBeGreaterThanOrEqual(1);
    });

    describe("handleSubmit", () => {
        it("shows error when version is not unique", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [{ id: "existing" }] });

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            // Set version through the sub-component chain
            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model instance 'version' has to be unique/)).toBeInTheDocument();
            });
        });

        it("calls createModelInstance on successful submission", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [] });
            const mockInstance = { id: "new-instance" };
            datastore.createModelInstance.mockResolvedValue(mockInstance);

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "2.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            await waitFor(() => {
                expect(datastore.createModelInstance).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(mockInstance);
            });
        });

        it("shows error when createModelInstance rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [] });
            datastore.createModelInstance.mockRejectedValue({
                response: "Instance creation failed",
            });

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "2.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Instance creation failed/)).toBeInTheDocument();
            });
        });

        it("submits with empty version when no version is entered (version becomes null after replaceEmptyStringsWithNull)", async () => {
            const { datastore } = await import("../datastore");
            // With default mock, getModelInstanceFromVersion returns { data: [] } (unique)
            datastore.createModelInstance.mockResolvedValue({ id: "new" });

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            // Since replaceEmptyStringsWithNull converts "" -> null, the version check
            // (payload.version === "") is false, so it proceeds to uniqueness check and then submits
            await waitFor(() => {
                expect(datastore.createModelInstance).toHaveBeenCalled();
            });
        });
    });

    describe("createPayload", () => {
        it("includes model_id in the payload", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [] });
            datastore.createModelInstance.mockResolvedValue({});

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            await waitFor(() => {
                expect(datastore.createModelInstance).toHaveBeenCalled();
                const payload = datastore.createModelInstance.mock.calls[0][1];
                expect(payload.model_id).toBe(defaultProps.modelID);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog when there is a submission error and can close it", async () => {
            const { datastore } = await import("../datastore");
            datastore.getModelInstanceFromVersion.mockResolvedValue({ data: [{ id: "existing" }] });

            renderWithContext(<ModelInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Model Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Model instance 'version' has to be unique/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByText(/Model instance 'version' has to be unique/)).not.toBeInTheDocument();
            });
        });
    });
});
