import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import ToolsPage from "@/components/quickLinks/ToolsPage";
import LandingPage from "@/pages/index/+Page";
import { renderWithChakra } from "@/test/render";

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

test("shares the selected education level with Hakijalle", async () => {
  stubResizeObserver();
  localStorage.removeItem("yhteishaku:hakijalle-education-level");
  const user = userEvent.setup();
  const landing = renderWithChakra(<LandingPage />);
  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));
  landing.unmount();

  const tools = renderWithChakra(<ToolsPage rememberSelection />);
  expect(screen.getByRole("tab", { name: "Korkeakoulutus" })).toHaveAttribute("aria-selected", "true");
  await user.click(screen.getByRole("tab", { name: "Toinen aste" }));
  tools.unmount();

  renderWithChakra(<LandingPage />);
  expect(screen.getByRole("tab", { name: "Toinen aste" })).toHaveAttribute("aria-selected", "true");
  localStorage.removeItem("yhteishaku:hakijalle-education-level");
});

test("links to the 2027 joint application schedules", () => {
  stubResizeObserver();
  renderWithChakra(<LandingPage />);

  expect(screen.getByRole("link", { name: "Katso 2027 yhteishaun hakuaikataulut" })).toHaveAttribute(
    "href",
    "/yhteishaku-2027/",
  );
});
