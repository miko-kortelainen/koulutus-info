import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import ToolsPage from "@/components/quickLinks/ToolsPage";
import { renderWithChakra } from "@/test/render";

test("shows tools for the selected education level", async () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
  const user = userEvent.setup();
  renderWithChakra(<ToolsPage />);

  expect(
    within(screen.getByRole("tabpanel", { name: "Toinen aste" })).getByRole("link", { name: /^lukiot/ }),
  ).toHaveAttribute("href", "/lukiot/");
  expect(
    within(screen.getByRole("tabpanel", { name: "Toinen aste" })).getByRole("link", { name: /^hakijamäärät/ }),
  ).toHaveAttribute("href", "/hakijamaarat/toinen-aste/");
  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));
  const panel = screen.getByRole("tabpanel", { name: "Korkeakoulutus" });
  expect(within(panel).getByRole("link", { name: /^pisterajat/ })).toHaveAttribute("href", "/pisterajat/");
  expect(within(panel).getByRole("link", { name: /^oppaat/ })).toHaveAttribute("href", "/oppaat/");
});

test("remembers the selected education level on return", async () => {
  localStorage.removeItem("yhteishaku:hakijalle-education-level");
  const user = userEvent.setup();
  const { unmount } = renderWithChakra(<ToolsPage rememberSelection />);

  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));
  unmount();
  const next = renderWithChakra(<ToolsPage rememberSelection />);
  expect(screen.getByRole("tab", { name: "Korkeakoulutus" })).toHaveAttribute("aria-selected", "true");
  await user.click(screen.getByRole("tab", { name: "Toinen aste" }));
  next.unmount();
  renderWithChakra(<ToolsPage rememberSelection />);
  expect(screen.getByRole("tab", { name: "Toinen aste" })).toHaveAttribute("aria-selected", "true");
  localStorage.removeItem("yhteishaku:hakijalle-education-level");
});
