import { screen } from "@testing-library/react";
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
    screen.getByRole("heading", { level: 1, name: "Yliopistojen todistusvalinnan pisteytys" }),
  ).toBeInTheDocument();
  expect(
    screen.getByText(
      "Todistusvalinnassa yliopisto laskee pisteet tutkintosi arvosanoista ja vertaa niitä muiden hakijoiden pisteisiin.",
    ),
  ).toBeInTheDocument();
  expect(screen.getByText(/Päivitetty 17\.7\.2026/)).toBeInTheDocument();
  expect(screen.getByText(/Vuodesta 2026 käytössä on 11 pisteytystaulukkoa/)).toBeInTheDocument();
  expect(screen.getByText("suomalainen ylioppilastutkinto")).toBeInTheDocument();
  expect(screen.getByText("Huomio")).toBeInTheDocument();

  for (const heading of getGuideHeadings(source)) {
    expect(screen.getByRole("link", { name: heading.label })).toHaveAttribute("href", `#${heading.id}`);
    expect(screen.getByRole("heading", { level: 2, name: heading.label })).toHaveAttribute("id", heading.id);
  }

  expect(screen.getByRole("link", { name: /Pistelaskuri/ })).toHaveAttribute("href", "/pistelaskuri/");
  expect(screen.getByRole("link", { name: /Koulutukset/ })).toHaveAttribute("href", "/koulutukset/");
  expect(screen.getByRole("link", { name: /Hakijamäärät/ })).toHaveAttribute("href", "/hakijamaarat/");

  const articleSource = screen.getByRole("link", { name: "Yliopistovalinnat.fi-palvelun pisteytystaulukoista" });
  expect(articleSource).toHaveAttribute("target", "_blank");
  expect(articleSource).toHaveAttribute("rel", "noopener noreferrer");

  expect(screen.getByRole("heading", { name: "Lähteet" })).toBeInTheDocument();
  expect(
    screen.getByRole("link", { name: "Yliopistovalinnat.fi: Todistusvalinnan pisteytykset vuodesta 2026" }),
  ).toHaveAttribute("target", "_blank");
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
