import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { StatisticsEntry } from "@/types.gen";
import CompareBar from "./CompareBar";

const entry = (id: string, name: string): StatisticsEntry => ({
  kooditHakukohde: id,
  hakukohde: name,
  aloituspaikatLkm: 10,
  kaikkiHakijatLkm: 100,
  ensisijaisetHakijatLkm: 20,
});

test("disables comparison with one selection and removes the selected entry", async () => {
  const selected = entry("a", "Kohde A");
  const onRemove = vi.fn();
  const user = userEvent.setup();

  renderWithChakra(<CompareBar onRemove={onRemove} selected={[selected]} year="2026_kevat" />);

  expect(screen.getByRole("button", { name: "Vertaile" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Poista Kohde A" }));
  expect(onRemove).toHaveBeenCalledWith(selected);
});

test("creates an encoded comparison URL with two selections", () => {
  renderWithChakra(
    <CompareBar onRemove={vi.fn()} selected={[entry("a&1", "Kohde A"), entry("b/2", "Kohde B")]} year="2026_kevat" />,
  );

  expect(screen.getByRole("link", { name: "Vertaile" })).toHaveAttribute(
    "href",
    "/vertaile/?a=a%261&b=b%2F2&vuosi=2026_kevat",
  );
});
