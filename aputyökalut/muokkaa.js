import { readFileSync, writeFileSync } from "fs";

function muokkaaJson() {
  try {
    const tiedostonNimi = "koulutusvastuut.json"; // Alkuperäinen tiedosto
    const uusiTiedosto = "koulutukset_paivitetty.json";

    // 1. Lue data
    const data = JSON.parse(readFileSync(tiedostonNimi, "utf8"));

    // 2. Muokkaa dataa lisäämällä uudet kentät
    const paivitettyData = data.map((item) => {
      return {
        title: item.koulutus, // Kopioidaan koulutus titleksi
        description: "", // Tyhjä kuvaus
        tags: [],
        ...item, // Pidetään alkuperäiset koulutus ja koulut -kentät
      };
    });

    // 3. Tallenna uusi tiedosto
    // null, 2 tekee JSONista helposti luettavaa (sisennys 2 välilyöntiä)
    writeFileSync(uusiTiedosto, JSON.stringify(paivitettyData, null, 2), "utf8");

    console.log(`✅ Valmis! Päivitetty data tallennettu tiedostoon: ${uusiTiedosto}`);
    console.log(`Rivejä käsiteltiin: ${paivitettyData.length} kpl`);
  } catch (error) {
    console.error("Virhe tiedoston käsittelyssä:", error.message);
  }
}

muokkaaJson();
