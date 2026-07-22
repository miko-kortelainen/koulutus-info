import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { ToteutusEntry } from "@/types.gen";
import SchoolCard from "./SchoolCard";

const toteutus: ToteutusEntry = {
  toteutusOid: "1.2.3",
  toteutusNimi: { fi: "Testikoulutus" },
  oppilaitosNimi: { fi: "Testikorkeakoulu" },
  kunnat: ["Helsinki"],
};

test("tracks saving but not removing a degree", async () => {
  const event = vi.fn();
  const user = userEvent.setup();
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<SchoolCard toteutus={toteutus} />);

  await user.click(screen.getByRole("button", { name: "Tallenna" }));
  expect(event).toHaveBeenCalledWith("save_degree");

  await user.click(screen.getByRole("button", { name: "Poista tallennetuista" }));
  expect(event).toHaveBeenCalledTimes(1);
});
