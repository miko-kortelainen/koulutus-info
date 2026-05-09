import fs from "fs";

const data1 = JSON.parse(fs.readFileSync("data.json", "utf8"));
const data2 = JSON.parse(fs.readFileSync("data2.json", "utf8"));

// Indeksoi data2 hakukohteen koodin mukaan
const idx = Object.fromEntries(data2.map((r) => [r.kooditHakukohde, r]));

const merged = data1.map((r) => {
  const match = idx[r.kooditHakukohde];
  if (!match) return r;

  // Yhdistä: null-arvot täytetään toisen tiedoston arvoilla
  return Object.fromEntries(Object.keys(r).map((k) => [k, r[k] ?? match[k]]));
});

const filtered = merged.filter((r) => r.koulutuksenKieli !== "vain englanti");

fs.writeFileSync("merged.json", JSON.stringify(filtered, null, 2));
console.log(`Mergetty ${merged.length} riviä, jäljellä ${filtered.length} suodatuksen jälkeen`);
