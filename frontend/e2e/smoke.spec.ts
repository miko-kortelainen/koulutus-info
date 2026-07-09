import { expect, type Page, test } from "@playwright/test";

test.describe.configure({ mode: "parallel" });

const NAV_LABEL = "navigointi";

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

test("homepage quick links point to their pages", async ({ page }) => {
  await page.goto("/");

  for (const [label, url] of [
    ["hakijamäärät", "/hakijamaarat/"],
    ["koulutukset", "/koulutukset/"],
    ["koulut", "/koulut/"],
    ["trendit", "/trendit/"],
  ] as const) {
    await expect(page.getByRole("link", { name: new RegExp(`^${label}(\\s|$)`) })).toHaveAttribute("href", url);
  }
});

test("nav links navigate to all pages", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("navigation", { name: NAV_LABEL });

  // drawer closes on link click, so reopen before each navigation
  for (const [label, url] of [
    ["hakijamäärät", "/hakijamaarat/"],
    ["koulutukset", "/koulutukset/"],
    ["koulut", "/koulut/"],
    ["tallennetut", "/tallennetut/"],
    ["trendit", "/trendit/"],
    ["palaute", "/palaute/"],
    ["ukk", "/ukk/"],
  ] as const) {
    await openNavDrawer(page);
    // anchored regex: nav link names are "label + description" concatenated, and short labels
    // like "koulut" are substrings of others ("koulutukset", "...koulutusvalinnan...")
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await nav.getByRole("link", { name: new RegExp(`^${escapedLabel}(\\s|$)`) }).click();
    await expect(page).toHaveURL(url);
  }
});

test("/hakijamaarat: loads data and search filters results", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Hae koulua tai linjaa");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Hakijat").first()).toBeVisible();
});

test("/koulutukset: loads data and search filters results", async ({ page }) => {
  await page.goto("/koulutukset");
  await expect(page.getByText("Katso opintopolussa").first()).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Etsi koulutuksia");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible({ timeout: 10000 });

  await search.clear();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/hakijamaarat: year switcher fetches different data", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  // 2025 is a fixed past year in the static YEAR_OPTIONS list (yearOptions.ts), stable regardless of "current" year
  await page.getByRole("combobox", { name: "Vuosi" }).click();
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("statistics-2025.json")),
    page.getByRole("option", { name: "Tilastovuosi 2025" }).click(),
  ]);
  expect(response.status()).toBe(200);
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
});

