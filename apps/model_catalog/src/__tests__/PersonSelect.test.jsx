import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

vi.mock("material-ui-chip-input", () => ({
    default: (props) => {
        return (
            <div data-testid="chip-input">
                <label>{props.label}</label>
                {props.value &&
                    props.value.map((v, i) => (
                        <span key={i} data-testid="chip">
                            {v}
                        </span>
                    ))}
                {props.error && <span data-testid="chip-error">Error</span>}
                <input
                    data-testid="chip-text-input"
                    onKeyDown={(e) => {
                        if (
                            props.newChipKeys &&
                            props.newChipKeys.includes(e.key) &&
                            e.target.value
                        ) {
                            if (
                                props.onBeforeAdd &&
                                !props.onBeforeAdd(e.target.value)
                            ) {
                                return;
                            }
                            if (props.onAdd) {
                                props.onAdd(e.target.value);
                            }
                            e.target.value = "";
                        }
                    }}
                />
                {props.value &&
                    props.value.map((v, i) => (
                        <button
                            key={`del-${i}`}
                            data-testid={`chip-delete-${i}`}
                            onClick={() => props.onDelete && props.onDelete(v, i)}
                        >
                            Delete {v}
                        </button>
                    ))}
            </div>
        );
    },
}));

vi.mock("humanparser", () => ({
    parseName: (name) => {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 1) {
            return { firstName: parts[0], middleName: "", lastName: "" };
        }
        return {
            firstName: parts[0],
            middleName: parts.length > 2 ? parts.slice(1, -1).join(" ") : "",
            lastName: parts[parts.length - 1],
        };
    },
}));

import PersonSelect from "../PersonSelect";

describe("PersonSelect", () => {
    const defaultProps = {
        id: "authors",
        name: "authors",
        label: "Authors",
        value: [],
        onChange: vi.fn(),
        variant: "outlined",
        fullWidth: true,
        helperText: "Enter author names",
        newChipKeys: ["Enter"],
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders with a label", () => {
        render(<PersonSelect {...defaultProps} />);
        expect(screen.getByText("Authors")).toBeInTheDocument();
    });

    it("displays formatted names as chips", () => {
        const value = [
            { given_name: "John", family_name: "Doe" },
            { given_name: "Jane", family_name: "Smith" },
        ];
        render(<PersonSelect {...defaultProps} value={value} />);
        expect(screen.getByText("Doe, John")).toBeInTheDocument();
        expect(screen.getByText("Smith, Jane")).toBeInTheDocument();
    });

    it("renders no chips when value is empty", () => {
        render(<PersonSelect {...defaultProps} />);
        expect(screen.queryAllByTestId("chip")).toHaveLength(0);
    });

    describe("handleAddPerson", () => {
        it("calls onChange with parsed person when a chip is added", () => {
            const onChange = vi.fn();
            render(
                <PersonSelect {...defaultProps} onChange={onChange} value={[]} />
            );

            const input = screen.getByTestId("chip-text-input");
            // Simulate typing and pressing Enter
            fireEvent.change(input, { target: { value: "John Doe" } });
            input.value = "John Doe";
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalledWith({
                target: {
                    name: "authors",
                    value: [{ given_name: "John", family_name: "Doe" }],
                },
            });
        });

        it("parses names with middle names correctly", () => {
            const onChange = vi.fn();
            render(
                <PersonSelect {...defaultProps} onChange={onChange} value={[]} />
            );

            const input = screen.getByTestId("chip-text-input");
            input.value = "Jean Pierre Dupont";
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalledWith({
                target: {
                    name: "authors",
                    value: [
                        { given_name: "Jean Pierre", family_name: "Dupont" },
                    ],
                },
            });
        });
    });

    describe("handleRemovePerson", () => {
        it("calls onChange without the removed person", () => {
            const onChange = vi.fn();
            const value = [
                { given_name: "John", family_name: "Doe" },
                { given_name: "Jane", family_name: "Smith" },
            ];
            render(
                <PersonSelect
                    {...defaultProps}
                    onChange={onChange}
                    value={value}
                />
            );

            // Click delete button for the first chip
            fireEvent.click(screen.getByTestId("chip-delete-0"));

            expect(onChange).toHaveBeenCalledWith({
                target: {
                    name: "authors",
                    value: [{ given_name: "Jane", family_name: "Smith" }],
                },
            });
        });
    });

    describe("validateEntry", () => {
        it("shows error for single-word names", () => {
            const onChange = vi.fn();
            render(
                <PersonSelect {...defaultProps} onChange={onChange} value={[]} />
            );

            const input = screen.getByTestId("chip-text-input");
            // Single word should fail validation
            input.value = "Madonna";
            fireEvent.keyDown(input, { key: "Enter" });

            // onChange should NOT have been called because validation fails
            expect(onChange).not.toHaveBeenCalled();
            // Error indicator should appear
            expect(screen.getByTestId("chip-error")).toBeInTheDocument();
        });

        it("accepts two-word names", () => {
            const onChange = vi.fn();
            render(
                <PersonSelect {...defaultProps} onChange={onChange} value={[]} />
            );

            const input = screen.getByTestId("chip-text-input");
            input.value = "John Doe";
            fireEvent.keyDown(input, { key: "Enter" });

            expect(onChange).toHaveBeenCalled();
        });

        it("accepts empty strings (no validation error)", () => {
            const onChange = vi.fn();
            render(
                <PersonSelect {...defaultProps} onChange={onChange} value={[]} />
            );

            // Empty string should not trigger error (length === 0 passes validation)
            // But won't add a chip because of the truthiness check
            const input = screen.getByTestId("chip-text-input");
            input.value = "";
            fireEvent.keyDown(input, { key: "Enter" });

            // With empty value, the input won't trigger onAdd
            expect(onChange).not.toHaveBeenCalled();
        });
    });
});
