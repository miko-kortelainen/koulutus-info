import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import TopBarList from "@/pages/trendit/components/TopBarList";

test("renders a dual bar per category when comparing rounds", () => {
  renderWithChakra(
    <TopBarList
      compareData={[
        { name: "Tekniikka", value: 35 },
        { name: "Terveys", value: 45 },
      ]}
      compareYear="syksy 2025"
      data={[
        { name: "Tekniikka", value: 50 },
        { name: "Terveys", value: 40 },
        { name: "Kauppa", value: 10 },
      ]}
      isLoading={false}
      selectedYear="kevät 2026"
    />,
  );

  expect(screen.getByText("Kauppa")).toBeInTheDocument();
  expect(screen.getByRole("meter", { name: "Tekniikka, Kevät 2026" })).toHaveStyle({ width: "100%" });
  expect(screen.getByRole("meter", { name: "Tekniikka, Syksy 2025" })).toHaveStyle({ width: "70%" });
  expect(screen.getByRole("meter", { name: "Kauppa, Kevät 2026" })).toBeInTheDocument();
  expect(screen.queryByRole("meter", { name: "Kauppa, Syksy 2025" })).not.toBeInTheDocument();
  expect(screen.getAllByText("–")).toHaveLength(1);

  const meters = screen.getAllByRole("meter", { name: /Tekniikka/ });
  expect(meters[0]).toHaveAccessibleName("Tekniikka, Kevät 2026");
  expect(meters[1]).toHaveAccessibleName("Tekniikka, Syksy 2025");
});

test("renders zero totals without invalid percentages or bar widths", () => {
  renderWithChakra(<TopBarList data={[{ name: "Ei hakijoita", value: 0 }]} isLoading={false} />);

  expect(screen.getByText("–")).toBeInTheDocument();
  expect(screen.getByRole("meter", { name: "Ei hakijoita" })).toHaveStyle({ width: "0%" });
});

test("formats percentages with the Finnish decimal separator", () => {
  renderWithChakra(
    <TopBarList
      data={[
        { name: "Ensimmäinen", value: 1 },
        { name: "Toinen", value: 2 },
      ]}
      isLoading={false}
    />,
  );

  expect(screen.getByText("33,3 %")).toBeInTheDocument();
});

test("renders an empty-data message", () => {
  renderWithChakra(<TopBarList data={[]} isLoading={false} />);

  expect(screen.getByText("Ei tietoja saatavilla.")).toBeInTheDocument();
});
