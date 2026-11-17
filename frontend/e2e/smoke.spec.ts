import { expect, type Locator, type Page, test } from "@playwright/test";
import { DEFAULT_CUTOFF_YEAR } from "@/config/cutoffRounds";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import { CURRENT_PROGRAMME_ROUND } from "@/config/programmeRounds";
import { CURRENT_YEAR, statisticsRoundShortLabel, YEAR_OPTIONS } from "@/config/yearOptions";
import { numberFormat } from "@/lib/statistics";

test.describe.configure({ mode: "parallel" });

test.afterEach(async ({ page }) => {
  expect((await page.pageErrors()).map((error) => error.message)).toEqual([]);
});

const NAV_LABEL = "Päänavigointi";

// click can land before hydration, so retry without clicking an already-open drawer
async function openNavDrawer(page: Page) {
  const trigger = page.getByRole("button", { name: "avaa navigointi" });
  const nav = page.getByRole("navigation", { exact: true, name: NAV_LABEL });
  await expect(trigger).toBeVisible();
  await expect(async () => {
    if (!(await nav.isVisible())) {
      await expect(trigger).toBeVisible({ timeout: 1000 });
      await trigger.click();
    }
    await expect(nav).toBeVisible({ timeout: 1000 });
  }).toPass();
}

async function selectOption(page: Page, label: string, option: string) {
  const combobox = page.getByRole("combobox", { name: label });
  const optionToSelect = page.getByRole("option", { name: option, exact: true });
  await expect(async () => {
    if (!(await optionToSelect.isVisible())) {
      await combobox.click();
    }
    await expect(optionToSelect).toBeVisible({ timeout: 1000 });
  }).toPass();
  await optionToSelect.click();
  await expect(optionToSelect).toHaveCount(0);
}

// controlled inputs in SSR HTML can miss keystrokes before React hydrates
async function fillSearchUntil(search: Locator, query: string, verify: () => Promise<void>) {
  await expect(async () => {
    await search.clear();
    if (query) {
      await search.fill(query);
    }
    await verify();
  }).toPass({ timeout: 10000 });
}

async function selectTab(page: Page, name: string) {
  const tab = page.getByRole("tab", { name });
  await expect(async () => {
    if ((await tab.getAttribute("aria-selected")) !== "true") {
      await tab.click();
    }
    await expect(tab).toHaveAttribute("aria-selected", "true", { timeout: 1000 });
  }).toPass();
  return tab;
}

async function openAccordion(page: Page, name: string | RegExp, exact = false) {
  const trigger = page.getByRole("button", { exact, name });
  await expect(async () => {
    if ((await trigger.getAttribute("aria-expanded")) !== "true") {
      // @zag-js/accordion only handles TRIGGER.CLICK in the focused state; blur if focused pre-hydration so click re-fires focus
      await trigger.blur();
      await trigger.click();
    }
    await expect(trigger).toHaveAttribute("aria-expanded", "true", { timeout: 1000 });
  }).toPass();
  return trigger;
}

async function expectSelectedOption(page: Page, label: string, option: string) {
  await expect(page.getByRole("combobox", { name: label })).toContainText(option);
}

async function setFilterOption(page: Page, label: string, option: string, selected: boolean) {
  const expectedButton = page.getByRole("button", { exact: true, name: selected ? `${label} (1)` : label });
  await expect(async () => {
    if (!(await expectedButton.isVisible())) {
      await page.getByRole("option", { name: option, exact: true }).click();
    }
    await expect(expectedButton).toBeVisible({ timeout: 1000 });
  }).toPass();
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

async function openCalculator(page: Page) {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/todistusvalintalaskuri/");
  await expect(page.getByRole("heading", { name: `Todistusvalintalaskuri ${DEFAULT_CUTOFF_YEAR}` })).toBeVisible();
  await waitForCalculatorHydration(page);
  await expect(page.getByText("Pisterajoja ladataan…")).toHaveCount(0, { timeout: 30_000 });
}

async function openResultsAccordion(page: Page, name: RegExp) {
  await openAccordion(page, name);
  const item = page.getByRole("region", { name });
  await expect(item.getByRole("article").first()).toBeVisible({ timeout: 10000 });

  return item;
}

test("homepage loads and nav drawer opens", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      exact: true,
      name: "Katso yhteishaun hakijamäärät, pisterajat, koulutukset, koulut ja trendit.",
    }),
  ).toBeVisible();
  await openNavDrawer(page);
});

test("homepage quick links point to their pages", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("complementary", { name: "Yhteishaku kotinäytöllä" })).toHaveCount(0);
  await expect(page.getByRole("link", { exact: true, name: "Katso hakijan työkalut" })).toHaveAttribute(
    "href",
    "/hakijalle/",
  );
  await expect(page.getByRole("link", { exact: true, name: "olen opinto-ohjaaja" })).toHaveAttribute(
    "href",
    "/opolle/",
  );
  await expect(page.getByText("2027 toisen asteen yhteishakuun")).toBeVisible();
  await expect(page.getByText("Kevään 2027 ensimmäiseen yhteishakuun")).toHaveCount(0);

  await expect(page.getByRole("tabpanel").getByRole("link", { name: /^lukiot(\s|$)/ })).toHaveAttribute(
    "href",
    "/lukiot/",
  );
  await expect(page.getByRole("tabpanel").getByRole("link", { name: /^yo-kokeiden pisterajat(\s|$)/ })).toHaveAttribute(
    "href",
    "/yo-pisterajat/",
  );

  await selectTab(page, "Korkeakoulutus");
  await expect(page.getByText("Kevään 2027 ensimmäiseen yhteishakuun")).toBeVisible();
  await expect(page.getByText("2027 toisen asteen yhteishakuun")).toHaveCount(0);
  for (const [label, url] of [
    ["hakijamäärät", "/hakijamaarat/korkeakoulut/"],
    ["koulutukset", "/koulutukset/"],
    ["todistusvalintalaskuri", "/todistusvalintalaskuri/"],
    ["koulut", "/koulut/"],
  ] as const) {
    await expect(
      page.getByRole("tabpanel").getByRole("link", { name: new RegExp(`^${label}(\\s|$)`) }),
    ).toHaveAttribute("href", url);
  }
});

for (const [link, heading] of [
  ["Katso hakijan työkalut", "Hakijalle"],
  ["olen opinto-ohjaaja", "Opolle"],
] as const) {
  test(`${heading} tools are grouped by education level`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: link, exact: true }).click();
    await expect(page.getByRole("heading", { name: heading, level: 1 })).toBeVisible();
    await expect(
      page.getByRole("tabpanel", { name: "Toinen aste" }).getByRole("link", { name: /^lukiot/ }),
    ).toBeVisible();
    await selectTab(page, "Korkeakoulutus");
    await expect(
      page.getByRole("tabpanel", { name: "Korkeakoulutus" }).getByRole("link", { name: /^todistusvalintalaskuri/ }),
    ).toHaveAttribute("href", "/todistusvalintalaskuri/");
  });
}

test("opolle page links to site information and contact", async ({ page }) => {
  await page.goto("/opolle/");
  await expect(page.getByRole("heading", { name: "Tietoa tästä sivustosta" })).toBeVisible();
  await expect(page.getByRole("link", { name: /^anna palautetta/ })).toHaveAttribute("href", "/palaute/");
  await expect(page.getByRole("link", { name: /^ota yhteyttä/ })).toHaveAttribute(
    "href",
    "mailto:miko@kortelainen.dev",
  );
  await page.getByRole("link", { name: /^usein kysytyt kysymykset/ }).click();
  await expect(page).toHaveURL(/\/ukk\/$/);
  await expect(page.getByRole("button", { name: "Mistä sivulla näytettävä data on peräisin?" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Kuinka usein tiedot päivittyvät?" })).toBeVisible();
});

test("iPhone Safari users can dismiss the install tip and still find the guide in UKK", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperties(navigator, {
      maxTouchPoints: { value: 5 },
      platform: { value: "iPhone" },
      userAgent: {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
      },
    });
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const installTip = page.getByRole("complementary", { name: "Yhteishaku kotinäytöllä" });
  await expect(installTip).toBeVisible();
  await installTip.getByRole("button", { name: "Sulje kotinäyttövinkki" }).click();
  await expect(installTip).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("complementary", { name: "Yhteishaku kotinäytöllä" })).toHaveCount(0);

  await page.goto("/ukk/");
  await openAccordion(page, "Miten lisään yhteishaku.app-palvelun iPhonen Koti-valikkoon?");
  await page.getByRole("link", { name: "lyhyet ohjeet" }).click();

  await expect(page).toHaveURL("/asenna/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Lisää yhteishaku.app iPhonesi kotinäytölle." }),
  ).toBeVisible();
  await expect(page.getByRole("img", { name: /korostettu/ })).toHaveCount(4);
});

test("homepage hides the install guide in the iPhone standalone app", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperties(navigator, {
      maxTouchPoints: { value: 5 },
      platform: { value: "iPhone" },
      standalone: { value: true },
      userAgent: {
        value:
          "Mozilla/5.0 (iPhone; CPU iPhone OS 26_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Mobile/15E148 Safari/604.1",
      },
    });
  });
  await page.goto("/");

  await expect(page.getByRole("complementary", { name: "Yhteishaku kotinäytöllä" })).toHaveCount(0);
});

