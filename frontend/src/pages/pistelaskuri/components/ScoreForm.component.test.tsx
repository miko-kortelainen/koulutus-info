import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ScoreForm from "./ScoreForm";

test("tracks only a valid score calculation", async () => {
  const event = vi.fn();
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<ScoreForm onModeChange={vi.fn()} onSubmit={onSubmit} />);

  await user.click(screen.getByRole("tab", { name: "AMK-valintakoe" }));
  await user.type(screen.getByRole("textbox", { name: "Pistemäärä" }), "ei numero");
  await user.click(screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }));
  expect(event).not.toHaveBeenCalled();

  await user.clear(screen.getByRole("textbox", { name: "Pistemäärä" }));
  await user.type(screen.getByRole("textbox", { name: "Pistemäärä" }), "120,5");
  await user.click(screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }));

  expect(onSubmit).toHaveBeenCalledWith("AMK-valintakoe", 120.5);
  expect(event).toHaveBeenCalledWith("calculate_score");
});
