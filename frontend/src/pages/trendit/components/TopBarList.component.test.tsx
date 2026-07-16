import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import TopBarList from "./TopBarList";

test("keeps all comparison data and shows changes and new categories", () => {
  renderWithChakra(
    <TopBarList
      compareData={[
        { name: "Tekniikka", value: 35 },
        { name: "Terveys", value: 45 },
      ]}
      compareYear="2025"
      data={[
        { name: "Tekniikka", value: 50 },
        { name: "Terveys", value: 40 },
        { name: "Kauppa", value: 10 },
      ]}
      isLoading={false}
      selectedYear="2026"
    />,
  );

  expect(screen.getByText("Kauppa")).toBeInTheDocument();
  expect(screen.getByText("+15")).toBeInTheDocument();
  expect(screen.getByText(/[-−]5/)).toBeInTheDocument();
  expect(screen.getByText("uusi")).toBeInTheDocument();
});

test("renders zero totals without invalid percentages or bar widths", () => {
  renderWithChakra(<TopBarList data={[{ name: "Ei hakijoita", value: 0 }]} isLoading={false} />);

  expect(screen.getByText("–")).toBeInTheDocument();
  expect(screen.getByRole("meter", { name: "Ei hakijoita" })).toHaveStyle({ width: "0%" });
});

test("renders an empty-data message", () => {
  renderWithChakra(<TopBarList data={[]} isLoading={false} />);

  expect(screen.getByText("Ei tietoja saatavilla.")).toBeInTheDocument();
});
