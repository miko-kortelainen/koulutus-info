import { expect, test } from "@playwright/test";
import { TOINEN_ASTE_YEARS } from "@/config/toinenAsteYears";

const pages = [
  { path: "/hakijamaarat/korkeakoulut/", option: "Syksyn yhteishaku 2025", data: "hakijamaarat-2025-syksy.json" },
  {
    path: "/hakijamaarat/toinen-aste/",
    option: `Yhteishaku ${TOINEN_ASTE_YEARS[1]}`,
    data: `hakijamaarat-${TOINEN_ASTE_YEARS[1]}.json`,
  },
];

for (const { path, option, data } of pages) {
  test(`${path}: keeps space for the result count while switching years`, async ({ page }) => {
    await page.goto(path);
    const count = page.locator('[aria-live="polite"]').filter({ hasText: /hakutulos/ });
    await expect(count).toContainText(/^(?!0000 )\d+ hakutulos/);
    const before = await count.boundingBox();
    if (!before) throw new Error("Result count is not visible");
    let release!: () => void;
    const wait = new Promise<void>((resolve) => {
      release = resolve;
    });
    let requested!: () => void;
    const requestStarted = new Promise<void>((resolve) => {
      requested = resolve;
    });
    await page.route(`**/${data}`, async (route) => {
      requested();
      await wait;
      await route.continue();
    });
    try {
      await page.getByRole("combobox", { name: "Yhteishaku" }).click();
      await page.getByRole("option", { name: option, exact: true }).click();
      await requestStarted;
      const placeholder = page.locator('[aria-live="polite"]').filter({ hasText: "0000 hakutulosta" });
      await expect(placeholder).toBeVisible();
      const during = await placeholder.boundingBox();
      if (!during) throw new Error("Result count placeholder is not visible");
      expect(Math.abs(during.height - before.height)).toBeLessThanOrEqual(1);
      const skeleton = page.locator('li[aria-hidden="true"]').first();
      await expect(skeleton).toBeVisible();
      const skeletonBox = await skeleton.boundingBox();
      if (!skeletonBox) throw new Error("Card placeholder is not visible");
      expect(skeletonBox.height).toBeGreaterThanOrEqual(230);
    } finally {
      release();
    }
    await expect(page.locator('[aria-live="polite"]').filter({ hasText: "0000 hakutulosta" })).toHaveCount(0);
    await expect(count).toContainText(/^(?!0000 )\d+ hakutulos/);
  });
}

test("toisen asteen hakijamäärät: searches, filters and switches year", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/hakijamaarat/toinen-aste/");
  const count = page.locator('[aria-live="polite"]').filter({ hasText: /hakutulos/ });
  await expect(count).toContainText(/^(?!0000 )\d+ hakutulos/);
  expect(await page.evaluate<number>("document.documentElement.scrollWidth")).toBeLessThanOrEqual(390);
  await expect(page.getByRole("button", { name: "Koulu", exact: true })).toHaveCount(0);
  await page.getByRole("button", { name: "Koulutusaste" }).click();
  await expect(page.getByRole("option", { name: "TUVA", exact: true })).toBeVisible();
  await page.getByRole("option", { name: "TELMA", exact: true }).click();
  await expect(page.getByRole("button", { name: "Koulutusaste (1)" })).toBeVisible();
  await expect(page.getByText(/Työhön ja itsenäiseen elämään valmentava koulutus/).first()).toBeVisible();
  await page.getByRole("combobox", { name: "Yhteishaku" }).click();
  await page.getByRole("option", { name: "Yhteishaku 2020", exact: true }).click();
  await expect(page.getByRole("button", { name: "Koulutusaste", exact: true })).toBeVisible();
  await expect(count).toContainText(/^(?!0000 )\d+ hakutulos/);
  const search = page.getByPlaceholder("Hae koulua tai linjaa");
  await search.fill("xxxnotexist");
  await expect(page.getByText("Ei tuloksia hakusanoilla.")).toBeVisible();
});
