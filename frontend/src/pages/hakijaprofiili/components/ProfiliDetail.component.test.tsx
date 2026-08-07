import { screen, within } from "@testing-library/react";
import { expect, test } from "vitest";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import { renderWithChakra } from "@/test/render";
import ProfiliDetail from "./ProfiliDetail";

const fullEntity: HakijaprofiiliEntity = {
  kohdeTyyppi: "koulu",
  kohdeNimi: "Haaga-Helia ammattikorkeakoulu",
  sukupuoli: [
    { nimi: "mies", lkm: 120 },
    { nimi: "nainen", lkm: 80 },
  ],
  ikaryhmat: [
    { nimi: "19", lkm: 100 },
    { nimi: "20", lkm: 250 },
    { nimi: "21", lkm: 50 },
  ],
};

const maskedEntity: HakijaprofiiliEntity = {
  kohdeTyyppi: "tutkinto",
  kohdeNimi: "Kätilö (AMK)",
  sukupuoli: [
    { nimi: "mies", lkm: null },
    { nimi: "nainen", lkm: 280 },
  ],
  ikaryhmat: [
    { nimi: "19", lkm: 60 },
    { nimi: "20", lkm: null },
  ],
};

test("shows %-shares with fixed gender order and age bands largest first when every band is unmasked", () => {
  renderWithChakra(<ProfiliDetail entity={fullEntity} />);

  expect(screen.getByText(/^60\s*%$/)).toBeInTheDocument();
  expect(screen.queryByText(/Suurin ikäryhmä/)).not.toBeInTheDocument();
  expect(screen.getByRole("list", { name: /Sukupuolijakauma/ })).toBeInTheDocument();
  expect(screen.getByRole("meter", { name: "mies" })).toHaveStyle({ width: "100%" });
  expect(screen.getByRole("meter", { name: "nainen" })).toHaveStyle({ width: `${(80 / 120) * 100}%` });

  const ageItems = within(screen.getByRole("list", { name: /Ikäryhmäjakauma/ })).getAllByRole("listitem");
  expect(ageItems[0]).toHaveTextContent("20");
  const genderItems = within(screen.getByRole("list", { name: /Sukupuolijakauma/ })).getAllByRole("listitem");
  expect(genderItems[0]).toHaveTextContent("nainen");
  expect(genderItems[1]).toHaveTextContent("mies");
});

test("omits under-five age bands and recomputes shares among remaining rows", () => {
  const smallNumericEntity: HakijaprofiiliEntity = {
    kohdeTyyppi: "koulu",
    kohdeNimi: "Humanistinen ammattikorkeakoulu",
    sukupuoli: [
      { nimi: "mies", lkm: 956 },
      { nimi: "nainen", lkm: 3627 },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: 289 },
      { nimi: "65–vuotiaat ja sitä vanhemmat", lkm: 2 },
    ],
  };

  renderWithChakra(<ProfiliDetail entity={smallNumericEntity} />);

  expect(screen.queryByText(/Suppeat tai peitetyt tiedot/)).not.toBeInTheDocument();
  expect(screen.queryByText("alle 5")).not.toBeInTheDocument();
  expect(screen.queryByText("1-4 hakijaa")).not.toBeInTheDocument();
  expect(screen.queryByText("65–vuotiaat ja sitä vanhemmat")).not.toBeInTheDocument();
  expect(screen.getByRole("meter", { name: "nainen" })).toHaveStyle({ width: "100%" });
  expect(screen.getByRole("meter", { name: "19" })).toHaveStyle({ width: "100%" });
  expect(screen.queryByRole("meter", { name: "65–vuotiaat ja sitä vanhemmat" })).not.toBeInTheDocument();
  // Only published age band remains → 289 / 289 = 100 %
  expect(screen.getByText(/^100\s*%$/)).toBeInTheDocument();
  expect(screen.queryByText(/^0,7\s*%$/)).not.toBeInTheDocument();
});

