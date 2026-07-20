import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import FeedbackWidget from "./FeedbackWidget";

const VISIT_COUNT_KEY = "yhteishaku:visit-count";

beforeEach(() => {
  localStorage.clear();
  sessionStorage.clear();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("stays hidden on the 1st visit and appears from the 2nd visit onward", async () => {
  const { unmount } = renderWithChakra(<FeedbackWidget />);
  expect(screen.queryByRole("button", { name: "Anna palautetta" })).not.toBeInTheDocument();
  unmount();

  sessionStorage.clear();
  renderWithChakra(<FeedbackWidget />);
  expect(await screen.findByRole("button", { name: "Anna palautetta" })).toBeInTheDocument();
});

test("counts at most one visit per session", async () => {
  const { unmount } = renderWithChakra(<FeedbackWidget />);
  unmount();
  sessionStorage.clear();

  const { unmount: unmount2 } = renderWithChakra(<FeedbackWidget />);
  await screen.findByRole("button", { name: "Anna palautetta" });
  expect(localStorage.getItem(VISIT_COUNT_KEY)).toBe("2");
  unmount2();

  renderWithChakra(<FeedbackWidget />);
  await screen.findByRole("button", { name: "Anna palautetta" });
  expect(localStorage.getItem(VISIT_COUNT_KEY)).toBe("2");
});

test("shows the optional textarea only for a low rating, and hides it again for a high rating", async () => {
  localStorage.setItem(VISIT_COUNT_KEY, "2");
  const user = userEvent.setup();
  renderWithChakra(<FeedbackWidget />);

  await user.click(screen.getByRole("button", { name: "Anna palautetta" }));
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Anna arvosana 2/5" }));
  expect(screen.getByRole("textbox")).toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: "Anna arvosana 5/5" }));
  expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
});

test("disables submit until a rating is chosen, then submits and hides the widget", async () => {
  localStorage.setItem(VISIT_COUNT_KEY, "2");
  const fetchMock = vi.fn().mockResolvedValue({ ok: true });
  vi.stubGlobal("fetch", fetchMock);
  const user = userEvent.setup();
  renderWithChakra(<FeedbackWidget />);

  await user.click(screen.getByRole("button", { name: "Anna palautetta" }));
  expect(screen.getByRole("button", { name: "Lähetä" })).toBeDisabled();

  await user.click(screen.getByRole("button", { name: "Anna arvosana 4/5" }));
  await user.click(screen.getByRole("button", { name: "Lähetä" }));

  expect(fetchMock).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole("button", { name: "Anna palautetta" })).not.toBeInTheDocument();
  expect(localStorage.getItem("yhteishaku:feedback-given")).toBe("true");
});

test('"Älä näytä uudelleen" hides the widget without submitting', async () => {
  localStorage.setItem(VISIT_COUNT_KEY, "2");
  const fetchMock = vi.fn();
  vi.stubGlobal("fetch", fetchMock);
  const user = userEvent.setup();
  renderWithChakra(<FeedbackWidget />);

  await user.click(screen.getByRole("button", { name: "Anna palautetta" }));
  await user.click(screen.getByRole("button", { name: "Älä näytä uudelleen" }));

  expect(fetchMock).not.toHaveBeenCalled();
  expect(screen.queryByRole("button", { name: "Anna palautetta" })).not.toBeInTheDocument();
  expect(localStorage.getItem("yhteishaku:feedback-given")).toBe("true");
});
