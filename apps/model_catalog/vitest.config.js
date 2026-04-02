import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./src/__tests__/setup.js"],
        include: ["src/__tests__/**/*.test.{js,jsx}"],
        coverage: {
            provider: "v8",
            reporter: ["text", "text-summary", "html"],
            include: ["src/**/*.{js,jsx}"],
            exclude: [
                "src/__tests__/**",
                "src/index.jsx",
                "src/init.js",
                "src/globals-staging.js",
                "src/dev_data/**",
            ],
        },
    },
    define: {
        "import.meta.env.DEV": JSON.stringify(false),
    },
});