test("/hakijamaarat: koulu filter narrows results", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  // filters live inside collapsed accordion sections — open "Koulu" to reach the school listbox
  await page.getByRole("button", { name: "Koulu" }).click();
  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible({ timeout: 10000 });

  await options.first().click();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();

  // deselect → unfiltered results return
  await options.first().click();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/koulutukset: school listbox filter narrows results", async ({ page }) => {
  await page.goto("/koulutukset");
  await expect(page.getByText("Katso opintopolussa").first()).toBeVisible({ timeout: 10000 });

  // filters live inside collapsed accordion sections — open "Koulu" to reach the school listbox
  await page.getByRole("button", { name: "Koulu" }).click();
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

test("/koulutukset: saving a card lists it on /tallennetut and unsaving clears it", async ({ page }) => {
  await page.goto("/koulutukset");
  await expect(page.getByText("Katso opintopolussa").first()).toBeVisible({ timeout: 10000 });

  // click can land before hydration, so retry until the toggle actually takes effect
  await expect(async () => {
    await page.getByRole("button", { name: "Tallenna" }).first().click();
    await expect(page.getByRole("button", { name: "Poista tallennetuista" }).first()).toBeVisible({ timeout: 1000 });
  }).toPass();

  await page.goto("/tallennetut");
  await expect(page.getByText("Ei vielä tallennettuja koulutuksia.")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Poista tallennetuista" })).toHaveCount(1);

  await page.getByRole("button", { name: "Poista tallennetuista" }).click();
  await expect(page.getByText("Ei vielä tallennettuja koulutuksia.")).toBeVisible();
});

test("/palaute: submits feedback and shows thank you message", async ({ page }) => {
  // formsubmit.co is a third-party form backend — stub it so its downtime can't fail this suite
  await page.route("https://formsubmit.co/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/palaute");
  await expect(page.getByRole("heading", { name: "Palaute" })).toBeVisible();

  await page.getByPlaceholder("Kirjoita palautteesi tähän...").fill("Testipalaute");
  await page.getByRole("button", { name: "Lähetä" }).click();
  await expect(page.getByText("Kiitos palautteesta!")).toBeVisible({ timeout: 1000 });
});

test("/vertaile: selecting two hakukohde on /hakijamaarat opens side-by-side comparison", async ({ page }) => {
  await page.goto("/hakijamaarat");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Valittu ✓" }).first()).toBeVisible({ timeout: 1000 });
  await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Valittu ✓" })).toHaveCount(2);

  await page.getByRole("link", { name: "Vertaile" }).click();
  // vuosi=2026 mirrors CURRENT_YEAR in pages/hakijamaarat/components/yearOptions.ts — update together
  await expect(page).toHaveURL(/\/vertaile\/\?a=.+&b=.+&vuosi=2026/);
  await expect(page.getByRole("heading", { name: "Vertailu" })).toBeVisible();
  await expect(page.getByText("Hakijapaine", { exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Kaikki hakijat")).toHaveCount(2);
});

test("/koulut: lists schools by sector and switches tabs", async ({ page }) => {
  await page.goto("/koulut");
  await expect(page.getByRole("heading", { name: "Koulut" })).toBeVisible();

  await expect(page.getByRole("tabpanel").getByRole("link").first()).toBeVisible();

  await page.getByRole("tab", { name: "Ammattikorkeakoulut" }).click();
  await expect(page.getByRole("tabpanel").getByRole("link").first()).toBeVisible();
});

test("/koulut/:slug: selecting a school opens its detail page", async ({ page }) => {
  await page.goto("/koulut");

  const firstSchool = page.getByRole("tabpanel").getByRole("link").first();
  const href = await firstSchool.getAttribute("href");
  expect(href).toBeTruthy();
  await firstSchool.click();

  await expect(page).toHaveURL(href as string);
  await expect(page.getByRole("heading").first()).toBeVisible();
});

test("/koulut/:slug/pisterajat: shows paginated programme cutoff cards", async ({ page }) => {
  await page.goto("/koulut/aalto-yliopisto");
  await page.getByRole("link", { name: "Katso pisterajat" }).click();

  await expect(page).toHaveURL("/koulut/aalto-yliopisto/pisterajat/");
  await expect(page.getByRole("heading", { name: "Pisterajat: Aalto-yliopisto" })).toBeVisible();
  await expect(
    page.getByText("Automaatio ja robotiikka, tekniikan kandidaatti ja diplomi-insinööri").first(),
  ).toBeVisible();
  await expect(page.getByText("Todistusvalinta").first()).toBeVisible();
  await expect(page.getByText("145,60")).toBeVisible();

  // click can land before hydration, so retry until page 2 actually renders
  await expect(async () => {
    await page.getByRole("button", { name: "2" }).click();
    await expect(page.getByText("Kauppatieteet, kauppatieteiden kandidaatti ja maisteri").first()).toBeVisible({
      timeout: 1000,
    });
  }).toPass();
});

test("/koulut/:slug/pisterajat: groups programmes into selection-method tabs", async ({ page }) => {
  await page.goto("/koulut/seinajoen-ammattikorkeakoulu/pisterajat/");

  const tabs = page.getByRole("tablist");
  const certificatePanel = page.getByRole("tabpanel", { name: "Todistusvalinta" });
  const examPanel = page.getByRole("tabpanel", { name: "Koepisteet" });
  await expect(tabs).toBeVisible();
  await expect(tabs.getByRole("tab", { name: "Todistusvalinta" })).toBeVisible();
  await expect(tabs.getByRole("tab", { name: "Koepisteet" })).toBeVisible();
  await expect(certificatePanel.getByText("Agrologi (AMK), päivätoteutus")).toBeVisible();

  // Certificate selection has more than one page; retain it after switching tabs.
  await expect(async () => {
    await certificatePanel.getByRole("button", { name: "2" }).click();
    await expect(certificatePanel.getByText("Insinööri (AMK), konetekniikka, monimuotototeutus")).toBeVisible({
      timeout: 1000,
    });
  }).toPass();

  // click can land before hydration, so retry until the tab actually switches
  await expect(async () => {
    await tabs.getByRole("tab", { name: "Koepisteet" }).click();
    await expect(
      examPanel.getByText("Master of Business Administration, International Business Management"),
    ).toBeVisible({
      timeout: 1000,
    });
  }).toPass();

  await tabs.getByRole("tab", { name: "Todistusvalinta" }).click();
  await expect(certificatePanel.getByText("Insinööri (AMK), konetekniikka, monimuotototeutus")).toBeVisible();
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  // "Hakijaa" column header renders only after skeletons are replaced by data
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
});
