// Run with: pnpm exec tsx src/pages/pistelaskuri/lib/scoring.test.ts
import assert from "node:assert/strict";
import { emptyAmmFormState, parseAmmForm } from "../components/AmmForm";
import { calculateAmmScore } from "./ammScoring";
import { emptyYoFormState, parseYoForm, type YoLanguageValue } from "./yoForm";
import { calculateYoScore } from "./yoScoring";

// AMM: kolme yhteistä tutkinnon osaa 3+3+3 (asteikko 1-5) tuottavat 30 pistettä,
// keskiarvo 3,96 tuottaa 58 pistettä.
assert.equal(calculateAmmScore({ scale: "1-5", grades: [3, 3, 3], keskiarvo: 3.96 }), 88);

// Asteikko 1-3 sekä ääripäät.
assert.equal(calculateAmmScore({ scale: "1-5", grades: [5, 5, 5], keskiarvo: 5.0 }), 150);
assert.equal(calculateAmmScore({ scale: "1-5", grades: [1, 1, 1], keskiarvo: 1.0 }), 3);
assert.equal(calculateAmmScore({ scale: "1-3", grades: [3, 3, 3], keskiarvo: 3.0 }), 150);
assert.equal(calculateAmmScore({ scale: "1-3", grades: [1, 1, 1], keskiarvo: 1.0 }), 6);

// Keskiarvotaulukon rajatapaukset: 3,94 -> 58, mutta 3,93 jää edelliseen 57-pisteen koriin.
assert.equal(calculateAmmScore({ scale: "1-5", grades: [1, 1, 1], keskiarvo: 3.94 }), 3 + 58);
assert.equal(calculateAmmScore({ scale: "1-5", grades: [1, 1, 1], keskiarvo: 3.93 }), 3 + 57);
assert.equal(calculateAmmScore({ scale: "1-5", grades: [1, 1, 1], keskiarvo: 3.98 }), 3 + 59);

// Sama rajatapaus asteikolla 1-3, jotta ka(1-3)-sarake tulee myös testattua.
assert.equal(calculateAmmScore({ scale: "1-3", grades: [1, 1, 1], keskiarvo: 2.37 }), 6 + 58);
assert.equal(calculateAmmScore({ scale: "1-3", grades: [1, 1, 1], keskiarvo: 2.36 }), 6 + 57);

// YO: äidinkieli M + lyhyt matematiikka M + keskipitkä toinen kotimainen C + filosofia E + fysiikka B = 115/198.
assert.equal(
  calculateYoScore({
    aidinkieli: "M",
    matematiikka: { level: "lyhyt", grade: "M" },
    kielet: [{ type: "kotimainen", level: "keskipitkä", grade: "C" }],
    reaaliaineet: [
      { subject: "Filosofia", grade: "E" },
      { subject: "Fysiikka", grade: "B" },
    ],
  }),
  115,
);

// Maksimipisteet: äidinkieli + matematiikka + kieli + kaksi reaaliainetta, kaikki L.
assert.equal(
  calculateYoScore({
    aidinkieli: "L",
    matematiikka: { level: "pitkä", grade: "L" },
    kielet: [{ type: "vieras", level: "pitkä", grade: "L" }],
    reaaliaineet: [
      { subject: "Fysiikka", grade: "L" },
      { subject: "Kemia", grade: "L" },
    ],
  }),
  198,
);

// Neljän aineen todistus (ei matematiikkaa): äidinkieli L (46) + kieli L (46) + kaksi reaaliainetta L (30+30) = 152.
assert.equal(
  calculateYoScore({
    aidinkieli: "L",
    kielet: [{ type: "vieras", level: "pitkä", grade: "L" }],
    reaaliaineet: [
      { subject: "Fysiikka", grade: "L" },
      { subject: "Kemia", grade: "L" },
    ],
  }),
  152,
);

// Kielten optimaalinen sijoittelu: naiivi "paras kieliarvosana kielipaikalle" epäonnistuisi tässä.
// Englanti pitkä L (kielipaikalla 46, reaalipaikalla vain 30) vs. ruotsi keskipitkä L (kielipaikalla 38,
// ei kelpaa reaalipaikalle). Paras yhdistelmä on ruotsi kielipaikalla ja englanti reaalipaikalla: 38+30=68,
// ei englanti kielipaikalla 46.
assert.equal(
  calculateYoScore({
    aidinkieli: "A",
    kielet: [
      { type: "vieras", level: "pitkä", grade: "L" },
      { type: "kotimainen", level: "keskipitkä", grade: "L" },
    ],
    reaaliaineet: [],
  }),
  10 + 68,
);

