import {
    downloadJSON,
    formatAuthors,
    formatTimeStampToLongString,
    formatTimeStampAsDate,
    formatTimeStampToCompact,
    roundFloat,
    formatValue,
    formatLabel,
    isUUID,
    copyToClipboard,
    showNotification,
    reformatErrorMessage,
    replaceEmptyStringsWithNull,
} from "../utils";

describe("formatAuthors", () => {
    it("formats a single author", () => {
        const authors = [{ given_name: "Frodo", family_name: "Baggins" }];
        expect(formatAuthors(authors)).toBe("Frodo Baggins");
    });

    it("formats multiple authors with comma separator", () => {
        const authors = [
            { given_name: "Frodo", family_name: "Baggins" },
            { given_name: "Tom", family_name: "Bombadil" },
        ];
        expect(formatAuthors(authors)).toBe("Frodo Baggins, Tom Bombadil");
    });

    it("returns empty string for null", () => {
        expect(formatAuthors(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
        expect(formatAuthors(undefined)).toBe("");
    });

    it("returns empty string for empty array", () => {
        expect(formatAuthors([])).toBe("");
    });
});

describe("formatTimeStampToLongString", () => {
    it("formats a valid ISO timestamp to UTC string", () => {
        const result = formatTimeStampToLongString("2024-01-15T10:30:45.123Z");
        expect(result).toContain("Mon, 15 Jan 2024");
        expect(result).toContain("10:30:45 GMT");
    });

    it("returns empty string for null", () => {
        expect(formatTimeStampToLongString(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
        expect(formatTimeStampToLongString(undefined)).toBe("");
    });

    it("returns empty string for empty string", () => {
        expect(formatTimeStampToLongString("")).toBe("");
    });
});

describe("formatTimeStampAsDate", () => {
    it("formats a valid ISO timestamp to date string", () => {
        const result = formatTimeStampAsDate("2024-01-15T10:30:45.123Z");
        expect(result).toContain("Mon Jan 15 2024");
    });

    it("returns empty string for null", () => {
        expect(formatTimeStampAsDate(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
        expect(formatTimeStampAsDate(undefined)).toBe("");
    });
});

describe("formatTimeStampToCompact", () => {
    it("formats a valid ISO timestamp to compact format", () => {
        const result = formatTimeStampToCompact("2024-01-15T10:30:45.123Z");
        expect(result).toMatch(/^\d{2}-\d{2}-\d{4} \(\d{2}:\d{2}\)$/);
    });

    it("returns empty string for null", () => {
        expect(formatTimeStampToCompact(null)).toBe("");
    });

    it("returns empty string for undefined", () => {
        expect(formatTimeStampToCompact(undefined)).toBe("");
    });
});

describe("roundFloat", () => {
    it("rounds to specified decimal places", () => {
        expect(roundFloat(3.14159, 2)).toBe("3.14");
    });

    it("rounds to zero decimal places", () => {
        expect(roundFloat(3.14159, 0)).toBe("3");
    });

    it("pads with zeros when needed", () => {
        expect(roundFloat(3.1, 3)).toBe("3.100");
    });
});

describe("formatValue", () => {
    it("formats owner with formatAuthors", () => {
        const authors = [{ given_name: "Frodo", family_name: "Baggins" }];
        expect(formatValue("owner", authors)).toBe("Frodo Baggins");
    });

    it("formats author with formatAuthors", () => {
        const authors = [{ given_name: "Tom", family_name: "Bombadil" }];
        expect(formatValue("author", authors)).toBe("Tom Bombadil");
    });

    it("formats timestamp labels with formatTimeStampToLongString", () => {
        const ts = "2024-01-15T10:30:45.123Z";
        expect(formatValue("timestamp", ts)).toContain("2024");
        expect(formatValue("creation_date", ts)).toContain("2024");
        expect(formatValue("date_created", ts)).toContain("2024");
    });

    it("formats app to collab_id", () => {
        expect(formatValue("app", { collab_id: "my-collab" })).toBe(
            "my-collab"
        );
    });

    it("formats private boolean", () => {
        expect(formatValue("private", true)).toBe("True");
        expect(formatValue("private", false)).toBe("False");
    });

    it("returns value unchanged for unknown labels", () => {
        expect(formatValue("name", "test-name")).toBe("test-name");
    });
});

describe("formatLabel", () => {
    it("converts underscores to spaces and title-cases", () => {
        expect(formatLabel("brain_region")).toBe("Brain Region");
    });

    it("converts hyphens to spaces and title-cases", () => {
        expect(formatLabel("brain-region")).toBe("Brain Region");
    });

    it('uppercases "id" as standalone label', () => {
        expect(formatLabel("id")).toBe("ID");
    });

    it('uppercases "uri" as standalone label', () => {
        expect(formatLabel("uri")).toBe("URI");
    });

    it('converts project_id to "Collab ID"', () => {
        expect(formatLabel("project_id")).toBe("Collab ID");
    });

    it('converts "id" within compound label to "ID"', () => {
        expect(formatLabel("model_id")).toBe("Model ID");
    });

    it("handles single word labels", () => {
        expect(formatLabel("species")).toBe("Species");
    });

    it("handles already formatted labels", () => {
        expect(formatLabel("name")).toBe("Name");
    });
});

describe("isUUID", () => {
    it("returns true for a valid UUID", () => {
        expect(isUUID("95866c59-26d2-4d84-b1aa-95e1f9cf53bd")).toBe(true);
    });

    it("returns false for a non-UUID string", () => {
        expect(isUUID("not-a-uuid")).toBe(false);
    });

    it("returns false for empty string", () => {
        expect(isUUID("")).toBe(false);
    });

    it("returns false for null", () => {
        expect(isUUID(null)).toBe(false);
    });

    it("returns false for undefined", () => {
        expect(isUUID(undefined)).toBe(false);
    });

    it("returns false for UUID without hyphens", () => {
        expect(isUUID("95866c5926d24d84b1aa95e1f9cf53bd")).toBe(false);
    });

    it("returns true for uppercase UUID", () => {
        expect(isUUID("95866C59-26D2-4D84-B1AA-95E1F9CF53BD")).toBe(true);
    });
});

describe("copyToClipboard", () => {
    it("writes value to clipboard and shows notification", () => {
        const enqueueSnackbar = vi.fn().mockReturnValue("key-1");
        const closeSnackbar = vi.fn();

        copyToClipboard(
            "test-value",
            enqueueSnackbar,
            closeSnackbar,
            "Copied!"
        );

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            "test-value"
        );
        expect(enqueueSnackbar).toHaveBeenCalledWith(
            "Copied!",
            expect.objectContaining({ variant: "default" })
        );
    });

    it("uses custom type", () => {
        const enqueueSnackbar = vi.fn().mockReturnValue("key-1");
        const closeSnackbar = vi.fn();

        copyToClipboard(
            "val",
            enqueueSnackbar,
            closeSnackbar,
            "Done",
            "success"
        );

        expect(enqueueSnackbar).toHaveBeenCalledWith(
            "Done",
            expect.objectContaining({ variant: "success" })
        );
    });
});

describe("showNotification", () => {
    it("shows a notification with default type", () => {
        const enqueueSnackbar = vi.fn().mockReturnValue("key-1");
        const closeSnackbar = vi.fn();

        showNotification(enqueueSnackbar, closeSnackbar, "Hello");

        expect(enqueueSnackbar).toHaveBeenCalledWith(
            "Hello",
            expect.objectContaining({
                variant: "default",
                anchorOrigin: { vertical: "bottom", horizontal: "left" },
            })
        );
    });

    it("shows a notification with custom type", () => {
        const enqueueSnackbar = vi.fn().mockReturnValue("key-1");
        const closeSnackbar = vi.fn();

        showNotification(enqueueSnackbar, closeSnackbar, "Error!", "error");

        expect(enqueueSnackbar).toHaveBeenCalledWith(
            "Error!",
            expect.objectContaining({ variant: "error" })
        );
    });
});

describe("reformatErrorMessage", () => {
    it("formats string detail", () => {
        const err = { status: 404, data: { detail: "Not found" } };
        expect(reformatErrorMessage(err)).toBe(
            "Error code = 404\n\nNot found"
        );
    });

    it("formats array detail with loc and msg", () => {
        const err = {
            status: 422,
            data: {
                detail: [
                    { loc: ["body", "name"], msg: "field required" },
                    { loc: ["body", "description"], msg: "too short" },
                ],
            },
        };
        const result = reformatErrorMessage(err);
        expect(result).toContain("Error code = 422");
        expect(result).toContain("Error source #1: body -> name");
        expect(result).toContain("Error message: field required");
        expect(result).toContain("Error source #2: body -> description");
        expect(result).toContain("Error message: too short");
    });

    it("formats object detail as JSON", () => {
        const err = {
            status: 500,
            data: { detail: { key: "value" } },
        };
        const result = reformatErrorMessage(err);
        expect(result).toContain("Error code = 500");
        expect(result).toContain('{"key":"value"}');
    });

    it("handles missing detail", () => {
        const err = { status: 500, data: {} };
        expect(reformatErrorMessage(err)).toBe("Error code = 500");
    });

    it("handles null detail", () => {
        const err = { status: 500, data: { detail: null } };
        expect(reformatErrorMessage(err)).toBe("Error code = 500");
    });
});

describe("replaceEmptyStringsWithNull", () => {
    it("replaces empty string with null", () => {
        expect(replaceEmptyStringsWithNull("")).toBe(null);
    });

    it("keeps non-empty string", () => {
        expect(replaceEmptyStringsWithNull("hello")).toBe("hello");
    });

    it("returns null for null", () => {
        expect(replaceEmptyStringsWithNull(null)).toBe(null);
    });

    it("keeps numbers unchanged", () => {
        expect(replaceEmptyStringsWithNull(42)).toBe(42);
    });

    it("keeps booleans unchanged", () => {
        expect(replaceEmptyStringsWithNull(false)).toBe(false);
        expect(replaceEmptyStringsWithNull(true)).toBe(true);
    });

    it("recursively handles arrays", () => {
        expect(replaceEmptyStringsWithNull(["", "a", ""])).toEqual([
            null,
            "a",
            null,
        ]);
    });

    it("recursively handles objects", () => {
        expect(
            replaceEmptyStringsWithNull({ a: "", b: "hello", c: "" })
        ).toEqual({ a: null, b: "hello", c: null });
    });

    it("handles nested objects and arrays", () => {
        const input = {
            name: "test",
            values: ["", "a"],
            nested: { x: "", y: 1 },
        };
        const expected = {
            name: "test",
            values: [null, "a"],
            nested: { x: null, y: 1 },
        };
        expect(replaceEmptyStringsWithNull(input)).toEqual(expected);
    });
});

describe("downloadJSON", () => {
    it("creates a download link and clicks it", () => {
        const clickSpy = vi.fn();
        const appendChildSpy = vi.spyOn(document.body, "appendChild").mockImplementation(() => {});
        const removeChildSpy = vi.spyOn(document.body, "removeChild").mockImplementation(() => {});
        vi.spyOn(document, "createElement").mockReturnValue({
            setAttribute: vi.fn(),
            click: clickSpy,
        });

        downloadJSON('{"key":"value"}', "test.json");

        expect(clickSpy).toHaveBeenCalled();
        appendChildSpy.mockRestore();
        removeChildSpy.mockRestore();
    });
});
