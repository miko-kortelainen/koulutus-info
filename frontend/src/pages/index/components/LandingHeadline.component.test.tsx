import { act, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import LandingHeadline, { HERO_HEADING_NAME } from "@/pages/index/components/LandingHeadline";
import { renderWithChakra } from "@/test/render";

function isVisibleTopic(name: string) {
  return (_content: string, element: Element | null) =>
    element?.tagName === "SPAN" && element.textContent === name && !element.hasAttribute("aria-hidden");
}

test("names the headline with every cycling topic", () => {
  renderWithChakra(<LandingHeadline />);

  expect(
    screen.getByRole("heading", { level: 1, name: (accessibleName) => accessibleName === HERO_HEADING_NAME }),
  ).toBeInTheDocument();
  expect(screen.getByText(isVisibleTopic("hakijamäärät"))).toBeInTheDocument();
});

test("cycles from hakijamäärät to pisterajat", () => {
  vi.useFakeTimers();
  renderWithChakra(<LandingHeadline />);

  expect(screen.getByText(isVisibleTopic("hakijamäärät"))).toBeInTheDocument();

  act(() => {
    vi.advanceTimersByTime(2500);
  });

  expect(screen.getByText(isVisibleTopic("pisterajat"))).toBeInTheDocument();
});

test("keeps the first topic when reduced motion is preferred", () => {
  window.matchMedia = (query: string) => ({
    matches: query.includes("prefers-reduced-motion"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
  vi.useFakeTimers();
  renderWithChakra(<LandingHeadline />);

  act(() => {
    vi.advanceTimersByTime(5000);
  });

  expect(screen.getByText(isVisibleTopic("hakijamäärät"))).toBeInTheDocument();
  expect(screen.queryByText(isVisibleTopic("pisterajat"))).not.toBeInTheDocument();
});
