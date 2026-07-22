import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ShareButton from "./ShareButton";

test("reports a completed share", async () => {
  const onShared = vi.fn();
  const share = vi.fn().mockResolvedValue(undefined);
  const user = userEvent.setup();
  vi.stubGlobal("navigator", { share });

  renderWithChakra(<ShareButton label="Jaa" onShared={onShared} />);
  await user.click(screen.getByRole("button", { name: "Jaa" }));

  expect(share).toHaveBeenCalledWith({ title: document.title, url: window.location.href });
  expect(onShared).toHaveBeenCalledOnce();

  share.mockRejectedValueOnce(new Error("Share dismissed"));
  await user.click(screen.getByRole("button", { name: "Jaa" }));
  expect(onShared).toHaveBeenCalledOnce();
});
