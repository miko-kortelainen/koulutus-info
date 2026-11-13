import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import type { TyollistyminenPageData } from "@/pages/tyollistyminen/+data";
import TyollistyminenPage from "@/pages/tyollistyminen/+Page";
import { renderWithChakra } from "@/test/render";

beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  if (!HTMLElement.prototype.scrollTo) {
    HTMLElement.prototype.scrollTo = () => {};
  }
});

const mockData: TyollistyminenPageData = {
  tyollistyminen: {
    vuosi: 2024,
    items: [
      {
        ala: "Tekniikan alat",
        amk: { paatoimisetTyolliset: 73, tyollisetOpiskelijat: 16, paatoimisetOpiskelijat: 2, tyottomat: 7, muut: 2 },
        alempi: {
          paatoimisetTyolliset: 61,
          tyollisetOpiskelijat: 24,
          paatoimisetOpiskelijat: 8,
          tyottomat: 7,
          muut: 1,
        },
        ylempi: {
          paatoimisetTyolliset: 77,
          tyollisetOpiskelijat: 15,
          paatoimisetOpiskelijat: 1,
          tyottomat: 5,
          muut: 3,
        },
        yamk: { paatoimisetTyolliset: 88, tyollisetOpiskelijat: 8, paatoimisetOpiskelijat: 1, tyottomat: 3, muut: 1 },
      },
      {
        ala: "Terveys- ja hyvinvointialat",
        amk: { paatoimisetTyolliset: 79, tyollisetOpiskelijat: 15, paatoimisetOpiskelijat: 2, tyottomat: 3, muut: 2 },
        alempi: {
          paatoimisetTyolliset: 62,
          tyollisetOpiskelijat: 29,
          paatoimisetOpiskelijat: 6,
          tyottomat: 2,
          muut: 2,
        },
        ylempi: {
          paatoimisetTyolliset: 80,
          tyollisetOpiskelijat: 15,
          paatoimisetOpiskelijat: 2,
          tyottomat: 1,
          muut: 1,
        },
        yamk: { paatoimisetTyolliset: 83, tyollisetOpiskelijat: 14, paatoimisetOpiskelijat: 1, tyottomat: 2, muut: 1 },
      },
    ],
  },
  koulutusalaPalkat: {
    vuosi: 2024,
    items: [
      { ala: "Tekniikan alat", toinenAste: 3376, alempiKorkeakoulu: 4652, ylempiKorkeakoulu: 5584 },
      { ala: "Terveys- ja hyvinvointialat", toinenAste: 3002, alempiKorkeakoulu: 3425, ylempiKorkeakoulu: 4950 },
    ],
  },
  ammattienPalkat: {
    vuosi: 2024,
    items: [
      {
        koodi: "2144",
        nimi: "Konetekniikan erityisasiantuntijat",
        paaryhma: "Erityisasiantuntijat",
        ylaryhma: "Tekniikan erityisasiantuntijat",
        mediaaniPalkka: 4702,
        onRyhma: false,
      },
      {
        koodi: "32211",
        nimi: "Sairaanhoitajat",
        paaryhma: "Asiantuntijat",
        ylaryhma: "Sairaanhoitajat, kätilöt ym.",
        mediaaniPalkka: 3587,
        onRyhma: false,
      },
    ],
  },
};

vi.mock("vike-react/useData", () => ({
  useData: () => mockData,
}));

test("shows study field employment, salary levels, and field occupations, and filters by search", async () => {
  const user = userEvent.setup();
  renderWithChakra(<TyollistyminenPage />);

  expect(screen.getByRole("heading", { level: 1, name: "Työllistyminen ja palkat" })).toBeInTheDocument();
  expect(screen.getByRole("tab", { name: "Koulutusalat" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Ammatit" })).toHaveAttribute("aria-selected", "false");

  const tekniikkaTrigger = screen.getByRole("button", { name: /Tekniikan alat/ });
  expect(tekniikkaTrigger).not.toHaveTextContent("~");
  await user.click(tekniikkaTrigger);

  const tekniikkaItem = tekniikkaTrigger.closest("li");
  if (!tekniikkaItem) throw new Error("Expected accordion item");
  expect(within(tekniikkaItem).getByText("89 %")).toBeInTheDocument();
  expect(within(tekniikkaItem).getByText("5 584 €/kk")).toBeInTheDocument();
  expect(within(tekniikkaItem).getByText("Konetekniikan erityisasiantuntijat")).toBeInTheDocument();
  expect(within(tekniikkaItem).getByText("4 702 €/kk")).toBeInTheDocument();

  await user.type(screen.getByRole("textbox", { name: "Haku" }), "sairaanhoitaja");
  await waitFor(() => {
    expect(screen.queryByRole("button", { name: /Tekniikan alat/ })).not.toBeInTheDocument();
  });
  expect(screen.getByRole("button", { name: /Terveys- ja hyvinvointialat/ })).toBeInTheDocument();
  const occupationsSection = screen.getByRole("heading", { level: 2, name: "Ammatit ja palkat" }).closest("section");
  if (!occupationsSection) throw new Error("Expected occupations section");
  expect(within(occupationsSection).getByText("3 587 €/kk")).toBeInTheDocument();
});

test("switches to Ammatit tab and filters occupations by search and group", async () => {
  const user = userEvent.setup();
  renderWithChakra(<TyollistyminenPage />);

  await user.click(screen.getByRole("tab", { name: "Ammatit" }));
  expect(screen.getByRole("tab", { name: "Ammatit" })).toHaveAttribute("aria-selected", "true");

  const occupationsSection = screen.getByRole("heading", { level: 2, name: "Ammatit ja palkat" }).closest("section");
  if (!occupationsSection) throw new Error("Expected occupations section");
  expect(within(occupationsSection).getByText("Konetekniikan erityisasiantuntijat")).toBeInTheDocument();
  expect(within(occupationsSection).getByText("Sairaanhoitajat")).toBeInTheDocument();

  await user.click(screen.getByRole("combobox", { name: "Ammattiryhmä" }));
  await user.click(screen.getByRole("option", { name: "Asiantuntijat" }));
  expect(screen.queryByText("Konetekniikan erityisasiantuntijat")).not.toBeInTheDocument();
  expect(screen.getByText("Sairaanhoitajat")).toBeInTheDocument();

  await user.click(screen.getByRole("combobox", { name: "Ammattiryhmä" }));
  await user.click(screen.getByRole("option", { name: "Kaikki ryhmät" }));
  expect(screen.getByText("Konetekniikan erityisasiantuntijat")).toBeInTheDocument();

  await user.type(screen.getByRole("textbox", { name: "Haku" }), "sairaanhoitaja");
  await waitFor(() => {
    expect(screen.queryByText("Konetekniikan erityisasiantuntijat")).not.toBeInTheDocument();
  });
  expect(screen.getByText("Sairaanhoitajat")).toBeInTheDocument();

  await user.clear(screen.getByRole("textbox", { name: "Haku" }));
  await user.type(screen.getByRole("textbox", { name: "Haku" }), "olematon");
  await waitFor(() => {
    expect(screen.getByText("Ei tuloksia valituilla hakuehdoilla.")).toBeInTheDocument();
  });
});
