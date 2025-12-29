import test from "@playwright/test";

test("Navigating to login", async ({ page }) => {
  await page.goto("/login");
});
