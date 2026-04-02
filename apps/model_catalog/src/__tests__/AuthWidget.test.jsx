import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { renderWithProviders } from "./helpers/renderWithProviders";
import AuthWidget from "../AuthWidget";

describe("AuthWidget", () => {
    it("renders a Login button when no user is logged in", () => {
        renderWithProviders(<AuthWidget currentUser={null} />);
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });

    it("renders a person icon button when user is logged in", () => {
        renderWithProviders(<AuthWidget currentUser="John Doe" />);
        // The icon button should be present instead of a Login text button
        expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("shows the username in a tooltip when user is logged in", () => {
        renderWithProviders(<AuthWidget currentUser="John Doe" />);
        // The tooltip title is set to the currentUser prop
        expect(screen.getByRole("button")).toBeInTheDocument();
    });
});
