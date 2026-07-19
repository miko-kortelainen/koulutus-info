package services

import (
	"school-api/models"
	"testing"
)

func TestClassifyTutkintotaso(t *testing.T) {
	cases := []struct {
		name     string
		school   models.School
		koulutus string
		want     string
	}{
		{"amk bachelor", models.School{Koulutustyyppi: "amk", OpintojenLaajuusNumero: 210}, "Sairaanhoitaja (AMK)", "alempi"},
		{"ylempi in koulutus name", models.School{Koulutustyyppi: "amk", OpintojenLaajuusNumero: 90}, "Tradenomi (ylempi AMK), talous, hallinto ja markkinointi", "ylempi"},
		{"jatkotutkinto naming", models.School{Koulutustyyppi: "amk"}, "Sosiaali- ja terveysalan AMK-jatkotutkinto, muu tai tuntematon ala", "ylempi"},
		{
			"ylempi only in hit name",
			models.School{Koulutustyyppi: "amk", Nimi: models.LanguageStrings{Fi: "Ylempi AMK, kokonaisturvallisuuden asiantuntija"}, OpintojenLaajuusNumero: 90},
			"Tradenomi (AMK), talous, hallinto ja markkinointi",
			"ylempi",
		},
		{
			"small laajuus fallback for english master",
			models.School{Koulutustyyppi: "amk", Nimi: models.LanguageStrings{En: "Master of Business Administration, Business Management"}, OpintojenLaajuusNumero: 90},
			"",
			"ylempi",
		},
		{
			"muuntokoulutus stays alempi despite small laajuus",
			models.School{Koulutustyyppi: "amk", Nimi: models.LanguageStrings{Fi: "Insinööri (AMK) Akkutekniikan muuntokoulutus"}, OpintojenLaajuusNumero: 75},
			"Insinööri (AMK), sähkötekniikka",
			"alempi",
		},
		{"yo kandidaatti", models.School{Koulutustyyppi: "yo", OpintojenLaajuusNumero: 300}, "Luonnont. kand., tietojenkäsittelytiede", "alempi"},
		{"yo maisterihaku", models.School{Koulutustyyppi: "yo", OpintojenLaajuusNumero: 120}, "Fil. maist., tietojenkäsittelytiede", "ylempi"},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := classifyTutkintotaso(tc.school, models.LanguageStrings{Fi: tc.koulutus})
			if got != tc.want {
				t.Errorf("classifyTutkintotaso() = %q, want %q", got, tc.want)
			}
		})
	}
}

func TestTransformOpintopolkuDataFlagsMuuntokoulutus(t *testing.T) {
	data := &models.OpintopolkuData{
		Hits: []models.School{{
			Oid:                    "oid-1",
			Koulutustyyppi:         "amk",
			OpintojenLaajuusNumero: 210,
			Koulutukset:            []models.Koulutus{{Nimi: models.LanguageStrings{Fi: "Sosionomi (AMK), sosiaaliala"}}},
			Toteutukset: []models.Toteutus{
				{ToteutusOid: "1", ToteutusNimi: models.LanguageStrings{Fi: "Sosionomi (AMK), muuntokoulutus 90 -120 op"}},
				{ToteutusOid: "2", ToteutusNimi: models.LanguageStrings{Fi: "Sosionomi (AMK), päivätoteutus"}},
			},
		}},
	}

	result := TransformOpintopolkuData(data, map[string][]string{"oid-1": {"Terveys- ja hyvinvointialat"}})
	if len(result) != 1 {
		t.Fatalf("expected 1 entry, got %d", len(result))
	}
	entry := result[0]
	if entry.Sektori != "amk" || entry.Tutkintotaso != "alempi" {
		t.Errorf("unexpected classification: sektori=%q tutkintotaso=%q", entry.Sektori, entry.Tutkintotaso)
	}
	if !entry.Toteutukset[0].Muuntokoulutus || entry.Toteutukset[1].Muuntokoulutus {
		t.Errorf("muuntokoulutus flags wrong: %v, %v", entry.Toteutukset[0].Muuntokoulutus, entry.Toteutukset[1].Muuntokoulutus)
	}
	for i, tot := range entry.Toteutukset {
		if len(tot.Koulutusalat) != 1 || tot.Koulutusalat[0] != "Terveys- ja hyvinvointialat" {
			t.Errorf("toteutus %d koulutusalat = %v, want [Terveys- ja hyvinvointialat]", i, tot.Koulutusalat)
		}
	}
}

func TestAlaNamesFromKoodiUrit(t *testing.T) {
	detail := &koulutusDetail{KoulutuskoodienAlatJaAsteet: []koulutusalaEntry{
		{KoulutusalaKoodiUrit: []string{"kansallinenkoulutusluokitus2016koulutusalataso1_08", "okmohjauksenala_9#1"}},
		{KoulutusalaKoodiUrit: []string{"okmohjauksenala_9", "okmohjauksenala_12#2"}},
	}}
	names, err := alaNamesFromKoodiUrit(detail)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	want := []string{"Maa- ja metsätalousalat", "Palvelualat"}
	if len(names) != 2 || names[0] != want[0] || names[1] != want[1] {
		t.Errorf("names = %v, want %v", names, want)
	}

	unknown := &koulutusDetail{
		KoulutuskoodienAlatJaAsteet: []koulutusalaEntry{{KoulutusalaKoodiUrit: []string{"okmohjauksenala_13#1"}}},
	}
	if _, err := alaNamesFromKoodiUrit(unknown); err == nil {
		t.Error("expected error for unmapped code")
	}

	empty := &koulutusDetail{}
	if _, err := alaNamesFromKoodiUrit(empty); err == nil {
		t.Error("expected error for missing codes")
	}
}
