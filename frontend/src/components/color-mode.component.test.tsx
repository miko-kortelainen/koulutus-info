import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import { APPEARANCE_STORAGE_KEY, ColorModeButton } from "@/components/color-mode";
import { renderWithChakra } from "@/test/render";

test("toggles appearance and persists the choice", async () => {
  const user = userEvent.setup();
  localStorage.removeItem(APPEARANCE_STORAGE_KEY);

  renderWithChakra(<ColorModeButton />);

  const toggle = await screen.findByRole("button", { name: /tumma teema/i });
  await waitFor(() => {
    expect(toggle).toBeEnabled();
  });
  expect(toggle).toHaveAttribute("aria-pressed", "false");
  expect(toggle).toHaveTextContent("Vaihda tummaan ulkoasuun");

  await user.click(toggle);

  expect(screen.getByRole("button", { name: /vaalea teema/i })).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
  expect(document.documentElement.classList.contains("dark")).toBe(true);

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /vaalea teema/i })).toBeEnabled();
  });
  await user.click(screen.getByRole("button", { name: /vaalea teema/i }));

  await waitFor(() => {
    expect(screen.getByRole("button", { name: /tumma teema/i })).toHaveAttribute("aria-pressed", "false");
  });
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("light");
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

test("ignores rapid repeat clicks during cooldown", async () => {
  const user = userEvent.setup();
  localStorage.removeItem(APPEARANCE_STORAGE_KEY);

  renderWithChakra(<ColorModeButton />);

  const toggle = await screen.findByRole("button", { name: /tumma teema/i });
  await waitFor(() => {
    expect(toggle).toBeEnabled();
  });

  await user.click(toggle);
  await user.click(toggle);

  expect(await screen.findByRole("button", { name: /vaalea teema/i })).toHaveAttribute("aria-pressed", "true");
  expect(localStorage.getItem(APPEARANCE_STORAGE_KEY)).toBe("dark");
});
