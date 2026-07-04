import { test, expect, type Page } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

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
    ["palaute", "/palaute"],
    ["ukk", "/ukk"],
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

test("/palaute: submits feedback and shows thank you message", async ({ page }) => {
  await page.route("https://formsubmit.co/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  await gotoReady(page, "/palaute");
  await expect(page.getByRole("heading", { name: "Palaute" })).toBeVisible();

  await page.getByPlaceholder("Kirjoita palautteesi tähän...").fill("Testipalaute");
  await page.getByRole("button", { name: "Lähetä" }).click();
  await expect(page.getByText("Kiitos palautteesta!")).toBeVisible({ timeout: 1000 });
});

test("/vertaile: selecting two hakukohde on /hakijamaarat opens side-by-side comparison", async ({ page }) => {
  await gotoReady(page, "/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Valittu ✓" }).first()).toBeVisible({ timeout: 1000 });
  await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Valittu ✓" })).toHaveCount(2);

  await page.getByRole("link", { name: "Vertaile" }).click();
  await expect(page).toHaveURL(/\/vertaile\?a=.+&b=.+&vuosi=2026/);
  await expect(page.getByRole("heading", { name: "Vertailu" })).toBeVisible();
  await expect(page.getByText("Hakijapaine", { exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Kaikki hakijat")).toHaveCount(2);
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  // "Hakijaa" column header renders only after skeletons are replaced by data
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
});
