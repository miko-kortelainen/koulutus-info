### api endpoint response examples

---

/api/statistics

```json
[
  {
    "kooditHakukohde": "1.2.246.562.20.00000000000000083706",
    "hakukohde": "Agrolog (YH), Åbo, dagstudier",
    "korkeakoulu": "Yrkeshögskolan Novia",
    "koulutuksenKieli": "vain ruotsi",
    "sektori": "Ammattikorkeakoulukoulutus",
    "koulutusalaTaso1": "Maa- ja metsätalousalat",
    "aloituspaikatLkm": 22,
    "kaikkiHakijatLkm": 63,
    "ensisijaisetHakijatLkm": 23
  },
  {
    "kooditHakukohde": "1.2.246.562.20.00000000000000073204",
    "hakukohde": "Agrologi (AMK), maaseutuelinkeinot, monimuotototeutus",
    "korkeakoulu": "Oulun ammattikorkeakoulu",
    "koulutuksenKieli": "vain suomi",
    "sektori": "Ammattikorkeakoulukoulutus",
    "koulutusalaTaso1": "Maa- ja metsätalousalat",
    "aloituspaikatLkm": 35,
    "kaikkiHakijatLkm": 157,
    "ensisijaisetHakijatLkm": 43
  },
  {
    "kooditHakukohde": "1.2.246.562.20.00000000000000082774",
    "hakukohde": "Agrologi (AMK), maaseutuelinkeinot, monimuotototeutus, kevään yhteishaku",
    "korkeakoulu": "Hämeen ammattikorkeakoulu",
    "koulutuksenKieli": "vain suomi",
    "sektori": "Ammattikorkeakoulukoulutus",
    "koulutusalaTaso1": "Maa- ja metsätalousalat",
    "aloituspaikatLkm": 60,
    "kaikkiHakijatLkm": 209,
    "ensisijaisetHakijatLkm": 77
  }
]
```

---

/api/schools

```json
[
  {
    "nimi": {
      "fi": "Agrologi (AMK)",
      "en": "Bachelor of Natural Resources (UAS), Agronomist"
    },
    "toteutukset": [
      {
        "toteutusOid": "1.2.246.562.17.00000000000000003034",
        "toteutusNimi": {
          "fi": "Agrologi (AMK), monimuoto-opinnot, Rovaniemi"
        },
        "oppilaitosNimi": {
          "fi": "Lapin ammattikorkeakoulu",
          "en": "Lapland University of Applied Sciences"
        }
      },
      {
        "toteutusOid": "1.2.246.562.17.00000000000000035917",
        "toteutusNimi": {
          "fi": "Agrologi (AMK), Turku, päivätoteutus"
        },
        "oppilaitosNimi": {
          "fi": "Yrkeshögskolan Novia",
          "en": "Novia University of Applied Sciences"
        }
      }
    ]
  }
]
```
