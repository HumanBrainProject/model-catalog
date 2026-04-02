import React from "react";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import { createMockDatastore } from "./helpers/mockDatastore";
import { mockModel, mockComment } from "./helpers/fixtures";
import DiscussionPanel from "../DiscussionPanel";

vi.mock("../datastore", () => ({
    datastore: createMockDatastore({
        getComments: vi.fn().mockResolvedValue([]),
    }),
}));

describe("DiscussionPanel", () => {
    const defaultProps = {
        id: mockModel.id,
        emptyMessage: "No comments yet. Be the first to comment!",
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders without crashing", () => {
        renderWithProviders(<DiscussionPanel {...defaultProps} />);
    });

    it("displays empty message when no comments", async () => {
        renderWithProviders(<DiscussionPanel {...defaultProps} />);
        expect(
            await screen.findByText(defaultProps.emptyMessage)
        ).toBeInTheDocument();
    });

    it("displays 'Add a comment' heading", () => {
        renderWithProviders(<DiscussionPanel {...defaultProps} />);
        expect(screen.getByText("Add a comment")).toBeInTheDocument();
    });

    it("displays Save draft and Submit comment buttons", () => {
        renderWithProviders(<DiscussionPanel {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /save draft/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: /submit comment/i })
        ).toBeInTheDocument();
    });

    it("displays Cancel button", () => {
        renderWithProviders(<DiscussionPanel {...defaultProps} />);
        expect(
            screen.getByRole("button", { name: /cancel/i })
        ).toBeInTheDocument();
    });

    it("renders comments when they exist", async () => {
        const { datastore } = await import("../datastore");
        datastore.getComments.mockResolvedValue([mockComment]);

        renderWithProviders(<DiscussionPanel {...defaultProps} />);
        expect(
            await screen.findByText(mockComment.content)
        ).toBeInTheDocument();
    });
});