test("/oppaat: opens the AMK certificate-admission guide", async ({ page }) => {
  await page.goto("/oppaat/");
  await page.getByRole("link", { name: /Ammattikorkeakoulujen todistusvalinnan pisteytys/ }).click();

  await expect(page).toHaveURL(/\/oppaat\/ammattikorkeakoulujen-todistusvalinta\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Ammattikorkeakoulujen todistusvalinnan pisteytys" }),
  ).toBeVisible();
  await expect(page.getByText(/sinut huomioidaan automaattisesti molemmissa todistusvalintajonoissa/)).toBeVisible();
});

test("/oppaat: opens the university certificate-admission guide", async ({ page }) => {
  await page.goto("/oppaat/");
  await page.getByRole("link", { name: /Yliopistojen todistusvalintojen pisteytys/ }).click();

  await expect(page).toHaveURL(/\/oppaat\/yliopistojen-todistusvalinta\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Yliopistojen todistusvalintojen pisteytys ja kynnysehdot" }),
  ).toBeVisible();
});

test("404: unknown route renders error page", async ({ page }) => {
  const response = await page.goto("/ei-olemassa-sivu/");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "404" })).toBeVisible();
  await expect(page.getByText("Sivua ei löydy.")).toBeVisible();
});

test("nav links navigate to all pages", async ({ page }) => {
  const nav = page.getByRole("navigation", { exact: true, name: NAV_LABEL });

  for (const [label, url, heading] of [
    ["hakijamäärät", "/hakijamaarat/korkeakoulut/", "Korkeakoulujen hakijamäärät"],
    ["koulutukset", "/koulutukset/", "Koulutukset"],
    ["pistelaskuri", "/todistusvalintalaskuri/", `Todistusvalintalaskuri ${DEFAULT_CUTOFF_YEAR}`],
    ["pisterajat", "/pisterajat/", `Pisterajat ${DEFAULT_CUTOFF_YEAR}`],
    ["koulut", "/koulut/", "Koulut"],
    ["oma hakulista", "/oma-hakulista/", "Oma hakulista"],
    ["palaute", "/palaute/", "Palaute"],
    ["ukk", "/ukk/", "Usein kysytyt kysymykset"],
  ] as const) {
    await page.goto("/");
    await openNavDrawer(page);
    // anchored regex: nav link names are "label + description" concatenated, and short labels
    // like "koulut" are substrings of others ("koulutukset", "...koulutusvalinnan...")
    const escapedLabel = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await nav.getByRole("link", { name: new RegExp(`^${escapedLabel}(\\s|$)`) }).click();
    await expect(page).toHaveURL(url);
    await expect(page.getByRole("heading", { exact: true, level: 1, name: heading })).toBeVisible();
  }

  await page.getByRole("navigation", { name: "Alatunnisteen navigointi" }).getByRole("link", { name: "Mediakortti" }).click();
  await expect(page).toHaveURL("/mediakortti/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Mediakortti" })).toBeVisible();

  await page.getByRole("navigation", { name: "Alatunnisteen navigointi" }).getByRole("link", { name: "Tietosuojaseloste" }).click();
  await expect(page).toHaveURL("/tietosuojaseloste/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Tietosuojaseloste" })).toBeVisible();
  await expect(page.getByText("Rekisterinpitäjä")).toBeVisible();
  await expect(page.getByText("Tietolähteet")).toBeVisible();
});

test("/hakijamaarat: loads data and search filters results", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
  expect(await page.evaluate<number>("document.documentElement.scrollWidth")).toBeLessThanOrEqual(390);

  const search = page.getByPlaceholder("Hae koulua tai linjaa");
  await fillSearchUntil(search, "xxxnotexist", async () => {
    await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeVisible({ timeout: 1500 });
  });

  await fillSearchUntil(search, "", async () => {
    await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 1500 });
  });
});

test("/hakijamaarat: shows the update date and source below pagination", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  const source = page.getByText(
    /^Tiedot päivitetty: \d{1,2}\.\d{1,2}\.\d{4}\s*Lähde: Opetushallinnon tilastopalvelu Vipunen$/,
  );
  await expect(source).toBeVisible();
  const pagination = await page.getByRole("navigation", { name: "Sivutus" }).boundingBox();
  const details = await source.boundingBox();
  const footer = await page.getByRole("contentinfo").boundingBox();
  if (!pagination || !details || !footer) throw new Error("Expected pagination, source and footer to be visible");
  expect(details.y).toBeGreaterThanOrEqual(pagination.y + pagination.height);
  expect(footer.y).toBeGreaterThanOrEqual(details.y + details.height);
});

