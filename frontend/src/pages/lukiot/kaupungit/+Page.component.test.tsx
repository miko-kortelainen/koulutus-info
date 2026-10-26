import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import LukiotKaupungitPage from "@/pages/lukiot/kaupungit/+Page";
import { renderWithChakra } from "@/test/render";

const kunnat = [
  ...Array.from({ length: 20 }, (_, index) => ({ nimi: `Kunta ${index + 1}`, lukioidenMaara: 1 })),
  { nimi: "Helsinki", lukioidenMaara: 15 },
];

vi.mock("vike-react/useData", () => ({ useData: () => kunnat }));

test("paginates municipalities and resets the page when searching", async () => {
  const user = userEvent.setup();
  renderWithChakra(<LukiotKaupungitPage />);

  expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(20);
  expect(screen.getAllByText("1 lukio")).toHaveLength(20);
  expect(screen.queryByRole("link", { name: "Helsinki" })).not.toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Seuraava sivu" }));
  expect(screen.getByRole("link", { name: "Helsinki" })).toHaveAttribute("href", "/lukiot/kaupungit/helsinki/");
  expect(screen.getByText("15 lukiota")).toBeInTheDocument();

  await user.type(screen.getByRole("textbox", { name: "Hae kuntaa" }), "Helsinki");
  await waitFor(() => expect(within(screen.getByRole("list")).getAllByRole("link")).toHaveLength(1));
  expect(screen.getByRole("link", { name: "Helsinki" })).toBeInTheDocument();

  await user.clear(screen.getByRole("textbox", { name: "Hae kuntaa" }));
  await user.type(screen.getByRole("textbox", { name: "Hae kuntaa" }), "xyzxyz");
  await waitFor(() => expect(screen.getByText("Ei tuloksia haulle.")).toBeInTheDocument());
});
