import "@testing-library/jest-dom";

// Stub window.opener (globals.js reads this at import time)
Object.defineProperty(window, "opener", {
    value: null,
    writable: true,
    configurable: true,
});

// Stub navigator.clipboard for utils.js copyToClipboard
Object.defineProperty(navigator, "clipboard", {
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
    writable: true,
});

// Stub URL.createObjectURL/revokeObjectURL for downloadJSON
if (typeof URL.createObjectURL === "undefined") {
    URL.createObjectURL = vi.fn(() => "blob:mock");
}
if (typeof URL.revokeObjectURL === "undefined") {
    URL.revokeObjectURL = vi.fn();
}

// Stub HTMLCanvasElement.getContext (jsdom doesn't implement it)
HTMLCanvasElement.prototype.getContext = vi.fn(() => null);

// Suppress console.log in tests (datastore uses it for cache messages)
vi.spyOn(console, "log").mockImplementation(() => {});
