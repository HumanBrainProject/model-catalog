import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import ErrorDialog from "../ErrorDialog";

describe("ErrorDialog", () => {
    const defaultProps = {
        open: true,
        error: "Something went wrong",
        handleErrorDialogClose: vi.fn(),
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders the error title", () => {
        renderWithProviders(<ErrorDialog {...defaultProps} />);
        expect(screen.getByText("There seems to be a problem...")).toBeInTheDocument();
    });

    it("displays the error message string", () => {
        renderWithProviders(<ErrorDialog {...defaultProps} />);
        expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });

    it("displays an additional message when provided", () => {
        renderWithProviders(
            <ErrorDialog {...defaultProps} additionalMessage="Try again later" />
        );
        expect(screen.getByText("Try again later")).toBeInTheDocument();
    });

    it("calls handleErrorDialogClose when Close button is clicked", () => {
        renderWithProviders(<ErrorDialog {...defaultProps} />);
        fireEvent.click(screen.getByRole("button", { name: /close/i }));
        expect(defaultProps.handleErrorDialogClose).toHaveBeenCalledTimes(1);
    });

    it("does not show a Login button by default", () => {
        renderWithProviders(<ErrorDialog {...defaultProps} />);
        expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
    });

    it("shows a Login button when showLoginButton is true", () => {
        renderWithProviders(
            <ErrorDialog {...defaultProps} showLoginButton={true} redirectUri="/" />
        );
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("does not render dialog when open is false", () => {
        renderWithProviders(<ErrorDialog {...defaultProps} open={false} />);
        expect(screen.queryByText("There seems to be a problem...")).not.toBeInTheDocument();
    });

    it("handles multi-line error messages", () => {
        renderWithProviders(
            <ErrorDialog {...defaultProps} error={"Line one\nLine two"} />
        );
        // addLineBreaks splits on \n and renders each part with a <br>
        expect(screen.getByText(/Line one/)).toBeInTheDocument();
        expect(screen.getByText(/Line two/)).toBeInTheDocument();
    });
});
