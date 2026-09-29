import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import LandingPage from "@/pages/index/+Page";
import { renderWithChakra } from "@/test/render";

const TOINEN_ASTE_LABEL = "2027 toisen asteen yhteishakuun";
const KORKEAKOULU_LABEL = "Kevään 2027 ensimmäiseen yhteishakuun";

function stubResizeObserver() {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
}

test("shows the countdown for the selected education tab", async () => {
  stubResizeObserver();
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(Date.parse("2026-09-29T12:00:00+03:00"));
  const user = userEvent.setup();
  renderWithChakra(<LandingPage />);

  expect(screen.getByText(TOINEN_ASTE_LABEL)).toBeInTheDocument();
  expect(screen.queryByText(KORKEAKOULU_LABEL)).not.toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));

  expect(screen.getByText(KORKEAKOULU_LABEL)).toBeInTheDocument();
  expect(screen.queryByText(TOINEN_ASTE_LABEL)).not.toBeInTheDocument();

  await user.click(screen.getByRole("tab", { name: "Toinen aste" }));

  expect(screen.getByText(TOINEN_ASTE_LABEL)).toBeInTheDocument();
  expect(screen.queryByText(KORKEAKOULU_LABEL)).not.toBeInTheDocument();
});
