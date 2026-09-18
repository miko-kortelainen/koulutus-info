import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import QuickLinkTabs from "@/pages/index/components/QuickLinkTabs";
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

test("shows toinen aste quick links by default", () => {
  stubResizeObserver();
  renderWithChakra(<QuickLinkTabs />);

  expect(screen.getByRole("tablist", { name: "Pikalinkit koulutusasteittain" })).toBeInTheDocument();
  const toinenAste = screen.getByRole("tab", { name: "Toinen aste" });
  expect(toinenAste).toHaveAttribute("aria-selected", "true");
  expect(toinenAste.id).toMatch(/^\S+$/);
  expect(toinenAste.getAttribute("aria-controls")).toMatch(/^\S+$/);

  const panel = screen.getByRole("tabpanel", { name: "Toinen aste" });
  expect(within(panel).getByRole("link", { name: /^lukiot(\s|$)/ })).toHaveAttribute("href", "/lukiot/");
  expect(within(panel).queryByRole("link", { name: /^pistelaskuri(\s|$)/ })).not.toBeInTheDocument();
});

test("switches to korkeakoulutus quick links", async () => {
  stubResizeObserver();
  const user = userEvent.setup();
  renderWithChakra(<QuickLinkTabs />);

  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));

  expect(screen.getByRole("tab", { name: "Korkeakoulutus" })).toHaveAttribute("aria-selected", "true");

  const panel = screen.getByRole("tabpanel", { name: "Korkeakoulutus" });
  expect(within(panel).getByRole("link", { name: /^pistelaskuri(\s|$)/ })).toHaveAttribute("href", "/pistelaskuri/");
  expect(within(panel).queryByRole("link", { name: /^lukiot(\s|$)/ })).not.toBeInTheDocument();
});
