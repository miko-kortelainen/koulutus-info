import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import SchoolCard from "@/components/SchoolCard";
import { renderWithChakra } from "@/test/render";
import type { ToteutusEntry } from "@/types.gen";

const toteutus: ToteutusEntry = {
  toteutusOid: "1.2.3",
  toteutusNimi: { fi: "Testikoulutus" },
  oppilaitosNimi: { fi: "Testikorkeakoulu" },
  kunnat: ["Helsinki"],
};

test("tracks saving but not removing a degree", async () => {
  const event = vi.fn();
  const onSaved = vi.fn();
  const user = userEvent.setup();
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<SchoolCard onSaved={onSaved} toteutus={toteutus} />);

  await user.click(screen.getByRole("button", { name: "Tallenna" }));
  expect(event).toHaveBeenCalledWith("save_degree");
  expect(onSaved).toHaveBeenCalledTimes(1);

  await user.click(screen.getByRole("button", { name: "Poista tallennetuista" }));
  expect(event).toHaveBeenCalledTimes(1);
  expect(onSaved).toHaveBeenCalledTimes(1);
});

test("links Katso alan pisterajat to the ala pisterajat page", () => {
  renderWithChakra(
    <SchoolCard
      toteutus={{
        ...toteutus,
        koulutusalat: ["Kauppa, hallinto ja oikeustieteet"],
      }}
    />,
  );

  expect(screen.getByRole("link", { name: "Katso alan pisterajat" })).toHaveAttribute(
    "href",
    "/pisterajat/kauppa-hallinto-ja-oikeustieteet/",
  );
});
