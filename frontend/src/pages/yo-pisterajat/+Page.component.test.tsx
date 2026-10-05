import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import type { YoPisterajatRound } from "@/api/dataValidation";
import YoPisterajatPage from "@/pages/yo-pisterajat/+Page";
import { renderWithChakra } from "@/test/render";

const rounds: YoPisterajatRound[] = [
  {
    aineet: [
      { nimi: "Äidinkieli ja kirjallisuus, suomi", rajat: { A: 30, L: 88 } },
      { nimi: "Kemia", rajat: { A: 14, L: 101 } },
    ],
    arvosanat: ["L", "A"],
    kausi: "kevat",
    vuosi: 2026,
  },
  {
    aineet: [{ nimi: "Kemia", rajat: { A: 20, E: 89, L: 105, M: 73, C: 53, B: 34 } }],
    arvosanat: ["L", "E", "M", "C", "B", "A"],
    kausi: "syksy",
    vuosi: 2025,
  },
];

vi.mock("vike-react/useData", () => ({
  useData: () => rounds,
}));

test("lists the newest round and filters subjects", async () => {
  const user = userEvent.setup();
  renderWithChakra(<YoPisterajatPage />);

  expect(screen.getByRole("heading", { level: 1, name: "YO-pisterajat 2025–2026" })).toBeInTheDocument();
  expect(screen.getByText(/Uusin kirjoituskerta: kevät 2026/)).toBeInTheDocument();
  const list = screen.getByRole("list", { name: "Ylioppilaskokeiden pisterajat, kevät 2026" });
  expect(list).toHaveTextContent("101");
  expect(screen.getByRole("heading", { level: 2, name: "Äidinkieli ja kirjallisuus, suomi" })).toBeInTheDocument();

  await user.type(screen.getByRole("textbox", { name: "Hae ainetta" }), "kemia");

  await waitFor(() => {
    expect(
      screen.queryByRole("heading", { level: 2, name: "Äidinkieli ja kirjallisuus, suomi" }),
    ).not.toBeInTheDocument();
  });
  expect(screen.getByRole("heading", { level: 2, name: "Kemia" })).toBeInTheDocument();

  await user.clear(screen.getByRole("textbox", { name: "Hae ainetta" }));
  await user.type(screen.getByRole("textbox", { name: "Hae ainetta" }), "äidinkieli");
  await waitFor(() => {
    expect(screen.queryByRole("heading", { level: 2, name: "Kemia" })).not.toBeInTheDocument();
  });
  expect(screen.getByRole("heading", { level: 2, name: "Äidinkieli ja kirjallisuus, suomi" })).toBeInTheDocument();
});