test("/todistusvalintalaskuri: searches active cutoffs", async ({ page }) => {
  await openCalculator(page);
  await expectSelectedOption(page, "Yhteishaku", `Kevään yhteishaku ${DEFAULT_CUTOFF_YEAR} pisterajat`);
  await expect(page.getByRole("button", { name: "Suodattimet (1)" })).toBeVisible();
  await openAccordion(page, /^Suodattimet/);
  await expect(page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" })).toBeDisabled();
  await expect(page.getByRole("checkbox", { name: "Vain AMK" })).not.toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Vain yliopistot" })).not.toBeChecked();

  const resultSearch = page.getByRole("textbox", { name: "Haku" });
  await resultSearch.fill("Turun yliopisto");
  await expect(page.getByText(/\d+ hakutulosta/)).toBeVisible();
  await expect(page.getByRole("article").getByText("Turun yliopisto").first()).toBeVisible();
  await expect(page.getByText("Tietojenkäsittely ja tietoliikenne").first()).toBeVisible();
  await expect(async () => {
    if (!(await page.getByText("Kauppa, hallinto ja oikeustieteet").first().isVisible())) {
      await page.getByRole("button", { name: "Näytä lisää" }).click();
    }
    await expect(page.getByText("Kauppa, hallinto ja oikeustieteet").first()).toBeVisible({ timeout: 1000 });
  }).toPass();
  await expect(page.getByRole("button", { name: /Humanistiset alat/ })).toHaveCount(0);
  await resultSearch.clear();

  await resultSearch.fill("Pedagogik (undervisning på svenska), pedagogie kandidat");
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article").getByText("Todistusvalinta, ensikertalaiset", { exact: true })).toBeVisible();
});

test("/todistusvalintalaskuri: switches to first-time applicant cutoffs", async ({ page }) => {
  await openCalculator(page);
  await openAccordion(page, /^Suodattimet/);
  const firstTimeApplicantCheckbox = page.getByRole("checkbox", {
    name: "Olen ensikertalainen",
  });
  const resultSearch = page.getByRole("textbox", { name: "Haku" });
  await resultSearch.fill("Pedagogik (undervisning på svenska), pedagogie kandidat");

  await expect(firstTimeApplicantCheckbox).toBeChecked();
  await expect(page.getByRole("article").getByText("Todistusvalinta, ensikertalaiset", { exact: true })).toBeVisible();
  await page.getByText("Olen ensikertalainen", { exact: true }).click();
  await expect(firstTimeApplicantCheckbox).not.toBeChecked();
  await expect(page.getByRole("article")).toHaveCount(1);
  await expect(page.getByRole("article").getByText("Todistusvalinta", { exact: true })).toBeVisible();
});

test("/todistusvalintalaskuri: filters university results and paginates a group", async ({ page }) => {
  await openCalculator(page);
  await openAccordion(page, /^Suodattimet/);
  await page.getByText("Vain yliopistot", { exact: true }).click();
  await expect(page.getByRole("checkbox", { name: "Vain yliopistot" })).toBeChecked();
  await expect(page.getByRole("button", { name: "Suodattimet (2)" })).toBeVisible();
  const humanistisetAccordion = await openResultsAccordion(page, /Humanistiset alat/);
  await expect(humanistisetAccordion.getByRole("article")).toHaveCount(20);
  await expect(humanistisetAccordion.getByText(/Näytetään 20 \/ \d+/)).toBeVisible();
  await expect(async () => {
    if ((await humanistisetAccordion.getByRole("article").count()) < 40) {
      await humanistisetAccordion.getByRole("button", { name: "Näytä lisää" }).click();
    }
    await expect(humanistisetAccordion.getByRole("article")).toHaveCount(40, { timeout: 1500 });
  }).toPass();
  await expect(
    humanistisetAccordion
      .getByRole("article")
      .getByText(/Todistusvalinta/)
      .first(),
  ).toBeVisible();
  await expect(humanistisetAccordion.getByRole("article").getByText("AMK-valintakoe", { exact: true })).toHaveCount(0);
});

test("/todistusvalintalaskuri: sorts grouped results", async ({ page }) => {
  await openCalculator(page);
  const tekniikkaAccordion = await openResultsAccordion(page, /Tekniikan alat/);
  await selectOption(page, "Järjestys", "Korkein pisteraja");
  await expectSelectedOption(page, "Järjestys", "Korkein pisteraja");
  await expect
    .poll(async () => {
      const cutoffScores = (
        await tekniikkaAccordion
          .getByRole("article")
          .getByText(/Pisteraja \(/)
          .locator("..")
          .allTextContents()
      ).map((text) => Number(text.replace(/^.*\)/, "").trim().replace(",", ".")));
      return (
        cutoffScores.length > 1 && cutoffScores.every((score, index) => index === 0 || cutoffScores[index - 1] >= score)
      );
    })
    .toBe(true);

  await selectOption(page, "Järjestys", "A-Ö");
  await expectSelectedOption(page, "Järjestys", "A-Ö");
  await expect
    .poll(async () => {
      const programmeNames = await tekniikkaAccordion
        .getByRole("article")
        .getByRole("heading", { level: 4 })
        .allTextContents();
      return (
        programmeNames.length > 1 &&
        programmeNames.every((name, index) => index === 0 || programmeNames[index - 1].localeCompare(name, "fi") <= 0)
      );
    })
    .toBe(true);
});

test("/todistusvalintalaskuri: switches selection methods", async ({ page }) => {
  await openCalculator(page);
  const tekniikkaAccordion = await openResultsAccordion(page, /Tekniikan alat/);
  await expect(
    tekniikkaAccordion.getByText("Todistusvalinta (YO), ensikertalaiset", { exact: true }).first(),
  ).toBeVisible();
  await page.getByRole("tab", { name: "AMM" }).click();
  await expect(
    page.getByRole("article").getByText("Todistusvalinta (AMM), ensikertalaiset", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByRole("article").getByText("Todistusvalinta (YO), ensikertalaiset", { exact: true }),
  ).toHaveCount(0);
});

test("/todistusvalintalaskuri: compares calculated YO points with cutoffs", async ({ page }) => {
  await openCalculator(page);
  await selectOption(page, "Aine 1", "Suomi äidinkielenä");
  await selectOption(page, "Aineen 1 arvosana", "M");
  await selectOption(page, "Aine 2", "Matematiikka, lyhyt");
  await selectOption(page, "Aineen 2 arvosana", "M");
  await selectOption(page, "Aine 3", "Toinen kotimainen kieli, keskipitkä");
  await selectOption(page, "Aineen 3 arvosana", "C");
  await selectOption(page, "Aine 4", "Filosofia");
  await selectOption(page, "Aineen 4 arvosana", "E");
  await page.getByRole("button", { name: "Poista aine 5" }).click();

  await page.getByRole("button", { name: "Laske pisteet" }).click();

  await openAccordion(page, /^Suodattimet/);
  await expect(page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" })).toBeEnabled();

  const tekniikkaAccordion = await openResultsAccordion(page, /Tekniikan alat/);
  await expect(tekniikkaAccordion.getByText(/Pisteraja \(/).first()).toBeVisible();
  await expect(tekniikkaAccordion.getByRole("article").getByText("Pisteesi").first()).toBeVisible();
  await expect(
    tekniikkaAccordion
      .getByRole("article")
      .getByText(/^106$/)
      .first(),
  ).toBeVisible();
});

test("/todistusvalintalaskuri: filters qualified and sector results and persists filters across reload", async ({
  page,
}) => {
  await openCalculator(page);
  await selectOption(page, "Aine 1", "Suomi äidinkielenä");
  await selectOption(page, "Aineen 1 arvosana", "M");
  await selectOption(page, "Aine 2", "Matematiikka, lyhyt");
  await selectOption(page, "Aineen 2 arvosana", "M");
  for (let row = 5; row > 2; row -= 1) {
    await page.getByRole("button", { name: `Poista aine ${row}` }).click();
  }
  await page.getByRole("button", { name: "Laske pisteet" }).click();

  await openAccordion(page, /^Suodattimet/);
  const qualifiedCheckbox = page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" });
  const onlyAmkCheckbox = page.getByRole("checkbox", { name: "Vain AMK" });
  const onlyUniversityCheckbox = page.getByRole("checkbox", { name: "Vain yliopistot" });

  await qualifiedCheckbox.waitFor({ state: "visible" });
  await page.getByText("Vain kohteet, joihin pisteesi riittävät", { exact: true }).click();
  await expect(qualifiedCheckbox).toBeChecked();
  await expect(page.getByRole("button", { name: "Suodattimet (2)" })).toBeVisible();

  await page.getByText("Vain AMK", { exact: true }).click();
  await expect(page.getByRole("button", { name: "Suodattimet (3)" })).toBeVisible();
  await expect(onlyAmkCheckbox).toBeChecked();
  await expect(onlyUniversityCheckbox).not.toBeChecked();

  const tekniikkaAccordion = await openResultsAccordion(page, /Tekniikan alat/);
  await expect(tekniikkaAccordion.getByText("Pisteet riittävät").first()).toBeVisible();
  await expect(tekniikkaAccordion.getByText("Pisteesi eivät riitä")).toHaveCount(0);
  await expect(tekniikkaAccordion.getByText("Todistusvalinta (YO), ensikertalaiset").first()).toBeVisible();
  await expect(tekniikkaAccordion.getByText("Todistusvalinta, ensikertalaiset", { exact: true })).toHaveCount(0);

  await page.getByText("Vain yliopistot", { exact: true }).click();
  await expect(onlyUniversityCheckbox).toBeChecked();
  await expect(onlyAmkCheckbox).not.toBeChecked();
  await expect(page.getByRole("button", { name: "Suodattimet (3)" })).toBeVisible();
  await expect(tekniikkaAccordion.getByText("Todistusvalinta (YO), ensikertalaiset")).toHaveCount(0);

  await page.reload();
  await waitForCalculatorHydration(page);
  await openAccordion(page, /^Suodattimet/);
  await expect(page.getByRole("checkbox", { name: "Olen ensikertalainen" })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Vain yliopistot" })).toBeChecked();
  await expect(page.getByRole("checkbox", { name: "Vain AMK" })).not.toBeChecked();
  await page.getByRole("button", { name: "Laske pisteet" }).click();
  await expect(page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" })).toBeChecked();
  await expect(page.getByRole("button", { name: "Suodattimet (3)" })).toBeVisible();
});

for (const subject of ["Suomi toisena kielenä ja kirjallisuus (S2)", "Ruotsi toisena kielenä ja kirjallisuus (R2)"]) {
  test(`/todistusvalintalaskuri: calculates and restores ${subject}`, async ({ page }) => {
    await openCalculator(page);
    await selectOption(page, "Aine 1", subject);
    await selectOption(page, "Aineen 1 arvosana", "M");
    for (let row = 5; row > 1; row -= 1) {
      await page.getByRole("button", { name: `Poista aine ${row}` }).click();
    }
    await page.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }).click();
    await openAccordion(page, /^Suodattimet/);
    await expect(page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" })).toBeEnabled();

    await page.reload();
    await waitForCalculatorHydration(page);
    await expectSelectedOption(page, "Aine 1", subject);
    await expectSelectedOption(page, "Aineen 1 arvosana", "M");
    await page.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }).click();
    await openAccordion(page, /^Suodattimet/);
    await expect(page.getByRole("checkbox", { name: "Vain kohteet, joihin pisteesi riittävät" })).toBeEnabled();
  });
}

test("/todistusvalintalaskuri: restores only successfully submitted YO and AMM forms", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("pistelaskuri-storage-initialized")) return;

    sessionStorage.setItem("pistelaskuri-storage-initialized", "true");
    localStorage.setItem(
      "yhteishaku:pistelaskuri",
      JSON.stringify({ version: 1, amm: { scale: "bogus", grades: [1, 1, 1], keskiarvoInput: "2" } }),
    );
  });
  await page.goto("/todistusvalintalaskuri/");
  await waitForCalculatorHydration(page);

  await selectOption(page, "Aine 1", "Suomi äidinkielenä");
  await selectOption(page, "Aineen 1 arvosana", "M");
  await selectOption(page, "Aine 2", "Englanti, pitkä");
  await selectOption(page, "Aineen 2 arvosana", "E");
  await page.getByRole("button", { name: "Poista aine 5" }).click();
  await page.getByRole("button", { name: "Poista aine 4" }).click();
  await page.getByRole("button", { name: "Poista aine 3" }).click();
  await page.getByRole("button", { name: "Laske pisteet" }).click();
  await expect(page.getByRole("button", { name: "Laske pisteet" })).toBeEnabled();

  await page.getByRole("tab", { name: "AMM" }).click();
  await selectOption(page, "Viestintä- ja vuorovaikutusosaaminen", "3");
  await selectOption(page, "Matemaattis-luonnontieteellinen osaaminen", "3");
  await selectOption(page, "Yhteiskunta- ja työelämäosaaminen", "3");
  await page.getByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" }).fill("3,96");
  await page.getByRole("button", { name: "Laske pisteet" }).click();
  await expect(page.getByRole("button", { name: "Laske pisteet" })).toBeEnabled();

  await page.reload();

  await expect(page.getByRole("tab", { name: "YO" })).toHaveAttribute("aria-selected", "true");
  await expectSelectedOption(page, "Aine 1", "Suomi äidinkielenä");
  await expectSelectedOption(page, "Aineen 1 arvosana", "M");
  await expectSelectedOption(page, "Aine 2", "Englanti, pitkä");
  await expectSelectedOption(page, "Aineen 2 arvosana", "E");

  await page.getByRole("button", { name: "+ Lisää aine" }).click();
  await expect(page.getByRole("combobox", { name: "Aine 3" })).toBeVisible();
  await selectOption(page, "Aineen 1 arvosana", "L");
  await page.reload();
  await expectSelectedOption(page, "Aineen 1 arvosana", "M");
  await expect(page.getByRole("combobox", { name: "Aine 3" })).toHaveCount(0);

  await page.getByRole("tab", { name: "AMM" }).click();
  await expectSelectedOption(page, "Viestintä- ja vuorovaikutusosaaminen", "3");
  await expectSelectedOption(page, "Matemaattis-luonnontieteellinen osaaminen", "3");
  await expectSelectedOption(page, "Yhteiskunta- ja työelämäosaaminen", "3");
  await expect(page.getByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" })).toHaveValue("3,96");
});

