import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import PistelaskuriCta from "@/components/PistelaskuriCta";

test("links to pistelaskuri and tracks the click", async () => {
  const event = vi.fn();
  const user = userEvent.setup();
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<PistelaskuriCta />);

  const link = screen.getByRole("link", { name: "Laske todistusvalintapisteesi" });
  expect(link).toHaveAttribute("href", "/pistelaskuri/");

  link.addEventListener("click", (click) => click.preventDefault());
  await user.click(link);
  expect(event).toHaveBeenCalledWith("open_pistelaskuri");
});
