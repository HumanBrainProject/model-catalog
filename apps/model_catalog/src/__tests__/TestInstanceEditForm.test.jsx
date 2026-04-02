import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockTestInstance, mockVocab, mockAuth } from "./helpers/fixtures";
import TestInstanceEditForm from "../TestInstanceEditForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("TestInstanceEditForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        testID: mockTestInstance.test_id,
        instance: {
            id: mockTestInstance.id,
            version: mockTestInstance.version,
            repository: mockTestInstance.repository,
            path: mockTestInstance.path,
            description: mockTestInstance.description,
            parameters: mockTestInstance.parameters || "",
            uri: mockTestInstance.uri,
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
        renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Edit an existing test instance")).toBeInTheDocument();
    });

    it("renders Cancel and Save changes buttons", () => {
        renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Save changes" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<TestInstanceEditForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Edit an existing test instance")).not.toBeInTheDocument();
    });

    it("renders instance form fields", () => {
        renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Repository (URL)").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("path").length).toBeGreaterThanOrEqual(1);
    });

    describe("handleSubmit", () => {
        it("calls updateTestInstance when version is unchanged", async () => {
            const { datastore } = await import("../datastore");
            const updatedInstance = { id: mockTestInstance.id };
            datastore.updateTestInstance.mockResolvedValue(updatedInstance);

            renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateTestInstance).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(updatedInstance);
            });
        });

        it("shows error when version is changed to a non-unique value", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [{ id: "other" }] });

            renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);

            // Change version via the sub-form
            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "99.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test instance 'version' has to be unique/)).toBeInTheDocument();
            });
        });

        it("shows error when updateTestInstance rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateTestInstance.mockRejectedValue({
                response: "Update failed",
            });

            renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);

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
            datastore.updateTestInstance.mockResolvedValue({});

            renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
            });

            await waitFor(() => {
                expect(datastore.updateTestInstance).toHaveBeenCalled();
                const payload = datastore.updateTestInstance.mock.calls[0][1];
                expect(payload.version).toBe(mockTestInstance.version);
                expect(payload.id).toBe(mockTestInstance.id);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog and can close it", async () => {
            const { datastore } = await import("../datastore");
            datastore.updateTestInstance.mockRejectedValue({
                response: "Error occurred",
            });

            renderWithContext(<TestInstanceEditForm {...defaultProps} />, contextOverrides);

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