test("/koulutukset: loads data and search filters results", async ({ page }) => {
  await page.goto("/koulutukset/");
  await expect(page.getByText("Hae opintopolussa").first()).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Etsi koulutuksia");
  await fillSearchUntil(search, "xxxnotexist", async () => {
    await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeVisible({ timeout: 1500 });
  });
  await expect(page.getByText("0 tulosta", { exact: true })).toBeVisible();

  await fillSearchUntil(search, "", async () => {
    await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).not.toBeVisible({ timeout: 1500 });
  });
});

test("/koulutukset: filters by sektori, koulutusaste and paginates results", async ({ page }) => {
  await page.goto("/koulutukset/");
  await expect(page.getByText("Hae opintopolussa").first()).toBeVisible({ timeout: 10000 });

  const resultCount = page.getByText(/^\d[\d\s]* tulos(?:ta)?$/);
  const parseCount = async () => Number.parseInt(((await resultCount.textContent()) ?? "").replace(/\s+/g, ""), 10);
  const initialTotal = await parseCount();
  expect(initialTotal).toBeGreaterThan(20);

  const firstCard = page
    .getByRole("listitem")
    .filter({ has: page.getByRole("button", { name: "Tallenna" }) })
    .first();
  const page1Text = (await firstCard.textContent()) ?? "";
  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(firstCard).not.toHaveText(page1Text, { timeout: 1000 });
  }).toPass();

  await page.getByRole("button", { name: "Sektori", exact: true }).click();
  await setFilterOption(page, "Sektori", "Yliopisto", true);
  await expect.poll(parseCount).toBeLessThan(initialTotal);
  const yoTotal = await parseCount();

  await page.getByRole("button", { name: "Koulutusaste", exact: true }).click();
  await setFilterOption(page, "Koulutusaste", "Ylempi", true);
  await expect.poll(parseCount).toBeLessThan(yoTotal);
});

test("/koulutukset: joint application switcher shows the other wave", async ({ page }) => {
  await page.goto("/koulutukset/");
  await expect(
    page.getByText("Korkeakoulujen kevään 2027 ensimmäisessä yhteishaussa olevat toteutukset."),
  ).toBeVisible();
  await expectSelectedOption(page, "Yhteishaku", "Kevään 1. yhteishaku 2027");

  await selectOption(page, "Yhteishaku", "Kevään 2. yhteishaku 2027");
  await expect(page.getByText("Korkeakoulujen kevään 2027 toisessa yhteishaussa olevat toteutukset.")).toBeVisible();
  await expect(page.getByText("Hae opintopolussa").first()).toBeVisible();
});

test("/hakijamaarat: joint application switcher fetches different data", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  await openAccordion(page, "Kunta");
  await setFilterOption(page, "Kunta", "Espoo", true);

  await page.getByRole("combobox", { name: "Yhteishaku" }).click();
  const [response] = await Promise.all([
    page.waitForResponse((r) => r.url().includes("hakijamaarat-2025-syksy.json")),
    page.getByRole("option", { name: "Syksyn yhteishaku 2025" }).click(),
  ]);
  expect(response.status()).toBe(200);
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByRole("button", { name: "Kunta", exact: true })).toBeVisible();
  await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).not.toBeVisible();
});

test("/hakijamaarat: koulutusala filter narrows results", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
  const resultCount = page.getByText(/^\d+ hakutulos(?:ta)?$/);
  const getResultCount = async () => Number.parseInt((await resultCount.textContent()) ?? "", 10);
  const initialCount = await getResultCount();
  expect(initialCount).toBeGreaterThan(0);

  // each result card renders one "Vertaile" button, so they double as a result counter
  const compareButtons = page.getByRole("button", { name: "Vertaile", exact: true });
  await expect(compareButtons).toHaveCount(10);

  await openAccordion(page, "Koulutusala");
  await setFilterOption(page, "Koulutusala", "Humanistiset alat", true);
  await expect.poll(getResultCount).toBeLessThan(initialCount);
  await expect(compareButtons.first()).toBeVisible();

  // deselect → unfiltered results return
  await setFilterOption(page, "Koulutusala", "Humanistiset alat", false);
  await expect(compareButtons).toHaveCount(10);
  await expect.poll(getResultCount).toBe(initialCount);
});

test("/hakijamaarat: sorts results by acceptance rate", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });
  await page.getByRole("combobox", { name: "Yhteishaku" }).click();
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("hakijamaarat-2026-kevat.json")),
    page.getByRole("option", { name: "Kevään yhteishaku 2026", exact: true }).click(),
  ]);
  const cards = page.getByRole("listitem").filter({ has: page.getByRole("button", { name: "Vertaile", exact: true }) });
  await expect(cards.first()).toBeVisible({ timeout: 10000 });

  await selectOption(page, "Järjestys", "Korkein sisäänpääsyprosentti");
  await expect(cards.first()).toContainText("Insinööri (ylempi AMK), ajoneuvotekniikka");

  await selectOption(page, "Järjestys", "Matalin sisäänpääsyprosentti");
  await expect(cards.first()).toContainText("Näyttelijäntaide, suomenkielinen");
});

test("/hakijamaarat: paginates and filters by sektori, koulutusaste and kieli", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  const cards = page.getByRole("listitem").filter({ has: page.getByRole("button", { name: "Vertaile", exact: true }) });
  const resultCount = page.getByText(/^\d+ hakutulos(?:ta)?$/);
  const parseCount = async () => Number.parseInt((await resultCount.textContent()) ?? "", 10);
  const initialTotal = await parseCount();
  const page1FirstCard = (await cards.first().textContent()) ?? "";

  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(cards.first()).not.toHaveText(page1FirstCard, { timeout: 1000 });
  }).toPass();

  await page.getByRole("button", { name: "Sektori", exact: true }).click();
  await setFilterOption(page, "Sektori", "Ammattikorkeakoulu", true);
  await expect.poll(parseCount).toBeLessThan(initialTotal);
  const amkTotal = await parseCount();

  await page.getByRole("button", { name: "Koulutusaste", exact: true }).click();
  await setFilterOption(page, "Koulutusaste", "Ylempi korkeakouluaste", true);
  await expect.poll(parseCount).toBeLessThan(amkTotal);
  const ylempiTotal = await parseCount();

  await page.getByRole("button", { name: "Kieli", exact: true }).click();
  await setFilterOption(page, "Kieli", "vain englanti", true);
  await expect.poll(parseCount).toBeLessThan(ylempiTotal);
});

test("/hakijamaarat: shows error alert when year fetch fails", async ({ page }) => {
  await page.route("**/hakijamaarat-2025-syksy.json", (route) => route.fulfill({ status: 500, body: "Server error" }));
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  await selectOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  await expect(page.getByText("Jotain meni vikaan, yritä uudelleen.")).toBeVisible({ timeout: 10000 });
});

test("/koulutukset: school listbox filter narrows results", async ({ page }) => {
  await page.goto("/koulutukset/");
  await expect(page.getByText("Hae opintopolussa").first()).toBeVisible({ timeout: 10000 });
  const cards = page.getByRole("listitem").filter({ has: page.getByRole("button", { name: "Tallenna" }) });
  const resultCount = page.getByText(/^\d[\d\s]* tulos(?:ta)?$/);
  const initialCount = await resultCount.textContent();
  const initialCards = await cards.allTextContents();

  // filters live inside collapsed accordion sections — open "Koulu" to reach the school listbox
  await openAccordion(page, "Koulu", true);
  const options = page.getByRole("option");
  await expect(options.first()).toBeVisible({ timeout: 10000 });
  const schoolName = (await options.allTextContents())
    .map((name) => name.trim())
    .find((name) => initialCards.every((card) => !card.includes(name)));
  if (!schoolName) throw new Error("Expected a school outside the first result page");

  const schoolLinks = cards.getByRole("link", { name: schoolName, exact: true });
  await setFilterOption(page, "Koulu", schoolName, true);
  await expect(resultCount).not.toHaveText(initialCount ?? "");
  await expect
    .poll(async () => {
      const cardCount = await cards.count();
      return cardCount > 0 && (await schoolLinks.count()) === cardCount;
    })
    .toBe(true);

  await setFilterOption(page, "Koulu", schoolName, false);
  await expect(resultCount).toHaveText(initialCount ?? "");
  await expect(schoolLinks).toHaveCount(0);
});

test("/koulutukset: card link opens ala pisterajat page", async ({ page }) => {
  await page.goto("/koulutukset/");
  const search = page.getByPlaceholder("Etsi koulutuksia");
  // every card shows the same link text, so wait for the filtered card before clicking
  const card = page.getByRole("listitem").filter({ hasText: "Aviation Business" });
  await fillSearchUntil(search, "Aviation Business", async () => {
    await expect(card.getByText("Katso alan pisterajat")).toBeVisible({ timeout: 1500 });
  });

  await card.getByText("Katso alan pisterajat").click();
  await expect(page).toHaveURL("/pisterajat/kauppa-hallinto-ja-oikeustieteet/");
  await expect(
    page.getByRole("heading", { name: `Kauppa, hallinto ja oikeustieteet pisterajat ${DEFAULT_CUTOFF_YEAR}` }),
  ).toBeVisible();
});

