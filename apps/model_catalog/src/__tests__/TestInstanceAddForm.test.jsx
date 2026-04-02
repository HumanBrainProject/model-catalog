import React from "react";
import { screen, fireEvent, waitFor, act } from "@testing-library/react";
import { renderWithContext } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockVocab, mockAuth } from "./helpers/fixtures";
import TestInstanceAddForm from "../TestInstanceAddForm";

vi.mock("../datastore", () => ({ datastore: createMockDatastore() }));

describe("TestInstanceAddForm", () => {
    const defaultProps = {
        open: true,
        onClose: vi.fn(),
        testID: "d4e5f6a7-b8c9-0123-defa-234567890123",
    };

    const contextOverrides = {
        auth: [mockAuth, vi.fn()],
        validFilterValues: [mockVocab, vi.fn()],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the dialog with title", () => {
        renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByText("Add a new test instance")).toBeInTheDocument();
    });

    it("renders Cancel and Add Test Version buttons", () => {
        renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Add Test Version" })).toBeInTheDocument();
    });

    it("calls onClose when Cancel is clicked", () => {
        renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);
        fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("does not render when open is false", () => {
        renderWithContext(<TestInstanceAddForm {...defaultProps} open={false} />, contextOverrides);
        expect(screen.queryByText("Add a new test instance")).not.toBeInTheDocument();
    });

    it("renders instance form fields", () => {
        renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);
        expect(screen.getAllByText("Version").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("Repository (URL)").length).toBeGreaterThanOrEqual(1);
        expect(screen.getAllByText("path").length).toBeGreaterThanOrEqual(1);
    });

    describe("handleSubmit", () => {
        it("shows error when version is not unique", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [{ id: "existing" }] });

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test instance 'version' has to be unique/)).toBeInTheDocument();
            });
        });

        it("calls createTestInstance on successful submission", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [] });
            const mockInstance = { id: "new-instance" };
            datastore.createTestInstance.mockResolvedValue(mockInstance);

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "2.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(datastore.createTestInstance).toHaveBeenCalled();
                expect(defaultProps.onClose).toHaveBeenCalledWith(mockInstance);
            });
        });

        it("shows error when createTestInstance rejects", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [] });
            datastore.createTestInstance.mockRejectedValue({
                response: "Instance creation failed",
            });

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "2.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Instance creation failed/)).toBeInTheDocument();
            });
        });

        it("submits with null version when no version is entered", async () => {
            const { datastore } = await import("../datastore");
            datastore.createTestInstance.mockResolvedValue({ id: "new" });

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(datastore.createTestInstance).toHaveBeenCalled();
            });
        });
    });

    describe("createPayload", () => {
        it("includes test_id in the payload", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [] });
            datastore.createTestInstance.mockResolvedValue({});

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(datastore.createTestInstance).toHaveBeenCalled();
                const payload = datastore.createTestInstance.mock.calls[0][1];
                expect(payload.test_id).toBe(defaultProps.testID);
            });
        });
    });

    describe("error dialog", () => {
        it("renders ErrorDialog when there is a submission error and can close it", async () => {
            const { datastore } = await import("../datastore");
            datastore.getTestInstanceFromVersion.mockResolvedValue({ data: [{ id: "existing" }] });

            renderWithContext(<TestInstanceAddForm {...defaultProps} />, contextOverrides);

            const versionInput = document.querySelector('input[name="version"]');
            fireEvent.change(versionInput, { target: { value: "1.0" } });
            fireEvent.blur(versionInput);

            await act(async () => {
                fireEvent.click(screen.getByRole("button", { name: "Add Test Version" }));
            });

            await waitFor(() => {
                expect(screen.getByText(/Test instance 'version' has to be unique/)).toBeInTheDocument();
            });

            fireEvent.click(screen.getByRole("button", { name: "Close" }));

            await waitFor(() => {
                expect(screen.queryByText(/Test instance 'version' has to be unique/)).not.toBeInTheDocument();
            });
        });
    });
});