test("keeps masked sukupuoli row as 1-4 hakijaa without %; still hides under-five ages", () => {
  renderWithChakra(<ProfiliDetail entity={maskedEntity} />);

  expect(screen.queryByText(/Suppeat tai peitetyt tiedot/)).not.toBeInTheDocument();
  expect(screen.queryByText("alle 5")).not.toBeInTheDocument();
  expect(screen.queryByText("20")).not.toBeInTheDocument();

  const genderItems = within(screen.getByRole("list", { name: /Sukupuolijakauma/ })).getAllByRole("listitem");
  expect(genderItems).toHaveLength(2);
  expect(genderItems[0]).toHaveTextContent("nainen");
  expect(genderItems[0]).toHaveTextContent("280");
  expect(genderItems[0]).not.toHaveTextContent("%");
  expect(genderItems[1]).toHaveTextContent("mies");
  expect(genderItems[1]).toHaveTextContent("1-4 hakijaa");
  expect(screen.getByRole("meter", { name: "nainen" })).toHaveStyle({ width: "100%" });
  expect(screen.queryByRole("meter", { name: "mies" })).not.toBeInTheDocument();

  const ageItems = within(screen.getByRole("list", { name: /Ikäryhmäjakauma/ })).getAllByRole("listitem");
  expect(ageItems).toHaveLength(1);
  expect(ageItems[0]).toHaveTextContent("19");
  expect(screen.getByRole("meter", { name: "19" })).toHaveStyle({ width: "100%" });
  expect(screen.getByText(/^100\s*%$/)).toBeInTheDocument();
});

test("shows sparse notice and 1-4 hakijaa for both genders when every band is null or under five", () => {
  const emptyEntity: HakijaprofiiliEntity = {
    kohdeTyyppi: "tutkinto",
    kohdeNimi: "Pieni koulutus",
    sukupuoli: [
      { nimi: "mies", lkm: null },
      { nimi: "nainen", lkm: 2 },
    ],
    ikaryhmat: [
      { nimi: "19", lkm: null },
      { nimi: "20", lkm: 4 },
    ],
  };

  renderWithChakra(<ProfiliDetail entity={emptyEntity} />);

  expect(screen.getByText(/Suppeat tai peitetyt tiedot/)).toBeInTheDocument();
  expect(screen.queryByText("alle 5")).not.toBeInTheDocument();
  expect(screen.queryByRole("meter")).not.toBeInTheDocument();

  const genderItems = within(screen.getByRole("list", { name: /Sukupuolijakauma/ })).getAllByRole("listitem");
  expect(genderItems).toHaveLength(2);
  expect(genderItems[0]).toHaveTextContent("nainen");
  expect(genderItems[1]).toHaveTextContent("mies");
  expect(screen.getAllByText("1-4 hakijaa")).toHaveLength(2);
  expect(screen.getByText("Ei tietoja saatavilla.")).toBeInTheDocument();
});

test("fills missing sukupuoli label as 1-4 hakijaa in fixed order", () => {
  const missingMies: HakijaprofiiliEntity = {
    kohdeTyyppi: "koulu",
    kohdeNimi: "Vain naiset",
    sukupuoli: [{ nimi: "nainen", lkm: 40 }],
    ikaryhmat: [{ nimi: "19", lkm: 40 }],
  };

  renderWithChakra(<ProfiliDetail entity={missingMies} />);

  const genderItems = within(screen.getByRole("list", { name: /Sukupuolijakauma/ })).getAllByRole("listitem");
  expect(genderItems.map((item) => item.textContent)).toEqual([
    expect.stringContaining("nainen"),
    expect.stringContaining("mies"),
  ]);
  expect(genderItems[0]).toHaveTextContent("40");
  expect(genderItems[0]).not.toHaveTextContent("%");
  expect(genderItems[1]).toHaveTextContent("1-4 hakijaa");
  expect(screen.getByRole("meter", { name: "nainen" })).toHaveStyle({ width: "100%" });
  expect(screen.queryByRole("meter", { name: "mies" })).not.toBeInTheDocument();
});
