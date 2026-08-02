import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ScoreForm from "./ScoreForm";

vi.mock("../lib/todistusvalinta", () => ({
  recalculateFromGrades: vi.fn(async () => ({
    university: { applicationRound: "2026-kevat", programs: [] },
    amk: {
      applicationRound: "2026-kevat",
      ammattikorkeakoulut: [],
      maximumScore: 198,
      score: 34,
    },
  })),
}));

test("submits YO grades to local calculators and tracks success", async () => {
  const { recalculateFromGrades } = await import("../lib/todistusvalinta");
  const event = vi.fn();
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  vi.spyOn(Storage.prototype, "getItem").mockReturnValue(
    JSON.stringify({
      version: 1,
      yo: {
        aidinkieli: "M",
        aidinkieliExam: "ai_sv",
        kielet: [],
        matematiikkaGrade: "",
        matematiikkaLevel: "pitkä",
        reaaliaineet: [],
      },
    }),
  );
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<ScoreForm onModeChange={vi.fn()} onSubmit={onSubmit} round="2026-kevat" />);

  await waitFor(() => expect(screen.getByRole("combobox", { name: "Äidinkielen arvosana" })).toHaveTextContent("M"));
  expect(screen.getByRole("combobox", { name: "Äidinkielen koe" })).toHaveTextContent("Ruotsi äidinkielenä");
  const submitButton = screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" });
  await user.click(submitButton);
  const form = submitButton.closest("form");
  expect(form).not.toBeNull();
  fireEvent.submit(form as HTMLFormElement);

  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(recalculateFromGrades).toHaveBeenCalledWith(
    { selectionMethod: "Todistusvalinta (YO)", yoGrades: { ai_sv: "M" } },
    "2026-kevat",
  );
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    amk: { applicationRound: "2026-kevat", maximumScore: 198, score: 34 },
    selectionMethod: "Todistusvalinta (YO)",
    university: { applicationRound: "2026-kevat" },
    yoGrades: { ai_sv: "M" },
  });
  expect(event).toHaveBeenCalledWith("calculate_score");
});
