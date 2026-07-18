import { screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ApplicantTotalsChart from "./ApplicantTotalsChart";

test("names the chart and exposes its data as text", () => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );

  renderWithChakra(
    <ApplicantTotalsChart
      chartData={[
        { year: "2025", total: 100 },
        { year: "2026", total: 125 },
      ]}
      color="blue.solid"
      title="Ensisijaiset hakijat vuosittain"
    />,
  );

  expect(screen.getByRole("img", { name: "Ensisijaiset hakijat vuosittain" })).toBeInTheDocument();
  expect(screen.getByText("Ensisijaiset hakijat vuosittain: 2025 100, 2026 125")).toBeInTheDocument();
});