// Jokaista suoritusta käytetään korkeintaan kerran: sama englannin suoritus ei täytä sekä kieli- että reaalipaikkaa.
assert.equal(
  calculateYoScore({
    aidinkieli: "A",
    kielet: [{ type: "vieras", level: "pitkä", grade: "L" }],
    reaaliaineet: [],
  }),
  10 + 46,
);

// Vuoden 2026 rajoitus: toinen kotimainen kieli ei kelpaa reaali-/vieraskielipaikalle, vaikka se tuottaisi
// enemmän pisteitä kuin ainoa reaaliaine.
assert.equal(
  calculateYoScore({
    aidinkieli: "A",
    kielet: [
      { type: "kotimainen", level: "pitkä", grade: "L" },
      { type: "vieras", level: "pitkä", grade: "A" },
    ],
    reaaliaineet: [{ subject: "Fysiikka", grade: "A" }],
  }),
  // Kielipaikka: kotimainen pitkä L=46 (parempi kuin vieras A:n 10). Reaalipaikat: fysiikka A=3 ja vieras
  // kielen reaalipaikka-arvo A=3 (kotimainen ei kelpaisi reaalipaikalle joka tapauksessa).
  10 + 46 + 3 + 3,
);

const completeYoForm = {
  ...emptyYoFormState(),
  aidinkieli: "L" as const,
  matematiikkaGrade: "L" as const,
  kielet: [{ id: 0, language: "englanti-pitka" as const, grade: "L" as const }],
  reaaliaineet: [
    { id: 1, subject: "Fysiikka", grade: "L" as const },
    { id: 2, subject: "Kemia", grade: "L" as const },
  ],
};
const parsedYoForm = parseYoForm(completeYoForm);
assert.ok("input" in parsedYoForm);
assert.equal(calculateYoScore(parsedYoForm.input), 198);

const duplicateLanguageResult = parseYoForm({
  ...completeYoForm,
  kielet: [...completeYoForm.kielet, { id: 3, language: "englanti-lyhyt", grade: "E" }],
});
if ("input" in duplicateLanguageResult) assert.fail("Duplicate language should fail validation.");
assert.equal(duplicateLanguageResult.errors.kielet, "Saman kielen voi lisätä vain kerran.");

const incompleteLanguageResult = parseYoForm({
  ...completeYoForm,
  kielet: [{ id: 0, language: "", grade: "L" }],
});
if ("input" in incompleteLanguageResult) assert.fail("Incomplete language should fail validation.");
assert.equal(incompleteLanguageResult.errors.kielet, "Täytä kaikki lisätyt kielet tai poista keskeneräinen rivi.");

const parseLanguage = (language: YoLanguageValue) => {
  const result = parseYoForm({
    ...emptyYoFormState(),
    aidinkieli: "L",
    kielet: [{ id: 0, language, grade: "L" }],
  });
  assert.ok("input" in result);
  return result.input.kielet[0];
};

assert.deepEqual(parseLanguage("englanti-pitka"), { grade: "L", level: "pitkä", type: "vieras" });
assert.deepEqual(parseLanguage("ranska-lyhyt"), { grade: "L", level: "lyhyt", type: "vieras" });
assert.deepEqual(parseLanguage("toinen-kotimainen-pitka"), { grade: "L", level: "pitkä", type: "kotimainen" });
assert.deepEqual(parseLanguage("toinen-kotimainen-keskipitka"), {
  grade: "L",
  level: "keskipitkä",
  type: "kotimainen",
});

const duplicateSubjectResult = parseYoForm({
  ...completeYoForm,
  reaaliaineet: [...completeYoForm.reaaliaineet, { id: 3, subject: "Fysiikka", grade: "E" }],
});
if ("input" in duplicateSubjectResult) assert.fail("Duplicate real subject should fail validation.");
assert.equal(duplicateSubjectResult.errors.reaaliaineet, "Saman reaaliaineen voi lisätä vain kerran.");

const validAmmForm = parseAmmForm({
  ...emptyAmmFormState(),
  grades: [5, 5, 5],
  keskiarvoInput: "5,00",
});
assert.ok("input" in validAmmForm);
assert.equal(calculateAmmScore(validAmmForm.input), 150);

const invalidAmmForm = parseAmmForm({ ...emptyAmmFormState(), keskiarvoInput: "5,01" });
if ("input" in invalidAmmForm) assert.fail("Out-of-range average should fail validation.");
assert.equal(invalidAmmForm.errors.keskiarvo, "Anna painotettu keskiarvo väliltä 1,00–5,00.");

console.log("scoring.test.ts: OK");
