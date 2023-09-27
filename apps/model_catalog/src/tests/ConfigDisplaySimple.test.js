import React from "react";
import { render, screen } from "@testing-library/react";
import ConfigDisplaySimple from "../components/layout/ConfigDisplaySimple";

describe("ConfigDisplaySimple", () => {
  test("should render without errors with different display prop", () => {
    const filters = {
      species: ["Human"],
      brain_region: ["Frontal Lobe"],
    };

    render(<ConfigDisplaySimple display="Only Models" filters={filters} />);
    const brightness5Icon = screen.getByTestId("Brightness5Icon");
    expect(brightness5Icon).toBeInTheDocument();

    render(<ConfigDisplaySimple display="Only Tests" filters={filters} />);
    const brokenImageIcon = screen.getByTestId("BrokenImageIcon");
    expect(brokenImageIcon).toBeInTheDocument();
  });

  test("should render without errors with empty filters", () => {
    const filters = {};

    render(<ConfigDisplaySimple display="All" filters={filters} />);
    const icons = [
      "EmojiNatureIcon",
      "RoomIcon",
      "Brightness5Icon",
      "PhotoSizeSelectLargeIcon",
      "ImageSearchIcon",
      "BrokenImageIcon",
      "AssessmentIcon",
      "MicIcon",
      "DonutLargeIcon",
      "PeopleIcon",
    ];

    icons.forEach((icon) => {
      const renderedIcon = screen.getByTestId(icon);
      expect(renderedIcon).toBeInTheDocument();
    });
  });

  test("should render without errors with no display prop", () => {
    const filters = {
      species: ["Human"],
      brain_region: ["Frontal Lobe"],
    };

    render(<ConfigDisplaySimple filters={filters} />);
    const icons = [
      "EmojiNatureIcon",
      "RoomIcon",
      "Brightness5Icon",
      "PhotoSizeSelectLargeIcon",
      "ImageSearchIcon",
      "BrokenImageIcon",
      "AssessmentIcon",
      "MicIcon",
      "DonutLargeIcon",
      "PeopleIcon",
    ];

    icons.forEach((icon) => {
      const renderedIcon = screen.getByTestId(icon);
      expect(renderedIcon).toBeInTheDocument();
    });
  });
});
