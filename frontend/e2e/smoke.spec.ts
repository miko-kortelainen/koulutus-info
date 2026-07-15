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

async function selectOption(page: Page, label: string, option: string) {
  await page.getByRole("combobox", { name: label }).click();
  await page.getByRole("option", { name: option, exact: true }).click();
}

async function expectSelectedOption(page: Page, label: string, option: string) {
  await expect(page.getByRole("combobox", { name: label })).toContainText(option);
}

// tab selection is idempotent, so it can safely gate interactions until hydration finishes
async function waitForCalculatorHydration(page: Page) {
  const ammTab = page.getByRole("tab", { name: "AMM" });
  await expect(async () => {
    await ammTab.click();
    await expect(ammTab).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
  }).toPass();

  const yoTab = page.getByRole("tab", { name: "YO" });
  await yoTab.click();
  await expect(yoTab).toHaveAttribute("aria-selected", "true");
}

async function openResultsAccordion(page: Page, name: RegExp) {
  const trigger = page.getByRole("button", { name });
  const item = trigger.locator("..");

  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(item.getByRole("article").first()).toBeVisible({ timeout: 10000 });

  return item;
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
    ["pistelaskuri", "/pistelaskuri/"],
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
    ["pistelaskuri", "/pistelaskuri/"],
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

test("/pistelaskuri: shows active cutoffs and compares calculated points", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pistelaskuri/");
  await expect(page.getByRole("heading", { name: "Pistelaskuri" })).toBeVisible();
  await expect(page.getByText(/Pisteesi riittävät – \/ \d+ koulutukseen/)).toBeVisible();
  await waitForCalculatorHydration(page);
  await expectSelectedOption(page, "Yhteishaku", "Kevään yhteishaku 2026");
  await expectSelectedOption(page, "Korkeakoulutyyppi", "Kaikki korkeakoulut");
  const firstTimeApplicantCheckbox = page.getByRole("checkbox", { name: "Olen ensikertalainen" });
  await expect(firstTimeApplicantCheckbox).not.toBeChecked();

  const resultSearch = page.getByRole("textbox", { name: "Hae koulutusta tai korkeakoulua" });
  await resultSearch.fill("Turun yliopisto");
  await expect(page.getByText(/\d+ hakutulosta/)).toBeVisible();
  await expect(page.getByText("Kauppa, hallinto ja oikeustieteet").first()).toBeVisible();
  await expect(page.getByText("Tietojenkäsittely ja tietoliikenne").first()).toBeVisible();
  await expect(page.getByRole("button", { name: /Humanistiset alat/ })).toHaveCount(0);
  await resultSearch.clear();

  await resultSearch.fill("Pedagogik (undervisning på svenska)");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article").getByText("Todistusvalinta", { exact: true })).toBeVisible();
  await page.getByText("Olen ensikertalainen", { exact: true }).click();
  await expect(firstTimeApplicantCheckbox).toBeChecked();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article").getByText("Todistusvalinta, ensikertalaiset", { exact: true })).toBeVisible();
  await resultSearch.clear();

  await selectOption(page, "Korkeakoulutyyppi", "Vain yliopistot");
  const humanistisetAccordion = await openResultsAccordion(page, /Humanistiset alat/);
  await expect(humanistisetAccordion.getByRole("article")).toHaveCount(20);
  await expect(humanistisetAccordion.getByText(/Näytetään 20 \/ \d+/)).toBeVisible();
  await humanistisetAccordion.getByRole("button", { name: "Näytä lisää" }).click();
  await expect(humanistisetAccordion.getByRole("article")).toHaveCount(40);
  await expect(
    humanistisetAccordion
      .getByRole("article")
      .getByText(/Todistusvalinta/)
      .first(),
  ).toBeVisible();
  await expect(humanistisetAccordion.getByRole("article").getByText("AMK-valintakoe", { exact: true })).toHaveCount(0);

  await page.getByRole("tab", { name: "AMK-valintakoe" }).click();
  await expect(page.getByText("Ei koulutuksia valituilla rajauksilla.")).toBeVisible();
  await page.getByRole("tab", { name: "YO" }).click();
  await selectOption(page, "Korkeakoulutyyppi", "Kaikki korkeakoulut");

  const roundResponse = page.waitForResponse((response) => response.url().includes("pisterajat-2025-syksy.json"));
  await selectOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  expect((await roundResponse).status()).toBe(200);
  const tekniikkaAccordion = await openResultsAccordion(page, /Tekniikan alat/);
  await expect(tekniikkaAccordion.getByText("Pisteesi / alin hyväksytty pistemäärä (syksy 2025)").first()).toBeVisible();

  await selectOption(page, "Yhteishaku", "Kevään yhteishaku 2026");
  await expect(tekniikkaAccordion.getByText("Pisteesi / alin hyväksytty pistemäärä (kevät 2026)").first()).toBeVisible();

  await expect(page.getByRole("article").getByText("Todistusvalinta (YO)", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("article").getByText(/^– \/ /).first()).toBeVisible();

  await selectOption(page, "Järjestys", "Korkein pisteraja");
  await expectSelectedOption(page, "Järjestys", "Korkein pisteraja");
  await expect
    .poll(async () => {
      const cutoffScores = (await tekniikkaAccordion.getByRole("article").getByText(/^– \/ /).allTextContents()).map(
        (text) => Number(text.split("/")[1].trim().replace(",", ".")),
      );
      return (
        cutoffScores.length > 1 &&
        cutoffScores.every((score, index) => index === 0 || cutoffScores[index - 1] >= score)
      );
    })
    .toBe(true);

  await selectOption(page, "Järjestys", "A-Z");
  await expectSelectedOption(page, "Järjestys", "A-Z");
  await expect
    .poll(async () => {
      const programmeNames = await tekniikkaAccordion
        .getByRole("article")
        .getByRole("heading", { level: 3 })
        .allTextContents();
      return (
        programmeNames.length > 1 &&
        programmeNames.every((name, index) => index === 0 || programmeNames[index - 1].localeCompare(name, "fi") <= 0)
      );
    })
    .toBe(true);

  await page.getByRole("tab", { name: "AMM" }).click();
  await expectSelectedOption(page, "Järjestys", "A-Z");
  await expect(page.getByRole("article").getByText("Todistusvalinta (AMM)", { exact: true }).first()).toBeVisible();
  await expect(page.getByRole("article").getByText("Todistusvalinta (YO)", { exact: true })).toHaveCount(0);

  await page.getByRole("tab", { name: "AMK-valintakoe" }).click();
  await expect(page.getByRole("article").getByText("AMK-valintakoe", { exact: true }).first()).toBeVisible();

  await page.getByRole("tab", { name: "YO" }).click();

  await selectOption(page, "Äidinkieli", "M");
  await selectOption(page, "Matematiikan oppimäärä", "Lyhyt");
  await selectOption(page, "Matematiikan arvosana", "M");

  await page.getByRole("button", { name: "+ Lisää kieli" }).click();
  await selectOption(page, "Kieli 1", "Toinen kotimainen kieli, keskipitkä");
  await selectOption(page, "Kielen 1 arvosana", "C");

  await page.getByRole("button", { name: "+ Lisää aine" }).click();
  await selectOption(page, "Reaaliaine 1", "Filosofia");
  await selectOption(page, "Reaaliaineen 1 arvosana", "E");

  await page.getByRole("button", { name: "Laske pisteet" }).click();

  await expect(page.getByText("106 / 198")).toBeVisible();
  await expect(page.getByText(/Pisteesi riittävät \d+ \/ \d+ koulutukseen/)).toBeVisible();
  await expect(page.getByText(/ei ota huomioon hakukohdekohtaisia kynnysehtoja/)).toBeVisible();

  await expect(page.getByText("Pisteesi / alin hyväksytty pistemäärä").first()).toBeVisible();
  await expect(page.getByRole("article").getByText(/^106 \/ /).first()).toBeVisible();

  await page.getByRole("tab", { name: "AMM" }).click();
  await expect(page.getByText(/Pisteesi riittävät – \/ \d+ koulutukseen/)).toBeVisible();
  await expect(page.getByRole("article").getByText("Todistusvalinta (AMM)", { exact: true }).first()).toBeVisible();
});

test("/pistelaskuri: restores only successfully submitted YO and AMM forms", async ({ page }) => {
  await page.goto("/pistelaskuri/");
  await waitForCalculatorHydration(page);

  await selectOption(page, "Äidinkieli", "M");
  await page.getByRole("button", { name: "+ Lisää kieli" }).click();
  await selectOption(page, "Kieli 1", "Englanti, pitkä");
  await selectOption(page, "Kielen 1 arvosana", "E");
  await page.getByRole("button", { name: "Laske pisteet" }).click();

  await page.getByRole("tab", { name: "AMM" }).click();
  await selectOption(page, "Viestintä- ja vuorovaikutusosaaminen", "3");
  await selectOption(page, "Matemaattis-luonnontieteellinen osaaminen", "3");
  await selectOption(page, "Yhteiskunta- ja työelämäosaaminen", "3");
  await page.getByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" }).fill("3,96");
  await page.getByRole("button", { name: "Laske pisteet" }).click();

  await page.reload();

  await expect(page.getByRole("tab", { name: "YO" })).toHaveAttribute("aria-selected", "true");
  await expectSelectedOption(page, "Äidinkieli", "M");
  await expectSelectedOption(page, "Kieli 1", "Englanti, pitkä");
  await expectSelectedOption(page, "Kielen 1 arvosana", "E");

  await page.getByRole("button", { name: "+ Lisää kieli" }).click();
  await expect(page.getByRole("combobox", { name: "Kieli 2" })).toBeVisible();
  await selectOption(page, "Äidinkieli", "L");
  await page.reload();
  await expectSelectedOption(page, "Äidinkieli", "M");
  await expect(page.getByRole("combobox", { name: "Kieli 2" })).toHaveCount(0);

  await page.getByRole("tab", { name: "AMM" }).click();
  await expectSelectedOption(page, "Viestintä- ja vuorovaikutusosaaminen", "3");
  await expectSelectedOption(page, "Matemaattis-luonnontieteellinen osaaminen", "3");
  await expectSelectedOption(page, "Yhteiskunta- ja työelämäosaaminen", "3");
  await expect(page.getByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" })).toHaveValue("3,96");
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
  // vuosi=2026 mirrors CURRENT_YEAR in config/yearOptions.ts — update together
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

test("/koulut: sort control reorders the school list", async ({ page }) => {
  await page.goto("/koulut");
  const firstLink = page.getByRole("tabpanel").getByRole("link").first();
  await expect(firstLink).toBeVisible();
  const azFirstHref = await firstLink.getAttribute("href");

  await page.getByRole("combobox", { name: "Järjestys" }).click();
  await page.getByRole("option", { name: "Eniten hakijoita" }).click();

  await expect(firstLink).toBeVisible();
  await expect(firstLink).not.toHaveAttribute("href", azFirstHref ?? "");
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
  await page.goto("/koulut/centria-ammattikorkeakoulu");
  await page.getByRole("link", { name: "2026 pisterajat" }).click();

  await expect(page).toHaveURL("/koulut/centria-ammattikorkeakoulu/pisterajat/");
  await expect(page.getByRole("heading", { name: "Centria-ammattikorkeakoulu pisterajat 2026" })).toBeVisible();
  await expect(page.getByText("Insinööri (AMK), konetekniikka, päivätoteutus / Kokkola")).toBeVisible();
  await expect(page.getByText("Todistusvalinta (YO)").first()).toBeVisible();
  await expect(page.getByText("91,00")).toBeVisible();

  // click can land before hydration, so retry until page 2 actually renders
  await expect(async () => {
    await page.getByRole("button", { name: "2" }).click();
    await expect(page.getByText("Insinööri (AMK), tekniikan yhteinen päivätoteutus / Kokkola")).toBeVisible({
      timeout: 1000,
    });
  }).toPass();
});

test("/koulut/:slug/pisterajat: shows every selection method for a programme", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/pisterajat/");

  await expect(page.getByText("Insinööri (AMK), konetekniikka, päivätoteutus / Kokkola")).toBeVisible();
  await expect(page.getByText("AMK-valintakoe", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Todistusvalinta (AMM)", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Todistusvalinta (YO)", { exact: true }).first()).toBeVisible();
});

test("/koulut/:slug/pisterajat: search filters programmes", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/pisterajat/");
  await expect(page.getByText("Insinööri (AMK), konetekniikka, päivätoteutus / Kokkola")).toBeVisible({
    timeout: 10000,
  });

  const search = page.getByPlaceholder("Hae toteutusta");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();

  await search.clear();
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).not.toBeVisible();
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  // "Hakijaa" column header renders only after skeletons are replaced by data
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
});
