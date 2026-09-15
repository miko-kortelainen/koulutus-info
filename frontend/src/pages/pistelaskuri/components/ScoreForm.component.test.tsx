import { fireEvent, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ScoreForm from "@/pages/pistelaskuri/components/ScoreForm";
import type { YoFormState } from "@/pages/pistelaskuri/lib/yoForm";

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
  const { recalculateFromGrades } = await import("@/pages/pistelaskuri/lib/todistusvalinta/index");
  const event = vi.fn();
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  window.localStorage.setItem(
    "yhteishaku:pistelaskuri",
    JSON.stringify({
      version: 1,
      yo: {
        aineet: [
          { id: 0, subject: "ai_sv", grade: "M" },
          { id: 1, subject: "matematiikka-pitka", grade: "E" },
          { id: 2, subject: "englanti-pitka", grade: "M" },
          { id: 3, subject: "Fysiikka", grade: "C" },
        ],
      },
    }),
  );
  vi.stubGlobal("sa_event", event);

  renderWithChakra(<ScoreForm onModeChange={vi.fn()} onSubmit={onSubmit} round="2026-kevat" />);

  await waitFor(() =>
    expect(screen.getByRole("combobox", { name: "Aine 1" })).toHaveTextContent("Ruotsi äidinkielenä"),
  );
  expect(screen.getByRole("combobox", { name: "Aineen 1 arvosana" })).toHaveTextContent("M");
  const submitButton = screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" });
  await user.click(submitButton);
  const form = submitButton.closest("form");
  expect(form).not.toBeNull();
  fireEvent.submit(form as HTMLFormElement);

  await waitFor(() => expect(onSubmit).toHaveBeenCalled());
  expect(recalculateFromGrades).toHaveBeenCalledWith(
    { selectionMethod: "Todistusvalinta (YO)", yoGrades: { ai_sv: "M", ena: "M", fy: "C", maa: "E" } },
    "2026-kevat",
  );
  expect(onSubmit.mock.calls[0][0]).toMatchObject({
    amk: { applicationRound: "2026-kevat", maximumScore: 198, score: 34 },
    selectionMethod: "Todistusvalinta (YO)",
    university: { applicationRound: "2026-kevat" },
    yoGrades: { ai_sv: "M", ena: "M", fy: "C", maa: "E" },
  });
  expect(event).toHaveBeenCalledWith("calculate_score");
});

