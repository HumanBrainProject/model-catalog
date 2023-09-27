import React from "react";
import { render, screen } from "@testing-library/react";
import ModelDetail from "../components/models/ModelDetail";
import { ContextMainProvider } from "../ContextMain";

const renderWithProviders = (component, authValue = {}, compareModelsValue = {}, statusValue = "") => {
  return render(
    <ContextMainProvider>
      {component}
    </ContextMainProvider>
  );
};

describe("ModelDetail", () => {
  test("should render without errors", () => {
    renderWithProviders(
      <ModelDetail
        open={true}
        onClose={() => {}}
        modelData={{}}
      />,
      {
        auth: {},
        compareModels: [],
        status: "",
      }
    );

    const modelDetailTitle = screen.getByText("Model Detail");
    expect(modelDetailTitle).toBeInTheDocument();
  });

  test("should render model details correctly", () => {
    renderWithProviders(
      <ModelDetail
        open={true}
        onClose={() => {}}
        modelData={{}}
      />,
      {
        auth: {},
        compareModels: [],
        status: "",
      }
    );

    const modelName = screen.getByText("Model Name");
    const modelDescription = screen.getByText("Model Description");

    expect(modelName).toBeInTheDocument();
    expect(modelDescription).toBeInTheDocument();
  });
});
