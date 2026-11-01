package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestFilterToinenAste(t *testing.T) {
	rows := []toinenAsteRow{
		{Haku: "Ammatillisen koulutuksen ja lukiokoulutuksen yhteishaku", KooditHakukohde: "old", KaikkiHakijatLkm: 5},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "new"},
		{Haku: "Jatkuva haku", KooditHakukohde: "continuous", KaikkiHakijatLkm: 10},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "1.2.246.562.20.00000000000000087412"},
		{Haku: "Perusopetuksen jälkeisen koulutuksen yhteishaku", KooditHakukohde: "1.2.246.562.20.00000000000000083894"},
	}
	got, hasApplicants := filterToinenAste(rows)
	if !hasApplicants || len(got) != 2 || got[0].KooditHakukohde != "old" || got[1].KooditHakukohde != "new" || got[0].Haku != "" {
		t.Fatalf("unexpected filtered data: %+v, applicants=%v", got, hasApplicants)
	}
	_, hasApplicants = filterToinenAste(rows[1:])
	if hasApplicants {
		t.Fatal("continuous applications must not count as published joint-application applicants")
	}
}

func TestToinenAsteManifest(t *testing.T) {
	dir := t.TempDir()
	for _, name := range []string{"hakijamaarat-2020.json", "hakijamaarat-2026.json", "hakijamaarat-2025-kevat.json"} {
		if err := os.WriteFile(filepath.Join(dir, name), []byte("[]"), 0600); err != nil {
			t.Fatal(err)
		}
	}
	path := filepath.Join(dir, "years.ts")
	if err := writeToinenAsteManifest(dir, path); err != nil {
		t.Fatal(err)
	}
	contents, err := os.ReadFile(path)
	if err != nil {
		t.Fatal(err)
	}
	if !strings.Contains(string(contents), `["2026", "2020"]`) {
		t.Fatalf("unexpected manifest: %s", contents)
	}
}