test("valintatapa tabs expose ID references without whitespace", async () => {
  const onModeChange = vi.fn();
  const user = userEvent.setup();
  renderWithChakra(<ScoreForm onModeChange={onModeChange} onSubmit={vi.fn()} round="2026-kevat" />);

  const yoTab = screen.getByRole("tab", { name: "YO" });
  const yoControls = yoTab.getAttribute("aria-controls");
  expect(yoTab.id).toMatch(/^\S+$/);
  expect(yoControls).toMatch(/^\S+$/);
  expect(document.getElementById(yoControls ?? "")).toHaveAttribute("role", "tabpanel");

  await user.click(screen.getByRole("tab", { name: "AMM" }));
  expect(onModeChange).toHaveBeenCalledWith("Todistusvalinta (AMM)");

  const ammTab = screen.getByRole("tab", { name: "AMM" });
  const ammControls = ammTab.getAttribute("aria-controls");
  expect(ammTab.id).toMatch(/^\S+$/);
  expect(ammControls).toMatch(/^\S+$/);
  expect(document.getElementById(ammControls ?? "")).toHaveAttribute("role", "tabpanel");
  expect(screen.getByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" })).toBeVisible();
});

test("applied YO grades show after storage hydrate", async () => {
  renderWithChakra(
    <ScoreForm
      applied={{ mode: "Todistusvalinta (YO)", yo: { aineet: [{ id: 0, subject: "ai_fi", grade: "L" }] } }}
      onModeChange={vi.fn()}
      onSubmit={vi.fn()}
      round="2026-kevat"
    />,
  );

  await waitFor(() => expect(screen.getByRole("combobox", { name: "Aine 1" })).toHaveTextContent("Suomi äidinkielenä"));
  expect(screen.getByRole("combobox", { name: "Aineen 1 arvosana" })).toHaveTextContent("L");
});

const yoValidationCases: { message: string; name: string; state: YoFormState }[] = [
  {
    message: "Täytä kaikki lisätyt aineet tai poista keskeneräinen rivi.",
    name: "an incomplete subject",
    state: { aineet: [{ id: 0, subject: "", grade: "" }] },
  },
  {
    message: "Valitse äidinkieli.",
    name: "a missing mother tongue",
    state: { aineet: [{ id: 0, subject: "matematiikka-pitka", grade: "E" }] },
  },
  {
    message: "Saman aineen voi lisätä vain kerran.",
    name: "duplicate language levels",
    state: {
      aineet: [
        { id: 0, subject: "ai_fi", grade: "L" },
        { id: 1, subject: "englanti-pitka", grade: "M" },
        { id: 2, subject: "englanti-lyhyt", grade: "E" },
      ],
    },
  },
];

test.each(yoValidationCases)("shows the YO validation error for $name", async ({ message, state }) => {
  const user = userEvent.setup();
  renderWithChakra(
    <ScoreForm
      applied={{ mode: "Todistusvalinta (YO)", yo: state }}
      onModeChange={vi.fn()}
      onSubmit={vi.fn()}
      round="2026-kevat"
    />,
  );

  await waitFor(() => expect(screen.getAllByRole("combobox", { name: /^Aine \d+$/ })).toHaveLength(state.aineet.length));
  await user.click(screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }));

  expect(await screen.findByText(message)).toBeVisible();
});

test("adds and removes YO subject rows", async () => {
  const user = userEvent.setup();
  renderWithChakra(
    <ScoreForm
      applied={{ mode: "Todistusvalinta (YO)", yo: { aineet: [{ id: 4, subject: "ai_fi", grade: "L" }] } }}
      onModeChange={vi.fn()}
      onSubmit={vi.fn()}
      round="2026-kevat"
    />,
  );

  await waitFor(() => expect(screen.getByRole("combobox", { name: "Aine 1" })).toHaveTextContent("Suomi äidinkielenä"));
  expect(screen.queryByRole("button", { name: "Poista aine 1" })).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "+ Lisää aine" }));
  await user.click(screen.getByRole("button", { name: "Poista aine 1" }));

  expect(screen.getByRole("combobox", { name: "Aine 1" })).toHaveTextContent("Valitse aine");
  expect(screen.queryByRole("button", { name: "Poista aine 1" })).not.toBeInTheDocument();
});

test("submits applied AMM grades and an edited weighted average", async () => {
  const { recalculateFromGrades } = await import("@/pages/pistelaskuri/lib/todistusvalinta/index");
  vi.mocked(recalculateFromGrades).mockClear();
  const onSubmit = vi.fn();
  const user = userEvent.setup();
  renderWithChakra(
    <ScoreForm
      applied={{
        amm: { grades: [3, 2, 1], keskiarvoInput: "2,81", scale: "1-3" },
        mode: "Todistusvalinta (AMM)",
      }}
      onModeChange={vi.fn()}
      onSubmit={onSubmit}
      round="2026-kevat"
    />,
  );

  const average = await screen.findByRole("textbox", { name: "Tutkinnon painotettu keskiarvo" });
  await user.clear(average);
  await user.type(average, "2,5");
  await user.click(screen.getByRole("button", { name: "Laske pisteet / näytä koulutukset" }));

  await waitFor(() => expect(onSubmit).toHaveBeenCalledOnce());
  expect(recalculateFromGrades).toHaveBeenCalledWith(
    {
      ammGrades: {
        communication: 3,
        gradeScale: 3,
        mathematicsSciences: 2,
        societyWork: 1,
        weightedAverage: 2.5,
      },
      selectionMethod: "Todistusvalinta (AMM)",
    },
    "2026-kevat",
  );
});