test("/koulutukset: saving a card lists it on /oma-hakulista and unsaving clears it", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("favorites-storage-initialized")) return;

    sessionStorage.setItem("favorites-storage-initialized", "true");
    localStorage.setItem("yhteishaku:tallennetut", "{}");
  });
  await page.goto("/koulutukset/");
  await expect(page.getByText("Hae opintopolussa").first()).toBeVisible({ timeout: 10000 });

  const removeFavorite = page.getByRole("button", { name: "Poista tallennetuista" }).first();
  // click can land before hydration, so retry without toggling an already-saved card
  await expect(async () => {
    if (!(await removeFavorite.isVisible())) {
      await page.getByRole("button", { name: "Tallenna" }).first().click();
    }
    await expect(removeFavorite).toBeVisible({ timeout: 1000 });
  }).toPass();

  await expect(page.getByText("Koulutus lisätty omalle hakulistalle.", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Näytä", exact: true }).click();
  await expect(page).toHaveURL(/\/oma-hakulista\/$/);
  await expect(page.getByText("Ei vielä tallennettuja koulutuksia.")).not.toBeVisible();
  await expect(page.getByRole("button", { name: "Poista tallennetuista" })).toHaveCount(1);

  await page.getByRole("button", { name: "Poista tallennetuista" }).click();
  await expect(page.getByText("Ei vielä tallennettuja koulutuksia.")).toBeVisible();
});

test("/oma-hakulista: reordering moves a card and persists after reload", async ({ page }) => {
  await page.addInitScript(() => {
    if (sessionStorage.getItem("favorites-storage-initialized")) return;

    sessionStorage.setItem("favorites-storage-initialized", "true");
    localStorage.setItem(
      "yhteishaku:tallennetut",
      JSON.stringify([
        {
          toteutusOid: "1.2.246.562.20.00000000000000001",
          oppilaitosNimi: { fi: "Esimerkkikoulu" },
          toteutusNimi: { fi: "Tietojenkäsittelytiede" },
          kunnat: ["Helsinki"],
          koulutusalat: [],
        },
        {
          toteutusOid: "1.2.246.562.20.00000000000000002",
          oppilaitosNimi: { fi: "Toinen koulu" },
          toteutusNimi: { fi: "Kauppatieteet" },
          kunnat: ["Tampere"],
          koulutusalat: [],
        },
      ]),
    );
  });
  await page.goto("/oma-hakulista/");

  const cards = page.locator("li");
  await expect(cards.first()).toContainText("Tietojenkäsittelytiede");
  await expect(page.getByRole("button", { name: "Siirrä ylöspäin" }).first()).toBeDisabled();
  await expect(page.getByRole("button", { name: "Siirrä alaspäin" }).last()).toBeDisabled();

  await page.getByRole("button", { name: "Siirrä alaspäin" }).first().click();
  await expect(cards.first()).toContainText("Kauppatieteet");

  await page.reload();
  await expect(cards.first()).toContainText("Kauppatieteet");
});

test("/oma-hakulista: sharing downloads an image of the list", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "yhteishaku:tallennetut",
      JSON.stringify([
        {
          toteutusOid: "1.2.246.562.20.00000000000000001",
          oppilaitosNimi: { fi: "Esimerkkikoulu" },
          toteutusNimi: { fi: "Tietojenkäsittelytiede" },
          kunnat: ["Helsinki"],
          koulutusalat: [],
        },
      ]),
    );
  });
  await page.goto("/oma-hakulista/");
  await expect(page.getByText("Tietojenkäsittelytiede")).toBeVisible();

  // headless chromium has no navigator.share, so the image is downloaded instead
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Jaa tämä hakulista" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("oma-hakulista.jpg");
  await expect(page.getByRole("button", { name: "Kuva ladattu" })).toBeVisible();
});

test("/palaute: submits feedback and shows thank you message", async ({ page }) => {
  // formsubmit.co is a third-party form backend — stub it so its downtime can't fail this suite
  await page.route("https://formsubmit.co/**", (route) =>
    route.fulfill({ status: 200, contentType: "application/json", body: "{}" }),
  );

  await page.goto("/palaute/");
  await expect(page.getByRole("heading", { name: "Palaute" })).toBeVisible();

  const thanks = page.getByText("Kiitos palautteesta!");
  await expect(async () => {
    if (!(await thanks.isVisible())) {
      await page.getByPlaceholder("Kirjoita palautteesi tähän...").fill("Testipalaute");
      await page.getByRole("button", { name: "Lähetä" }).click();
    }
    await expect(thanks).toBeVisible({ timeout: 1000 });
  }).toPass();
});

test("/vertaile: selecting two hakukohde on /hakijamaarat opens side-by-side comparison", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(page.getByText("Hakijat").first()).toBeVisible({ timeout: 10000 });

  // prerendered HTML ignores clicks until React hydrates, so early clicks can be lost; retry until both register
  await expect(async () => {
    if ((await page.getByRole("button", { name: "Valittu ✓" }).count()) < 2) {
      await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
    }
    await expect(page.getByRole("button", { name: "Valittu ✓" })).toHaveCount(2, { timeout: 500 });
  }).toPass({ timeout: 10000 });

  await page.getByRole("link", { name: "Vertaile" }).click();
  await expect(page).toHaveURL(new RegExp(`/vertaile/\\?a=.+&b=.+&vuosi=${CURRENT_YEAR}&vuosi_b=${CURRENT_YEAR}$`));
  await page.reload();
  await expect(page.getByRole("heading", { name: "Vertailu" })).toBeVisible();
  await expect(page.getByText("Hakijapaine", { exact: true }).first()).toBeVisible({ timeout: 10000 });
  await expect(page.getByText("Kaikki hakijat")).toHaveCount(2);

  // share the comparison: headless chromium has no navigator.share, so the clipboard fallback runs
  await page.context().grantPermissions(["clipboard-write"]);
  await page.getByRole("button", { name: "Jaa tämä vertailu" }).click();
  // the label flips only after clipboard writeText resolves, so this asserts the copy succeeded
  await expect(page.getByRole("button", { name: "Linkki kopioitu" })).toBeVisible();
});

test("/vertaile: compares hakukohteet from different yhteishaku rounds", async ({ page }) => {
  await page.goto("/hakijamaarat/korkeakoulut/");
  await expect(async () => {
    await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
    await expect(page.getByRole("button", { name: "Valittu ✓" })).toHaveCount(1, { timeout: 500 });
  }).toPass({ timeout: 10000 });
  await selectOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  await expect(page.getByRole("button", { name: "Vertaile", exact: true }).first()).toBeVisible();
  await page.getByRole("button", { name: "Vertaile", exact: true }).first().click();
  await page.getByRole("link", { name: "Vertaile" }).click();
  await expect(page).toHaveURL(/vuosi=2026_syksy&vuosi_b=2025_syksy$/);
  await expect(page.getByRole("table", { name: "Hakukohteiden vertailu" })).toBeVisible();
  await expect(page.getByText("syksy 2026", { exact: true })).toBeVisible();
  await expect(page.getByText("syksy 2025", { exact: true })).toBeVisible();
  const oldLink = new URL(page.url());
  oldLink.searchParams.set("b", oldLink.searchParams.get("a") ?? "");
  oldLink.searchParams.delete("vuosi_b");
  await page.goto(oldLink.toString());
  await expect(page.getByText("syksy 2026", { exact: true })).toHaveCount(2);
});

test("/koulut: switches which yhteishaku hakijamäärät are shown", async ({ page }) => {
  await page.goto("/koulut/");
  const aalto = page.getByRole("tabpanel").getByRole("link", { name: /^Aalto-yliopisto(\s|$)/ });
  await expect(page.getByRole("combobox", { name: "Yhteishaku" })).toContainText("Syksyn yhteishaku 2026");
  await expect(aalto).toHaveAccessibleName(/Hakijat – Ensisijaiset hakijat –/);
  await expect(aalto.getByText("alle 5")).toHaveCount(0);

  await selectOption(page, "Yhteishaku", "Kevään yhteishaku 2026");

  await expect(aalto.getByText(numberFormat.format(23476))).toBeVisible();
  await expect(aalto.getByText(numberFormat.format(9742))).toBeVisible();
});

test("/koulut: lists schools by sector and switches tabs", async ({ page }) => {
  await page.goto("/koulut/");
  await expect(page.getByRole("heading", { name: "Koulut" })).toBeVisible();

  await expect(page.getByRole("tabpanel").getByRole("link").first()).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("Sisäänpääsyprosentti").first()).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("Opiskelijapalaute (ka.)").first()).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("3,92 / 5").first()).toBeVisible();

  await page.getByRole("tab", { name: "Ammattikorkeakoulut" }).click();
  await expect(page.getByRole("tabpanel").getByRole("link").first()).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("Opiskelijapalaute (ka.)").first()).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("5,40 / 7").first()).toBeVisible();
});

