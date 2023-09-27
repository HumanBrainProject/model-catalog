import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorDialog from "../components/layout/ErrorDialog";

// Mock ContextMain module with mock values for auth
import { ContextMainProvider } from "../ContextMain";

const renderWithProviders = (component, authValue = {}) => {
  return render(
    <ContextMainProvider>
      {component}
    </ContextMainProvider>
  );
};

describe("ErrorDialog", () => {
  test("should render without errors with string error message", () => {
    renderWithProviders(
      <ErrorDialog
        open={true}
        handleErrorDialogClose={() => {}}
        error="An error occurred."
      />
    );

    const errorMessage = screen.getByText("An error occurred.");
    expect(errorMessage).toBeInTheDocument();
  });

  test("should render without errors with object error message", () => {
    const errorObject = {
      message: "An error occurred.",
      details: "This is a detailed error message.",
    };

    renderWithProviders(
      <ErrorDialog
        open={true}
        handleErrorDialogClose={() => {}}
        error={errorObject}
      />
    );

    const errorMessage = screen.getByText("An error occurred.");
    expect(errorMessage).toBeInTheDocument();

    const detailsMessage = screen.getByText("This is a detailed error message.");
    expect(detailsMessage).toBeInTheDocument();
  });

  test("should render additional message", () => {
    renderWithProviders(
      <ErrorDialog
        open={true}
        handleErrorDialogClose={() => {}}
        error="An error occurred."
        additionalMessage="Please try again later."
      />
    );

    const additionalMessage = screen.getByText("Please try again later.");
    expect(additionalMessage).toBeInTheDocument();
  });

  test("should call handleErrorDialogClose when Close button is clicked", () => {
    const handleCloseMock = jest.fn();

    renderWithProviders(
      <ErrorDialog
        open={true}
        handleErrorDialogClose={handleCloseMock}
        error="An error occurred."
      />
    );

    const closeButton = screen.getByText("Close");
    fireEvent.click(closeButton);

    expect(handleCloseMock).toHaveBeenCalled();
  });

  test("should render Login button when showLoginButton is true", () => {
    renderWithProviders(
      <ErrorDialog
        open={true}
        handleErrorDialogClose={() => {}}
        error="An error occurred."
        showLoginButton={true}
      />,
      {
        auth: {
          login: () => {},
        },
      }
    );

    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();
  });
});
