import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import { renderWithChakra } from "@/test/render";
import type { StatisticsEntry } from "@/types.gen";
import CompareBar from "@/components/CompareBar";

const entry = (id: string, name: string): StatisticsEntry => ({
  kooditHakukohde: id,
  hakukohde: name,
  aloituspaikatLkm: 10,
  kaikkiHakijatLkm: 100,
  ensisijaisetHakijatLkm: 20,
  valitutLkm: 10,
});

test("disables comparison with one selection and removes the selected entry", async () => {
  const selected = { degree: entry("a", "Kohde A"), year: "2026_kevat" as const };
  const onRemove = vi.fn();
  const user = userEvent.setup();

  renderWithChakra(<CompareBar onRemove={onRemove} selected={[selected]} />);

  expect(screen.getByRole("button", { name: "Vertaile" })).toBeDisabled();
  await user.click(screen.getByRole("button", { name: "Poista Kohde A, kevät 2026" }));
  expect(onRemove).toHaveBeenCalledWith(selected);
});

test("creates an encoded comparison URL and tracks comparison", async () => {
  const event = vi.fn();
  const user = userEvent.setup();
  vi.stubGlobal("sa_event", event);

  renderWithChakra(
    <CompareBar
      onRemove={vi.fn()}
      selected={[
        { degree: entry("a&1", "Kohde A"), year: "2026_kevat" },
        { degree: entry("b/2", "Kohde B"), year: "2025_syksy" },
      ]}
    />,
  );

  const link = screen.getByRole("link", { name: "Vertaile" });
  expect(link).toHaveAttribute("href", "/vertaile/?a=a%261&b=b%2F2&vuosi=2026_kevat&vuosi_b=2025_syksy");

  link.addEventListener("click", (click) => click.preventDefault());
  await user.click(link);
  expect(event).toHaveBeenCalledWith("compare_degrees");
});