test("/koulut: sorts university and AMK schools by feedback average", async ({ page }) => {
  await page.goto("/koulut/");
  const firstLink = page.getByRole("tabpanel").getByRole("link").first();

  await page.getByRole("combobox", { name: "Järjestys" }).click();
  await page.getByRole("option", { name: "Korkein keskiarvo" }).click();

  await expect(firstLink).toHaveAttribute("href", "/koulut/lappeenrannan-lahden-teknillinen-yliopisto-lut/");

  await page.getByRole("tab", { name: "Ammattikorkeakoulut" }).click();
  await expect(firstLink).toHaveAttribute("href", "/koulut/lapin-ammattikorkeakoulu/");
});

test("/koulut/:slug: selecting a school opens its detail page", async ({ page }) => {
  await page.goto("/koulut/");
  await page.getByRole("tab", { name: "Ammattikorkeakoulut" }).click();

  await page
    .getByRole("tabpanel")
    .getByRole("link", { name: /^Centria-ammattikorkeakoulu(\s|$)/ })
    .click();

  await expect(page).toHaveURL("/koulut/centria-ammattikorkeakoulu/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Centria-ammattikorkeakoulu" })).toBeVisible();
});

test("/koulut/:slug: shows Yhteishaku 2027 tab and equal-width 50/50 tabs on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/koulut/centria-ammattikorkeakoulu/");

  const tabList = page.getByRole("tablist", { name: "Centria-ammattikorkeakoulu: tiedot" });
  const programTab = tabList.getByRole("tab", { name: `Yhteishaku ${CURRENT_PROGRAMME_ROUND.slice(0, 4)}` });
  const statsTab = tabList.getByRole("tab", { name: "Hakijamäärät" });
  await expect(programTab).toHaveAttribute("aria-selected", "true");
  await expect(statsTab).toBeVisible();

  const [listBox, programBox, statsBox] = await Promise.all([
    tabList.boundingBox(),
    programTab.boundingBox(),
    statsTab.boundingBox(),
  ]);
  if (!listBox || !programBox || !statsBox) throw new Error("Expected tablist and both tabs to be visible");
  expect(Math.abs(programBox.width - statsBox.width)).toBeLessThanOrEqual(2);
  expect(Math.abs(programBox.width + statsBox.width - listBox.width)).toBeLessThanOrEqual(2);
});

test("/koulut/:slug: paginates Yhteishaku 2027 programmes", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/");
  await expect(page.getByText(/Bachelor of Engineering, Chemical Engineering/)).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(
      page.getByText(/Bachelor of Business Administration, Business Management and Marketing/),
    ).toBeVisible({ timeout: 1000 });
  }).toPass();
});

test("/koulut/:slug/opiskelijapalautteet: opens AMK feedback", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/");
  await page.getByRole("link", { name: "Opiskelijapalautteet" }).click();

  await expect(page).toHaveURL("/koulut/centria-ammattikorkeakoulu/opiskelijapalautteet/");
  await expect(
    page.getByRole("heading", {
      exact: true,
      level: 1,
      name: "Centria-ammattikorkeakoulu opiskelijapalautteet",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Vuoden 2025 opiskelijapalautteen vastauksien keskiarvot koulutusaloittain."),
  ).toBeVisible();
  await expect(page.getByText("Ammattikorkeakoulujen opiskelijapalaute (AVOP).")).toBeVisible();
  await expect(page.getByText("5,40 / 7", { exact: true })).toBeVisible();
});

test("/koulut/:slug: switches which yhteishaku hakijamäärät are shown", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/");
  await selectTab(page, "Hakijamäärät");

  await expect(page.getByRole("combobox", { name: "Yhteishaku" })).toContainText("Syksyn yhteishaku 2026");
  await expect(page.getByRole("tabpanel").getByText("Sosionomi (AMK), monimuotototeutus / Kokkola")).toBeVisible();

  await selectOption(page, "Yhteishaku", "Kevään yhteishaku 2026");

  await expect(page.getByRole("tabpanel").getByText("Sosionomi (AMK), monimuotototeutus / Ylivieska")).toBeVisible();
  await expect(page.getByRole("tabpanel").getByText("Sosionomi (AMK), monimuotototeutus / Kokkola")).toHaveCount(0);
});

test("/koulut/:slug: switches detail tab and opens feedback", async ({ page }) => {
  await page.goto("/koulut/jyvaskylan-yliopisto/");
  await selectTab(page, "Hakijamäärät");

  await expect(page.getByRole("tabpanel").getByText("Hakijat").first()).toBeVisible();
  await page.getByRole("link", { name: "Opiskelijapalautteet" }).click();

  await expect(page).toHaveURL("/koulut/jyvaskylan-yliopisto/opiskelijapalautteet/");
  await expect(
    page.getByRole("heading", { exact: true, level: 1, name: "Jyväskylän yliopisto opiskelijapalautteet" }),
  ).toBeVisible();
  await expect(
    page.getByText("Vuoden 2025 opiskelijapalautteen vastauksien keskiarvot koulutusaloittain."),
  ).toBeVisible();
  await expect(page.getByText("3,97 / 5", { exact: true })).toBeVisible();
});

test("/koulut/:slug/pisterajat: shows complete current-round programme cutoff cards", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/");
  await page.getByRole("main").getByRole("link", { name: "Pisterajat", exact: true }).click();

  await expect(page).toHaveURL("/koulut/centria-ammattikorkeakoulu/pisterajat/");
  await expect(
    page.getByRole("heading", {
      name: `Centria-ammattikorkeakoulu pisterajat ${DEFAULT_CUTOFF_YEAR}`,
    }),
  ).toBeVisible();
  await expect(
    page.getByText("Yhteishaun valintakokeiden ja todistusvalinnan alimmat hyväksytyt pisteet aloittain."),
  ).toBeVisible();
  await expect(page.getByRole("combobox", { name: "Järjestys" })).toHaveCount(0);
  const search = page.getByRole("textbox", { name: "Hae toteutusta" });
  const round = page.getByRole("combobox", { name: "Hakukierros" });
  await expect(round).toBeVisible();
  expect((await round.boundingBox())?.height).toBe((await search.boundingBox())?.height);
  await expect(page.getByRole("button", { name: "Kauppa, hallinto ja oikeustieteet" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Tekniikan alat" })).toBeVisible();

  await openAccordion(page, "Kauppa, hallinto ja oikeustieteet");
  const bba = "Bachelor of Business Administration (BBA), Business Management, blended learning / Kokkola";
  await expect(page.getByRole("heading", { name: bba })).toBeVisible();
  await expect(page.getByText("AMK-Valintakoe").first()).toBeVisible();
  await expect(page.getByText("25,7")).toBeVisible();
});

test("/koulut/:slug/pisterajat: shows every selection method for a programme", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/pisterajat/");

  await openAccordion(page, "Kauppa, hallinto ja oikeustieteet");
  await expect(page.getByText("AMK-Valintakoe", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Todistusvalinta (AMM)", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("Todistusvalinta (YO)", { exact: true }).first()).toBeVisible();
});

test("/koulut/:slug/pisterajat: search filters programmes", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/pisterajat/");
  await openAccordion(page, "Kauppa, hallinto ja oikeustieteet");
  await expect(
    page.getByText("Bachelor of Business Administration (BBA), Business Management, blended learning / Kokkola"),
  ).toBeVisible({ timeout: 10000 });

  const search = page.getByPlaceholder("Hae toteutusta");
  await fillSearchUntil(search, "xxxnotexist", async () => {
    await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeVisible({ timeout: 1500 });
  });

  await fillSearchUntil(search, "", async () => {
    await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).not.toBeVisible({ timeout: 1500 });
  });
});

test("/koulut/:slug/pisterajat: switches which hakukierros is shown", async ({ page }) => {
  await page.goto("/koulut/centria-ammattikorkeakoulu/pisterajat/");
  await openAccordion(page, "Kauppa, hallinto ja oikeustieteet");

  await expect(page.getByText("Tradenomi (AMK), liiketalous, monimuotototeutus / Pietarsaari")).not.toBeVisible();

  await selectOption(page, "Hakukierros", "Syksyn yhteishaku 2024");
  await openAccordion(page, "Kauppa, hallinto ja oikeustieteet");

  await expect(page.getByRole("heading", { name: "Centria-ammattikorkeakoulu pisterajat 2024" })).toBeVisible();
  await expect(page.getByText("Tradenomi (AMK), liiketalous, monimuotototeutus / Pietarsaari")).toBeVisible();
  await expect(page.getByText("Insinööri (AMK), konetekniikka, päivätoteutus / Kokkola")).not.toBeVisible();
});

test("/pisterajat: ala link lists programmes with school badge, pagination, search, round switch, and source", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/pisterajat/");
  await expect(page.getByRole("heading", { name: `Pisterajat ${DEFAULT_CUTOFF_YEAR}` })).toBeVisible();

  await page.getByRole("link", { name: "Lääketieteet" }).click();
  await expect(page).toHaveURL("/pisterajat/laaketieteet/");
  await expect(page.getByRole("heading", { name: `Lääketieteet pisterajat ${DEFAULT_CUTOFF_YEAR}` })).toBeVisible();
  expect(await page.evaluate<number>("document.documentElement.scrollWidth")).toBeLessThanOrEqual(390);
  await expect(page.getByRole("button", { name: "Näytä lisää" })).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Turun yliopisto" })).toHaveCount(0);

  const cards = page.getByRole("article");
  await expect(cards).toHaveCount(20);
  const turunCard = cards.filter({ hasText: "Turun yliopisto" }).first();
  await expect(turunCard).toBeVisible();
  await expect(turunCard.getByRole("link", { name: "Turun yliopisto" })).toHaveAttribute(
    "href",
    "/koulut/turun-yliopisto/",
  );
  await expect(turunCard.getByText("Alin hyväksytty pistemäärä").first()).toBeVisible();

  const source = page.getByText("Lähde: Opetushallinnon tilastopalvelu Vipunen");
  await expect(source).toBeVisible();
  const pagination = await page.getByRole("navigation", { name: "Sivutus" }).boundingBox();
  const sourceBox = await source.boundingBox();
  if (!pagination || !sourceBox) throw new Error("Expected pagination and source to be visible");
  expect(sourceBox.y).toBeGreaterThanOrEqual(pagination.y + pagination.height);

  await page.getByRole("button", { name: "Seuraava sivu" }).click();
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Metropolia Ammattikorkeakoulu");

  const search = page.getByRole("textbox", { name: "Hae koulutusta tai korkeakoulua" });
  await search.fill("Metropolia");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Metropolia Ammattikorkeakoulu");
  await expect(page.getByRole("navigation", { name: "Sivutus" })).toHaveCount(0);

  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeVisible();

  await search.clear();
  await expect(cards).toHaveCount(20);

  await selectOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Metropolia Ammattikorkeakoulu");
});

