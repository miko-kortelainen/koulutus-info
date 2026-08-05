import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { APPEARANCE_STORAGE_KEY, ColorModeButton } from "@/components/color-mode";
import { renderWithChakra } from "@/test/render";

test("toggles appearance and persists the choice", async () => {
  const user = userEvent.setup();
  localStorage.removeItem(APPEARANCE_STORAGE_KEY);

  renderWithChakra(<ColorModeButton />);

  const toggle = await screen.findByRole("button", { name: "Tumma teema" });
  await waitFor(() => {
    expect(toggle).toBeEnabled();
  });
  expect(toggle).toHaveAttribute("aria-pressed", "false");

  await user.click(toggle);

  expect(toggle).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);

  await waitFor(() => {
    expect(toggle).toBeEnabled();
  });
  await user.click(toggle);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: "Tumma teema" })).toHaveAttribute("aria-pressed", "false");
  });
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("light");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

test("ignores rapid repeat clicks during cooldown", async () => {
  const user = userEvent.setup();
  localStorage.removeItem(APPEARANCE_STORAGE_KEY);

  renderWithChakra(<ColorModeButton />);

  const toggle = await screen.findByRole("button", { name: "Tumma teema" });
  await waitFor(() => {
    expect(toggle).toBeEnabled();
  });

  await user.click(toggle);
  await user.click(toggle);

  expect(await screen.findByRole("button", { name: "Tumma teema" })).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
});
