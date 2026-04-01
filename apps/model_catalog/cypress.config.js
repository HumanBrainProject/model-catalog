const { defineConfig } = require("cypress");
const fs = require("fs");
const path = require("path");

function hasValidDevToken() {
  const envPath = path.resolve(__dirname, ".env.local");
  if (!fs.existsSync(envPath)) {
    return false;
  }
  const content = fs.readFileSync(envPath, "utf8");
  const match = content.match(/^VITE_DEV_TOKEN=(.+)/m);
  if (!match) {
    return false;
  }
  try {
    const payload = JSON.parse(
      Buffer.from(match[1].trim().split(".")[1], "base64").toString()
    );
    return payload.exp && payload.exp * 1000 > Date.now();
  } catch (e) {
    return false;
  }
}

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    chromeWebSecurity: false,
    watchForFileChanges: false,
    specPattern: "cypress/e2e/**/*.spec.js",
    supportFile: false,
    setupNodeEvents(on, config) {
      config.env.hasValidToken = hasValidDevToken();
      return config;
    },
  },
});
