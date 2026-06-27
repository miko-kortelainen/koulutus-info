import { test, expect } from "@playwright/test";

const NAV_LABEL = "Navigointi";

test("homepage loads and nav is visible", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: NAV_LABEL })).toBeVisible();
  await expect(page.getByRole("heading", { name: "yhteishaku.app" })).toBeVisible();
});

test("nav links navigate to all pages", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: NAV_LABEL });

  await nav.getByRole("link", { name: "hakijamäärät" }).click();
  await expect(page).toHaveURL("/hakijamaarat");

  await nav.getByRole("link", { name: "koulutukset" }).click();
  await expect(page).toHaveURL("/koulutukset");

  await nav.getByRole("link", { name: "trendit" }).click();
  await expect(page).toHaveURL("/trendit");
});

test("/hakijamaarat: loads data and search filters results", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Hae koulua tai linjaa");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Hakijat").first()).toBeVisible();
});

test("/koulutukset: loads data and search filters results", async ({ page }) => {
  await page.goto("/koulutukset");
  await page.waitForLoadState("networkidle");

  const search = page.getByPlaceholder("Etsi koulutuksia");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/hakijamaarat: year switcher fetches different data", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await page.waitForLoadState("networkidle");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("statistics-2025.json")),
    page.locator('select[aria-label="Vuosi"]').selectOption("2025"),
  ]);
  expect(response.status()).toBe(200);
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  // wait for at least one bar item to appear (data loaded)
  await expect(page.locator("li, [role='listitem']").first()).toBeVisible({ timeout: 10000 });
});
