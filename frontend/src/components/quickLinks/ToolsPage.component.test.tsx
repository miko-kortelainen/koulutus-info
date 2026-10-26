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
  renderWithChakra(<ToolsPage title="Hakijalle" />);

  expect(screen.getByRole("heading", { name: "Hakijalle" })).toBeInTheDocument();
  expect(
    within(screen.getByRole("tabpanel", { name: "Toinen aste" })).getByRole("link", { name: /^lukiot/ }),
  ).toHaveAttribute("href", "/lukiot/");
  await user.click(screen.getByRole("tab", { name: "Korkeakoulutus" }));
  const panel = screen.getByRole("tabpanel", { name: "Korkeakoulutus" });
  expect(within(panel).getByRole("link", { name: /^pisterajat/ })).toHaveAttribute("href", "/pisterajat/");
  expect(within(panel).getByRole("link", { name: /^oppaat/ })).toHaveAttribute("href", "/oppaat/");
});
