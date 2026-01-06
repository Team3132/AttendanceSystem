import { defineConfig, devices } from "@playwright/test";

const baseURL = "http://localhost:1420";
/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: "./tests",

  reporter: [["line"]],

  //   globalSetup: "./tests/setup/global.setup.ts",
  //   globalTeardown: "./tests/setup/global.teardown.ts",

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL,
  },

  webServer: {
    command: `NODE_ENV="test" bun run build --mode test && NODE_ENV="test" bun run start`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    stdout: "pipe",
    timeout: 120_000,
  },

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
