import { Accordion } from "@chakra-ui/react";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { renderWithChakra } from "@/test/render";
import { FilterItem, toCollection } from "./FilterAccordion";

test("names the listbox and sorts Finnish labels", async () => {
  const user = userEvent.setup();
  const collection = toCollection(["Öljy", "Åbo", "Äidinkieli", "Zoologia"]);

  renderWithChakra(
    <Accordion.Root collapsible>
      <FilterItem collection={collection} label="Koulu" onChange={() => {}} selected={new Set()} value="school" />
    </Accordion.Root>,
  );

  await user.click(screen.getByRole("button", { name: "Koulu" }));

  expect(screen.getByRole("listbox", { name: "Koulu" })).toBeInTheDocument();
  expect(collection.items.map((item) => item.value)).toEqual(["Zoologia", "Åbo", "Äidinkieli", "Öljy"]);
});
