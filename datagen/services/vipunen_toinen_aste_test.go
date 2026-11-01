package services

import "testing"

func TestFilterToinenAste(t *testing.T) {
	rows := []ToinenAsteRow{
		{Haku: "Ammatillisen koulutuksen ja lukiokoulutuksen yhteishaku", KooditHakukohde: "old", KaikkiHakijatLkm: 5},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "new"},
		{Haku: "Jatkuva haku", KooditHakukohde: "continuous", KaikkiHakijatLkm: 10},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "1.2.246.562.20.00000000000000087412"},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "1.2.246.562.20.00000000000000083894"},
	}
	got, hasApplicants := FilterToinenAste(rows)
	if !hasApplicants || len(got) != 2 || got[0].KooditHakukohde != "old" || got[1].KooditHakukohde != "new" || got[0].Haku != "" {
		t.Fatalf("unexpected filtered data: %+v, applicants=%v", got, hasApplicants)
	}
	_, hasApplicants = FilterToinenAste(rows[1:])
	if hasApplicants {
		t.Fatal("continuous applications must not count as published joint-application applicants")
	}
}
