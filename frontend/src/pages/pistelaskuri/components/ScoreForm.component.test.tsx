import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { CALCULATOR_API_URL } from "@/api/calculatorApi";
import { renderWithChakra } from "@/test/render";
import ScoreForm from "./ScoreForm";

test("submits YO grades to both API calculators and tracks success", async () => {
  const event = vi.fn();
  const onSubmit = vi.fn();
  const fetchMock = vi.fn(async (input: RequestInfo | URL, _init?: RequestInit) => {
    const url = String(input);
    const body = url.endsWith("/api/v1/calculate")
      ? { applicationRound: "2026-kevat", programs: [] }
      : {
          applicationRound: "2026-kevat",
          ammattikorkeakoulut: [],
          maximumScore: 198,
          score: 34,
        };
    return new Response(JSON.stringify(body), { status: 200 });
  });
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
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<ScoreForm onModeChange={vi.fn()} onSubmit={onSubmit} />);

  await waitFor(() => expect(screen.getByRole("combobox", { name: "Äidinkielen arvosana" })).toHaveTextContent("M"));
  expect(screen.getByRole("combobox", { name: "Äidinkielen koe" })).toHaveTextContent("Ruotsi äidinkielenä");
  await user.click(screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(fetchMock).toHaveBeenCalledTimes(2);
  expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
    `${CALCULATOR_API_URL}/calculate`,
    `${CALCULATOR_API_URL}/amk/calculate/yo`,
  ]);
  expect(fetchMock.mock.calls.map(([, init]) => init?.body)).toEqual([
    JSON.stringify({ grades: { ai_sv: "M" } }),
    JSON.stringify({ grades: { ai_sv: "M" } }),
  ]);
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    amk: { applicationRound: "2026-kevat", maximumScore: 198, score: 34 },
    selectionMethod: "Todistusvalinta (YO)",
    university: { applicationRound: "2026-kevat" },
  });
  expect(event).toHaveBeenCalledWith("calculate_score");
});
