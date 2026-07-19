import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import Pagination from "./Pagination";

test("uses Finnish accessible pagination labels", () => {
  renderWithChakra(<Pagination count={30} onPageChange={vi.fn()} page={1} pageSize={10} />);

  expect(screen.getByRole("navigation", { name: "Sivutus" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sivu 1/3" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Edellinen sivu" })).toBeDisabled();
  expect(screen.getByRole("button", { name: "Seuraava sivu" })).toBeEnabled();
});

test("page items and triggers report the new page and scroll to top", async () => {
  vi.stubGlobal("scrollTo", vi.fn());
  const user = userEvent.setup();
  const onPageChange = vi.fn();
  renderWithChakra(<Pagination count={30} onPageChange={onPageChange} page={1} pageSize={10} />);

  await user.click(screen.getByRole("button", { name: "Sivu 2/3" }));
  expect(onPageChange).toHaveBeenLastCalledWith(2);

  await user.click(screen.getByRole("button", { name: "Seuraava sivu" }));
  expect(onPageChange).toHaveBeenLastCalledWith(2);
  expect(window.scrollTo).toHaveBeenCalled();
});
