import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import ShareButton from "@/components/ShareButton";

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

test("shares a file without a URL when the browser can share files", async () => {
  const onShared = vi.fn();
  const file = new File(["kuva"], "oma-hakulista.jpg", { type: "image/jpeg" });
  const share = vi.fn().mockResolvedValue(undefined);
  const canShare = vi.fn().mockReturnValue(true);
  const user = userEvent.setup();
  vi.stubGlobal("navigator", { canShare, share });

  renderWithChakra(<ShareButton getShareFile={async () => file} label="Jaa tämä hakulista" onShared={onShared} />);
  await user.click(screen.getByRole("button", { name: "Jaa tämä hakulista" }));

  expect(canShare).toHaveBeenCalledWith({ files: [file] });
  expect(share).toHaveBeenCalledWith({ files: [file], title: "Oma hakulista" });
  expect(onShared).toHaveBeenCalledOnce();

  share.mockRejectedValueOnce(new Error("Share dismissed"));
  await user.click(screen.getByRole("button", { name: "Jaa tämä hakulista" }));
  expect(onShared).toHaveBeenCalledOnce();
});

test("downloads the image when file sharing is unavailable", async () => {
  const onShared = vi.fn();
  const file = new File(["kuva"], "oma-hakulista.jpg", { type: "image/jpeg" });
  const user = userEvent.setup();
  const createObjectURL = vi.fn().mockReturnValue("blob:hakulista");
  const revokeObjectURL = vi.fn();
  vi.stubGlobal("navigator", {});
  vi.spyOn(URL, "createObjectURL").mockImplementation(createObjectURL);
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(revokeObjectURL);
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

  renderWithChakra(<ShareButton getShareFile={async () => file} label="Jaa tämä hakulista" onShared={onShared} />);
  await user.click(screen.getByRole("button", { name: "Jaa tämä hakulista" }));

  expect(createObjectURL).toHaveBeenCalledWith(file);
  expect(onShared).toHaveBeenCalledOnce();
  expect(screen.getByRole("button", { name: "Kuva ladattu" })).toBeInTheDocument();
});
