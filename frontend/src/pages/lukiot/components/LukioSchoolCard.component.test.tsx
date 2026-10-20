import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import type { LukioKeskiarvoEntry } from "@/api/dataValidation";
import LukioSchoolCard from "@/pages/lukiot/components/LukioSchoolCard";
import { renderWithChakra } from "@/test/render";

const entries: LukioKeskiarvoEntry[] = [
  { kunta: "Akaa", koulu: "Akaan lukio", linja: "Lukion yleislinja", alinKeskiarvo: 7.0, yleislinja: true },
];

test("renders a crawlable link to the school page when schoolHref is provided", () => {
  renderWithChakra(<LukioSchoolCard entries={entries} koulu="Akaan lukio" schoolHref="/lukiot/akaan-lukio/" />);

  expect(screen.getByRole("link", { name: "Akaan lukio: keskiarvorajat ja linjat" })).toHaveAttribute(
    "href",
    "/lukiot/akaan-lukio/",
  );
});

test("omits the school page link on the detail page itself", () => {
  renderWithChakra(<LukioSchoolCard entries={entries} koulu="Akaan lukio" />);

  expect(screen.queryByRole("link")).not.toBeInTheDocument();
});