test("/yo-pisterajat: switches kirjoituskerta and shows that round's cutoff", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/yo-pisterajat/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "YO-pisterajat 2026" })).toBeVisible();
  expect(await page.evaluate<number>("document.documentElement.scrollWidth")).toBeLessThanOrEqual(390);

  const kemia = () =>
    page.getByRole("listitem").filter({ has: page.getByRole("heading", { exact: true, level: 2, name: "Kemia" }) });
  await expect(kemia().getByText("101", { exact: true })).toBeVisible();

  await selectOption(page, "Kirjoituskerta", "Syksy 2025");

  await expect(kemia().getByText("105", { exact: true })).toBeVisible();
});

test("/lukiot: search expands school keskiarvot accordion", async ({ page }) => {
  await page.goto("/lukiot/");
  await expect(
    page.getByRole("heading", { level: 1, name: `Lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}` }),
  ).toBeVisible();

  const search = page.getByRole("textbox", { name: "Hae lukiota tai linjaa" });
  await fillSearchUntil(search, "Akaan lukio", async () => {
    await expect(page.getByRole("button", { name: "Brändö gymnasium" })).toHaveCount(0, { timeout: 1500 });
  });
  await page.getByRole("button", { name: "Akaan lukio" }).click();

  const schoolPanel = page.getByRole("region", { name: "Akaan lukio" });
  const card = schoolPanel.getByRole("article", { name: `Akaan lukio keskiarvot ${LUKIO_KESKIARVOT_YEAR}` });
  await expect(card).toBeVisible();
  await expect(card.getByText("Lukion yleislinja")).toBeVisible();
  await expect(card.getByText("Alin hyväksytty").first()).toBeVisible();
  await expect(card.getByText("7,00")).toBeVisible();

  const specialCheckbox = page.getByRole("checkbox", { name: "Näytä myös erityislinjat" });
  await expect(specialCheckbox).toBeChecked();
  await expect(card.getByText("Lukion liikuntalinja")).toBeVisible();
  await page.getByText("Näytä myös erityislinjat").click();
  await expect(specialCheckbox).not.toBeChecked();
  await expect(card.getByText("Lukion liikuntalinja")).toHaveCount(0);

  const akaaItem = page.getByRole("listitem").filter({ has: page.getByRole("button", { name: /Akaan lukio/ }) });
  const gpaInput = page.getByLabel("Oma keskiarvo");
  await gpaInput.fill("6.5");
  await expect(akaaItem.getByLabel("Keskiarvo ei riitä yleislinjalle")).toBeVisible();

  await gpaInput.fill("7.5");
  await expect(akaaItem.getByLabel("Keskiarvo riittää yleislinjalle")).toBeVisible();
});

test("/lukiot: paginates, sorts and filters by kunta", async ({ page }) => {
  await page.goto("/lukiot/");
  await expect(page.getByRole("button", { name: "Akaan lukio" })).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(page.getByRole("button", { name: "Brändö gymnasium" })).toBeVisible({ timeout: 1000 });
  }).toPass();

  await selectOption(page, "Järjestys", "Korkein keskiarvo (yleislinja)");
  await expect(page.getByRole("button", { name: "Helsingin normaalilyseo" })).toBeVisible();

  await selectOption(page, "Järjestys", "Matalin keskiarvo (yleislinja)");
  await expect(page.getByRole("button", { name: "Euran lukio" })).toBeVisible();

  await selectOption(page, "Kunta", "Akaa");
  await expect(page.getByRole("button", { name: "Akaan lukio" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Euran lukio" })).toHaveCount(0);
});

test("/lukiot: kunta filter shows that municipality's lukiot", async ({ page }) => {
  await page.goto("/lukiot/");
  await expect(
    page.getByRole("heading", { level: 1, name: `Lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}` }),
  ).toBeVisible();

  await selectOption(page, "Kunta", "Akaa");
  await page.getByRole("button", { name: "Akaan lukio" }).click();

  const card = page.getByRole("article", { name: `Akaan lukio keskiarvot ${LUKIO_KESKIARVOT_YEAR}` });
  await expect(card).toBeVisible();
  await expect(card.getByText("Lukion yleislinja")).toBeVisible();
  await expect(card.getByText("7,00")).toBeVisible();
});

test("/lukiot/kaupungit: searches for a municipality", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/lukiot/kaupungit/");
  await expect(page).toHaveTitle(`Lukiot kunnittain – keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`);
  await expect(page.getByRole("heading", { level: 1, name: "Lukiot kunnittain", exact: true })).toBeVisible();
  await expect(
    page.getByText(`Valitse kunta ja katso lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}.`),
  ).toBeVisible();
  const list = page.getByRole("main").getByRole("list");
  await fillSearchUntil(page.getByRole("textbox", { name: "Hae kuntaa" }), "Akaa", async () => {
    await expect(list.getByRole("link")).toHaveCount(1, { timeout: 1500 });
  });
  const kunta = list.getByRole("link", { name: "Akaa", exact: true });
  await expect(kunta).toBeVisible();
  await expect(kunta.getByText("1 lukio")).toBeVisible();
  await kunta.click();
  await expect(page).toHaveURL(/\/lukiot\/kaupungit\/akaa\/$/);
});

