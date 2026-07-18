import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import { getGuide } from "../guides";
import Content from "../yliopistojen-todistusvalinta/content.mdx";
import source from "../yliopistojen-todistusvalinta/content.mdx?raw";
import GuideLayout, { Callout, getGuideHeadings } from "./GuideLayout";

const slug = "yliopistojen-todistusvalinta";

test("loads the raw MDX source as text", () => {
  expect(source).toEqual(expect.any(String));
});

test("renders the real MDX guide with registry metadata, navigation and sources", () => {
  renderWithChakra(<GuideLayout Content={Content} slug={slug} source={source} />);

  expect(
    screen.getByRole("heading", {
      level: 1,
      name: "Yliopistojen todistusvalintojen pisteytys ja kynnysehdot",
    }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Yliopisto laskee todistusvalinnan pisteet ylioppilastutkintosi arvosanoista ja enimmäispisteet vaihtelee alasta riippuen.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(/Päivitetty 18\.7\.2026/)).toBeInTheDocument();
  expect(screen.getAllByText(/käytössä on 11 pisteytystaulukkoa/)).toHaveLength(2);

  for (const heading of getGuideHeadings(source)) {
    expect(screen.getByRole("link", { name: heading.label })).toHaveAttribute("href", `#${heading.id}`);
    expect(screen.getByRole("heading", { level: 2, name: heading.label })).toHaveAttribute("id", heading.id);
  }

  expect(screen.getByRole("link", { name: /Pistelaskuri/ })).toHaveAttribute("href", "/pistelaskuri/");
  expect(screen.getByRole("link", { name: /Koulutukset/ })).toHaveAttribute("href", "/koulutukset/");
  expect(screen.getByRole("link", { name: /Hakijamäärät/ })).toHaveAttribute("href", "/hakijamaarat/");

  for (const citation of screen.getAllByRole("link", { name: "[1]" })) {
    expect(citation).toHaveAttribute("href", "#lahde-1");
  }

  expect(screen.getByRole("heading", { name: "Lähteet" })).toBeInTheDocument();
  const ophSource = screen.getByRole("link", {
    name: "Opetushallitus: Suomalaisen lukion voi suorittaa englanniksi syksystä 2026 alkaen",
  });
  expect(ophSource).toHaveAttribute("target", "_blank");
  expect(ophSource.closest("li")).toHaveAttribute("id", "lahde-3");
  expect(ophSource.closest("ol")).toBeInTheDocument();
});

test("keeps the exception table visible and collapses the kynnysehto sections behind accordions", async () => {
  const user = userEvent.setup();
  renderWithChakra(<GuideLayout Content={Content} slug={slug} source={source} />);

  // The exception table stays visible without interaction.
  const poikkeukset = screen.getByRole("table");
  expect(within(poikkeukset).getByRole("columnheader", { name: "Yliopisto" })).toBeInTheDocument();
  expect(within(poikkeukset).getByRole("columnheader", { name: "Hakukohde" })).toBeInTheDocument();
  expect(within(poikkeukset).getAllByRole("row")).toHaveLength(11);

  // The kynnysehto table and the no-threshold list start collapsed behind their accordions.
  expect(screen.getByRole("button", { name: "Alat, joissa on kynnysehto" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.getByRole("button", { name: "Alat ilman kynnysehtoa" })).toHaveAttribute("aria-expanded", "false");
  expect(screen.queryByRole("cell", { name: "Farmasia" })).not.toBeInTheDocument();
  expect(screen.getByText("Biokemia ja molekyylibiotieteet")).not.toBeVisible();

  await user.click(screen.getByRole("button", { name: "Alat, joissa on kynnysehto" }));
  const farmasia = await screen.findByRole("cell", { name: "Farmasia" });
  const kynnysehdot = farmasia.closest("table") as HTMLTableElement;
  expect(within(kynnysehdot).getByRole("columnheader", { name: "Hakukohde" })).toBeInTheDocument();
  expect(within(kynnysehdot).getByRole("columnheader", { name: "Kynnysehto" })).toBeInTheDocument();
  expect(within(kynnysehdot).getAllByRole("row")).toHaveLength(29);

  await user.click(screen.getByRole("button", { name: "Alat ilman kynnysehtoa" }));
  expect(screen.getByText("Biokemia ja molekyylibiotieteet")).toBeVisible();
  expect(screen.getByText("Ravitsemustiede")).toBeVisible();
  expect(screen.getAllByRole("table")).toHaveLength(2);
});

test("ignores fenced headings and generates Finnish and S2/R2 IDs", () => {
  const headings = getGuideHeadings(`## Äidinkieli ja S2/R2

\`\`\`md
## Ei sisälly
\`\`\`

## Pääsykoe`);

  expect(headings).toEqual([
    { id: "aidinkieli-ja-s2-r2", label: "Äidinkieli ja S2/R2" },
    { id: "paasykoe", label: "Pääsykoe" },
  ]);
});

test("rejects unsupported, empty and colliding headings", () => {
  expect(() => getGuideHeadings("## Otsikko ##")).toThrowError(/closing hashes/);
  expect(() => getGuideHeadings("## *Korostettu*")).toThrowError(/Markdown and JSX/);
  expect(() => getGuideHeadings("## —")).toThrowError(/normalized ID is empty/);
  expect(() => getGuideHeadings("## Ää\n## Aa")).toThrowError(/collision "aa"/);
});

test("renders a custom callout title", () => {
  renderWithChakra(<Callout title="Vinkki">Mukautettu huomio</Callout>);

  expect(screen.getByText("Vinkki")).toBeInTheDocument();
  expect(screen.getByText("Mukautettu huomio")).toBeInTheDocument();
});

test.each([undefined, []])("does not render a sources footer for %s sources", (sources) => {
  const meta = getGuide(slug);
  const originalSources = meta.sources;
  meta.sources = sources;

  try {
    renderWithChakra(<GuideLayout Content={Content} slug={slug} source={source} />);
  } finally {
    meta.sources = originalSources;
  }

  expect(screen.queryByRole("heading", { name: "Lähteet" })).not.toBeInTheDocument();
});

test("throws for an unregistered slug", () => {
  expect(() => renderWithChakra(<GuideLayout Content={Content} slug="ei-olemassa" source={source} />)).toThrowError(
    /Unknown guide slug/,
  );
});
