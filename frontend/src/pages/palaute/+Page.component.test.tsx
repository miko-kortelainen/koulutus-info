import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import PalautePage from "./+Page";

test("preserves feedback and shows an error when submission fails", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500 });
  vi.stubGlobal("fetch", fetchMock);
  const user = userEvent.setup();

  renderWithChakra(<PalautePage />);
  const message = screen.getByRole("textbox", { name: "Palaute" });
  await user.type(message, "Testipalaute");
  await user.click(screen.getByRole("button", { name: "Lähetä" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Lähetys epäonnistui, yritä uudelleen.");
  expect(message).toHaveValue("Testipalaute");
  expect(fetchMock).toHaveBeenCalledOnce();

  const body = (fetchMock.mock.calls[0] as [string, RequestInit])[1].body as FormData;
  expect(body.get("message")).toBe("Testipalaute");
});
