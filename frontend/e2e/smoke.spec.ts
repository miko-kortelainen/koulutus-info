import { test, expect, type Page } from "@playwright/test";

const NAV_LABEL = "navigointi";

async function gotoReady(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

// click can land before hydration, so retry until the drawer actually opens
async function openNavDrawer(page: Page) {
  await expect(async () => {
    await page.getByRole("button", { name: "avaa navigointi" }).click();
    await expect(page.getByRole("navigation", { name: NAV_LABEL })).toBeVisible({ timeout: 1000 });
  }).toPass();
}

test("homepage loads and nav drawer opens", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "yhteishaku.app" })).toBeVisible();
  await openNavDrawer(page);
});

test("nav links navigate to all pages", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: NAV_LABEL });

  // drawer closes on link click, so reopen before each navigation
  for (const [label, url] of [
    ["hakijamäärät", "/hakijamaarat"],
    ["koulutukset", "/koulutukset"],
    ["trendit", "/trendit"],
    ["hukassa?", "/hukassa"],
  ] as const) {
    await openNavDrawer(page);
    await nav.getByRole("link", { name: label }).click();
    await expect(page).toHaveURL(url);
  }
});

test("/hakijamaarat: loads data and search filters results", async ({ page }) => {
  await gotoReady(page, "/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Hae koulua tai linjaa");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Hakijat").first()).toBeVisible();
});

test("/koulutukset: loads data and search filters results", async ({ page }) => {
  await gotoReady(page, "/koulutukset");

  const search = page.getByPlaceholder("Etsi koulutuksia");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/hakijamaarat: year switcher fetches different data", async ({ page }) => {
  await gotoReady(page, "/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("statistics-2025.json")),
    page.locator('select[aria-label="Vuosi"]').selectOption("2025"),
  ]);
  expect(response.status()).toBe(200);
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
});

test("/koulutukset: school listbox filter narrows results", async ({ page }) => {
  await gotoReady(page, "/koulutukset");

  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible({ timeout: 10000 });

  // select first school — results still exist
  await options.first().click();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();

  // also select second school (multi-select smoke)
  const second = options.nth(1);
  if (await second.isVisible()) {
    await second.click();
    await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
    await second.click(); // deselect
  }

  // deselect first → unfiltered results return
  await options.first().click();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/hukassa: search returns suggestion results", async ({ page }) => {
  await gotoReady(page, "/hukassa");
  await expect(page.getByRole("heading", { name: "Hukassa?" })).toBeVisible();

  await page.getByPlaceholder("Minua kiinnostaa...").fill("ohjelmointi ja tietotekniikka");
  await page.getByRole("button", { name: "Hae" }).click();

  await expect(page.getByText("Sinulle sopivimmat koulutukset:")).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("Katso opintopolussa").first()).toBeVisible();
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  // "Hakijaa" column header renders only after skeletons are replaced by data
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
});