test("/lukiot/kaupungit: paginates municipalities", async ({ page }) => {
  await page.goto("/lukiot/kaupungit/");
  const list = page.getByRole("main").getByRole("list");
  await expect(list.getByRole("link")).toHaveCount(20);
  await expect(list.getByRole("link", { name: "Akaa", exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Seuraava sivu" }).click();
  await expect(list.getByRole("link", { name: "Akaa", exact: true })).toHaveCount(0);
  await expect(list.getByRole("link")).toHaveCount(20);

  await page.getByRole("button", { name: "Edellinen sivu" }).click();
  await expect(list.getByRole("link", { name: "Akaa", exact: true })).toBeVisible();
});

test("/lukiot/kaupungit: opens a municipality and its school", async ({ page }) => {
  await page.goto("/lukiot/");
  await page.getByRole("link", { name: "Katso lukiot kunnittain" }).click();
  await expect(page).toHaveURL(/\/lukiot\/kaupungit\/$/);
  await page.getByRole("link", { name: "Akaa", exact: true }).click();

  await expect(page).toHaveURL(/\/lukiot\/kaupungit\/akaa\/$/);
  await expect(page).toHaveTitle(`Akaan lukiot keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`);
  await expect(
    page.getByRole("heading", { level: 1, name: `Akaan lukiot keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}` }),
  ).toBeVisible();
  const card = page.getByRole("article", { name: `Akaan lukio keskiarvot ${LUKIO_KESKIARVOT_YEAR}` });
  await expect(card.getByText("Lukion yleislinja")).toBeVisible();
  await expect(card.getByText("7,00")).toBeVisible();
  await card.getByRole("link", { name: "Akaan lukio: keskiarvorajat ja linjat" }).click();
  await expect(page).toHaveURL(/\/lukiot\/akaan-lukio\/$/);
  await expect(
    page.getByRole("heading", { level: 1, name: `Akaan lukio keskiarvot ${LUKIO_KESKIARVOT_YEAR}` }),
  ).toBeVisible();
});

test("/trendit: loads trend cards", async ({ page }) => {
  await page.goto("/trendit/");
  await expect(page.getByRole("heading", { name: "Suosituimmat koulutusalat" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Suosituimmat korkeakoulut" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Kevään 1. ja 2. yhteishaun hakijamäärät" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Syksyn yhteishaun hakijamäärät" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Kevään yhteishakujen ensisijaiset hakijat vuosittain" })).toBeVisible();
  await expect(page.getByRole("img", { name: "Syksyn yhteishaun ensisijaiset hakijat vuosittain" })).toBeVisible();
  // "Hakijaa" column header renders only after skeletons are replaced by data
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
});

test("/trendit: compares two application rounds", async ({ page }) => {
  const compareRound = YEAR_OPTIONS.find(({ value }) => value !== CURRENT_YEAR);
  if (!compareRound) throw new Error("Expected at least two statistics rounds");

  await page.goto("/trendit/");
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
  const responsePromise = page.waitForResponse((response) =>
    response.url().includes(`hakijamaarat-${compareRound.value.replace("_", "-")}.json`),
  );

  await selectOption(page, "Vertailuyhteishaku", compareRound.label);

  expect((await responsePromise).status()).toBe(200);
  await expectSelectedOption(page, "Vertailuyhteishaku", compareRound.label);
  await expect(page.getByText(new RegExp(statisticsRoundShortLabel(compareRound.value), "i")).first()).toBeVisible();
});

test("/trendit: shows a comparison loading error", async ({ page }) => {
  await page.route("**/hakijamaarat-2025-syksy.json", (route) =>
    route.fulfill({ status: 500, contentType: "application/json", body: "{}" }),
  );
  await page.goto("/trendit/");
  await expect(page.getByText("Hakijaa").first()).toBeVisible({ timeout: 10000 });
  await selectOption(page, "Vertailuyhteishaku", "Syksyn yhteishaku 2025");
  await expect(page.getByText("Vertailutietojen lataaminen epäonnistui.")).toBeVisible({ timeout: 15000 });
  await expect(page.getByText("uusi", { exact: true })).toHaveCount(0);
});

test("/hakijaprofiili: selects a school, switches scopes, sorts, switches round and shows gender breakdown", async ({
  page,
}) => {
  await page.goto("/hakijaprofiili/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Hakijaprofiili" })).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "Haaga-Helia ammattikorkeakoulu" }).click();
    await expect(page.getByRole("heading", { level: 2, name: "Haaga-Helia ammattikorkeakoulu" })).toBeVisible({
      timeout: 1000,
    });
  }).toPass();
  await expect(page.getByRole("list", { name: /Sukupuolijakauma/ })).toBeVisible();
  await expect(page.getByRole("list", { name: /Ikäryhmäjakauma/ })).toBeVisible();

  await selectOption(page, "Järjestä", "Eniten naispainotteinen");
  await expectSelectedOption(page, "Järjestä", "Eniten naispainotteinen");

  await page.getByRole("tab", { name: "Koulutusala" }).click();
  await expect(page.getByRole("tab", { name: "Koulutusala" })).toHaveAttribute("aria-selected", "true");
  await fillSearchUntil(page.getByPlaceholder("Hae koulutusalaa"), "Kauppa", async () => {
    await expect(page.getByRole("button", { name: "Kauppa, hallinto ja oikeustieteet" })).toBeVisible({
      timeout: 1500,
    });
  });
  await page.getByRole("button", { name: "Kauppa, hallinto ja oikeustieteet" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Kauppa, hallinto ja oikeustieteet" })).toBeVisible();

  await page.getByRole("tab", { name: "Tutkinto" }).click();
  await expect(page.getByRole("tab", { name: "Tutkinto" })).toHaveAttribute("aria-selected", "true");
  await fillSearchUntil(page.getByPlaceholder("Hae tutkintoa"), "Taiteen maisteri", async () => {
    await expect(page.getByRole("button", { name: "Taiteen maisteri", exact: true })).toBeVisible({ timeout: 1500 });
  });
  await page.getByRole("button", { name: "Taiteen maisteri", exact: true }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Taiteen maisteri" })).toBeVisible();

  await page.getByRole("combobox", { name: "Yhteishaku" }).click();
  await Promise.all([
    page.waitForResponse((r) => r.url().includes("hakijaprofiili-2025-syksy.json")),
    page.getByRole("option", { name: "Syksyn yhteishaku 2025", exact: true }).click(),
  ]);
  await expectSelectedOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  await page.getByRole("button", { name: "Estenomi (ylempi AMK)" }).click();
  await expect(page.getByRole("heading", { level: 2, name: "Estenomi (ylempi AMK)" })).toBeVisible();
});

test("/hakijaprofiili: shows error alert when round fetch fails", async ({ page }) => {
  await page.route("**/hakijaprofiili-2025-syksy.json", (route) => route.fulfill({ status: 500, body: "Server error" }));
  await page.goto("/hakijaprofiili/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Hakijaprofiili" })).toBeVisible();

  await selectOption(page, "Yhteishaku", "Syksyn yhteishaku 2025");
  await expect(page.getByText("Hakijaprofiilia ei voitu ladata. Yritä hetken kuluttua uudelleen.")).toBeVisible({
    timeout: 10000,
  });
});

test("/ennakointi: shows ranked vaje list, paginates, searches, sorts and filters by sektori", async ({ page }) => {
  await page.goto("/ennakointi/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Ennakointi" })).toBeVisible();
  await expect(page.getByText("Hoitotyö", { exact: true })).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(page.getByText("Oikeustieteet", { exact: true })).toBeVisible({ timeout: 1000 });
  }).toPass();
  await expect(page.getByText("Hoitotyö", { exact: true })).toHaveCount(0);

  await expect(async () => {
    await page.getByRole("button", { name: "Edellinen sivu" }).click();
    await expect(page.getByText("Hoitotyö", { exact: true })).toBeVisible({ timeout: 1000 });
  }).toPass();

  const search = page.getByRole("textbox", { name: "Haku" });
  await fillSearchUntil(search, "oikeustieteet", async () => {
    await expect(page.getByText("Oikeustieteet", { exact: true })).toBeVisible({ timeout: 1500 });
    await expect(page.getByText("Hoitotyö", { exact: true })).toHaveCount(0, { timeout: 1500 });
  });

  await fillSearchUntil(search, "", async () => {
    await expect(page.getByText("Hoitotyö", { exact: true })).toBeVisible({ timeout: 1500 });
  });

  await selectOption(page, "Järjestys", "Pienin pula");
  await expect(page.getByText("Hoitotyö", { exact: true })).toHaveCount(0);

  await selectOption(page, "Järjestys", "Isoin pula");
  await expect(page.getByText("Hoitotyö", { exact: true })).toBeVisible();

  await selectOption(page, "Sektori", "Yliopisto");
  await expect(page.getByText("Hoitotyö", { exact: true })).toHaveCount(0);
  await expect(page.getByText("Sosiaalitieteet", { exact: true })).toBeVisible();
});

test("/tyollistyminen: shows study field employment, salaries, and occupation search, pagination and filters", async ({
  page,
}) => {
  await page.goto("/tyollistyminen/");
  await expect(page.getByRole("heading", { exact: true, level: 1, name: "Työllistyminen ja palkat" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "Koulutusalat" })).toHaveAttribute("aria-selected", "true");

  const tekniikkaTrigger = page.getByRole("button", { name: /Tekniikan alat/ });
  const tekniikkaItem = page.getByRole("listitem").filter({ has: tekniikkaTrigger });
  await expect(async () => {
    if (!(await tekniikkaItem.getByText("Työllistyminen 3 v valmistumisesta").isVisible())) {
      await tekniikkaTrigger.click();
    }
    await expect(tekniikkaItem.getByText("Työllistyminen 3 v valmistumisesta")).toBeVisible({ timeout: 1000 });
  }).toPass();
  await expect(tekniikkaItem.getByText("Alan ammatit ja mediaanipalkat")).toBeVisible();
  await expect(tekniikkaItem.getByText("5 584 €/kk", { exact: true })).toBeVisible();

  const search = page.getByRole("textbox", { name: "Haku" });
  await fillSearchUntil(search, "ylilääkäri", async () => {
    await expect(page.getByRole("meter", { name: "Ylilääkärit: 10 795 €/kk" })).toBeVisible({ timeout: 1500 });
  });
  await expect(page.getByRole("heading", { level: 2, name: "Ammatit ja palkat" })).toBeVisible();
  await expect(page.getByRole("button", { name: /Tekniikan alat/ })).toHaveCount(0);

  await fillSearchUntil(search, "", async () => {
    await expect(page.getByRole("button", { name: /Tekniikan alat/ })).toBeVisible({ timeout: 1500 });
  });

  await page.getByRole("tab", { name: "Ammatit" }).click();
  await expect(page.getByRole("tab", { name: "Ammatit" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("heading", { level: 2, name: "Ammatit ja palkat" })).toBeVisible();
  await expect(page.getByText("Toimitusjohtajat ja pääjohtajat", { exact: true })).toBeVisible();

  await expect(async () => {
    await page.getByRole("button", { name: "Seuraava sivu" }).click();
    await expect(page.getByText("Muut hallintojohtajat ja kaupalliset johtajat", { exact: true })).toBeVisible({
      timeout: 1000,
    });
  }).toPass();

  const ammatitSearch = page.getByRole("textbox", { name: "Haku" });
  await fillSearchUntil(ammatitSearch, "sairaanhoitaja", async () => {
    await expect(page.getByText("Sairaanhoitajat", { exact: true })).toBeVisible({ timeout: 1500 });
  });
  await fillSearchUntil(ammatitSearch, "", async () => {
    await expect(page.getByText("Toimitusjohtajat ja pääjohtajat", { exact: true })).toBeVisible({ timeout: 1500 });
  });

  await selectOption(page, "Ammattiryhmä", "Muut työntekijät");
  await selectOption(page, "Järjestys", "Matalin palkka");
  await expect(page.getByText("Maanviljelyn avustavat työntekijät", { exact: true })).toBeVisible();
});
