import React from "react";
import { screen, render } from "@testing-library/react";
import { mockTest } from "./helpers/fixtures";
import TestResultOverview from "../TestResultOverview";

vi.mock("../datastore", () => ({
    datastore: {
        getResult: vi.fn().mockResolvedValue({}),
    },
}));

describe("TestResultOverview (smoke test)", () => {
    it("renders loading indicator when loadingResult is true", () => {
        render(
            <TestResultOverview
                id={mockTest.id}
                testJSON={mockTest}
                results={[]}
                loadingResult={true}
            />
        );
        expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("renders no results message when results are empty", () => {
        render(
            <TestResultOverview
                id={mockTest.id}
                testJSON={mockTest}
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
            <TestResultOverview
                id={mockTest.id}
                testJSON={mockTest}
                results={null}
                loadingResult={false}
            />
        );
        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });
});
