import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import type { UniversityFeedback as UniversityFeedbackData } from "@/api/dataValidation";
import { renderWithChakra } from "@/test/render";
import UniversityFeedback from "./UniversityFeedback";

const feedback: UniversityFeedbackData = {
  tilastot: {
    vastaajatLkm: 1234,
    keskiarvo: 3.67,
    keskihajonta: 0.91,
  },
  koulutusalat: {
    "Kauppa, hallinto ja oikeustieteet": {
      tilastot: {
        vastaajatLkm: 297,
        keskiarvo: 3.7,
        keskihajonta: 0.86,
      },
      osiot: {
        "Opetuksen kehittäminen": {
          tasot: {
            "Opetus ja oppiminen": {
              tilastot: {
                vastaajatLkm: 297,
                keskiarvo: 4,
                keskihajonta: null,
              },
              kohteet: [
                {
                  kohde: "Olen tyytyväinen opintoihini.",
                  tilastot: {
                    vastaajatLkm: 297,
                    keskiarvo: 4.08,
                    keskihajonta: 0.86,
                  },
                },
                {
                  kohde: "Opetus on ollut laadukasta.",
                  tilastot: {
                    vastaajatLkm: 291,
                    keskiarvo: 3.92,
                    keskihajonta: 0.91,
                  },
                },
              ],
            },
            Ohjaus: {
              tilastot: {
                vastaajatLkm: null,
                keskiarvo: null,
                keskihajonta: null,
                salattu: true,
              },
              kohteet: [
                {
                  kohde: "Olen saanut riittävästi ohjausta.",
                  tilastot: {
                    vastaajatLkm: null,
                    keskiarvo: null,
                    keskihajonta: null,
                    salattu: true,
                  },
                },
              ],
            },
          },
        },
        "Opintojen aikainen työssäkäynti": {
          tilastot: {
            vastaajatLkm: 120,
            keskiarvo: 3.5,
            keskihajonta: null,
          },
          kohteet: [
            {
              kohde: "Työssäkäynti on tukenut opintojani.",
              tilastot: {
                vastaajatLkm: 120,
                keskiarvo: 3.5,
                keskihajonta: 1.1,
              },
            },
          ],
        },
        "Opiskelu ja oppiminen": {
          tasot: {
            I: {
              tilastot: {
                vastaajatLkm: 290,
                keskiarvo: 3.6,
                keskihajonta: null,
              },
              kohteet: [
                {
                  kohde: "Olen opiskellut suunnitelmallisesti.",
                  tilastot: {
                    vastaajatLkm: 290,
                    keskiarvo: 3.6,
                    keskihajonta: 0.9,
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
};

test("opens a field and topic to show aggregate and question statistics", async () => {
  const user = userEvent.setup();
  renderWithChakra(<UniversityFeedback feedback={feedback} />);
  expect(screen.getByRole("link", { name: "Vipunen.fi" })).toHaveAttribute(
    "href",
    "https://vipunen.fi/fi-fi/yliopisto/Sivut/Opiskelijapalaute.aspx",
  );
  expect(
    screen.getByText(
      /Tulokset sisältävät vain rahoitusmallikysymykset\.\s*1 = täysin eri mieltä • 5 = täysin samaa mieltä\./,
    ),
  ).toBeVisible();
  expect(screen.getByText("3,67")).toBeVisible();
  expect(screen.queryByText("Olen tyytyväinen opintoihini.")).not.toBeInTheDocument();

  await user.click(
    screen.getByRole("button", { name: /Kauppa, hallinto ja oikeustieteet.*297 vastaajaa.*Keskiarvo 3,70/ }),
  );

  expect(screen.getByRole("button", { name: /Opetus ja oppiminen.*Kysymyksiä: 2.*Keskiarvo 4,00/ })).toBeVisible();
  expect(screen.getByRole("button", { name: /Ohjaus.*Kysymyksiä: 1.*Alle 5 vastaajaa/ })).toBeVisible();
  expect(
    screen.getByRole("button", {
      name: /Opintojen aikainen työssäkäynti.*Kysymyksiä: 1.*Keskiarvo 3,50/,
    }),
  ).toBeVisible();
  expect(
    screen.getByRole("button", {
      name: /Opiskelu ja oppiminen – osa I.*Kysymyksiä: 1.*Keskiarvo 3,60/,
    }),
  ).toBeVisible();
  expect(screen.queryByText("Olen tyytyväinen opintoihini.")).not.toBeInTheDocument();

  await user.click(screen.getByRole("button", { name: /Opetus ja oppiminen/ }));

  expect(await screen.findByText("Olen tyytyväinen opintoihini.")).toBeVisible();
  expect(screen.getByText("Keskimääräinen vastaus 4,08 / 5")).toBeVisible();
  expect(screen.getAllByText("297 vastaajaa")).toHaveLength(2);
  expect(screen.getByText("Keskihajonta 0,86")).toBeVisible();
});
