import { screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import Pagination from "./Pagination";

test("uses Finnish accessible pagination labels", () => {
  renderWithChakra(<Pagination count={30} onPageChange={vi.fn()} page={1} pageSize={10} />);

  expect(screen.getByRole("navigation", { name: "Sivutus" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sivu 1/3" })).toBeInTheDocument();
});
