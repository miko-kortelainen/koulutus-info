import { screen } from "@testing-library/react";
import { expect, test } from "vitest";
import Yhteishaku2027Cta from "@/components/Yhteishaku2027Cta";
import { renderWithChakra } from "@/test/render";

test("links to the 2027 joint application schedules", () => {
  renderWithChakra(<Yhteishaku2027Cta />);

  expect(screen.getByRole("link", { name: "Katso 2027 yhteishaun hakuaikataulut" })).toHaveAttribute(
    "href",
    "/yhteishaku-2027/",
  );
});
