import React from "react";
import { screen, render } from "@testing-library/react";
import { mockModel } from "./helpers/fixtures";
import ModelResultOverview from "../ModelResultOverview";

vi.mock("../datastore", () => ({
    datastore: {
        getResult: vi.fn().mockResolvedValue({}),
    },
}));

describe("ModelResultOverview (smoke test)", () => {
    it("renders loading indicator when loadingResult is true", () => {
        render(
            <ModelResultOverview
                id={mockModel.id}
                modelJSON={mockModel}
                results={[]}
                loadingResult={true}
            />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders no results message when results are empty", () => {
        render(
            <ModelResultOverview
                id={mockModel.id}
                modelJSON={mockModel}
                results={[]}
                loadingResult={false}
            />
        );
        expect(
            screen.getByText(/No results have yet been registered/)
        ).toBeInTheDocument();
    });

    it("renders Loading... when results is null", () => {
        render(
            <ModelResultOverview
                id={mockModel.id}
                modelJSON={mockModel}
                results={null}
                loadingResult={false}
            />
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
