import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import HeroButtons from "@/pages/index/components/HeroButtons";
import { renderWithChakra } from "@/test/render";

test("marks the clicked hero link busy and keeps its name", async () => {
  const user = userEvent.setup();
  renderWithChakra(<HeroButtons />);

  const link = screen.getByRole("link", { name: "Laske todistuspisteeni" });
  link.addEventListener("click", (event) => event.preventDefault());
  await user.click(link);

  expect(link).toHaveAttribute("aria-busy", "true");
  expect(link).toHaveAccessibleName("Laske todistuspisteeni");
  expect(screen.getByRole("link", { name: "Näytä hakijamäärät" })).not.toHaveAttribute("aria-busy");
});

test("does not mark the link busy on a modified click", async () => {
  const user = userEvent.setup();
  renderWithChakra(<HeroButtons />);

  const link = screen.getByRole("link", { name: "Laske todistuspisteeni" });
  link.addEventListener("click", (event) => event.preventDefault());
  await user.keyboard("{Control>}");
  await user.click(link);
  await user.keyboard("{/Control}");

  expect(link).not.toHaveAttribute("aria-busy");
});
