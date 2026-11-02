package main

import (
	"datagen/models"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"sort"
	"strings"
)

// Institution short names for schools.json display. Finnish universities without
// an established short stay name-only.
var schoolShortNames = map[string]string{
	"Centria-ammattikorkeakoulu":         "Centria",
	"Diakonia-ammattikorkeakoulu":        "Diak",
	"Haaga-Helia ammattikorkeakoulu":     "Haaga-Helia",
	"Humanistinen ammattikorkeakoulu":    "Humak",
	"Hämeen ammattikorkeakoulu":          "HAMK",
	"Jyväskylän ammattikorkeakoulu":      "Jamk",
	"Kaakkois-Suomen ammattikorkeakoulu": "Xamk",
	"Kajaanin ammattikorkeakoulu":        "KAMK",
	"Karelia-ammattikorkeakoulu":         "Karelia",
	"LAB-ammattikorkeakoulu":             "LAB",
	"Lapin ammattikorkeakoulu":           "Lapin AMK",
	"Laurea-ammattikorkeakoulu":          "Laurea",
	"Metropolia Ammattikorkeakoulu":      "Metropolia",
	"Oulun ammattikorkeakoulu":           "OAMK",
	"Satakunnan ammattikorkeakoulu":      "SAMK",
	"Savonia-ammattikorkeakoulu":         "Savonia",
	"Seinäjoen ammattikorkeakoulu":       "SEAMK",
	"Tampereen ammattikorkeakoulu":       "TAMK",
	"Turun ammattikorkeakoulu":           "Turun AMK",
	"Vaasan ammattikorkeakoulu":          "VAMK",
	"Yrkeshögskolan Arcada":              "Arcada",
	"Yrkeshögskolan Novia":               "Novia",
	"Åbo Akademi":                        "ÅA",
	"Svenska handelshögskolan":           "Hanken",
}

func maybeRebuildSchoolCatalog(currentRound string, programPaths []string, catalogRequired bool) error {
	if len(programPaths) == 0 {
		if catalogRequired {
			return errors.New("school catalog requires current_programs-*.json")
		}
		fmt.Printf("School catalog: skipped (missing programme files); run opintopolku or catalog after programmes exist\n")
		return nil
	}
	return rebuildSchoolCatalog(currentRound, programPaths)
}

func rebuildSchoolCatalog(currentRound string, programPaths []string) error {
	statsRounds, err := availableStatisticsRounds(statisticsOutputDir)
	if err != nil {
		return err
	}
	if currentRound == "" || len(statsRounds) == 0 {
		return errors.New("school catalog requires currentStatisticsRound")
	}

	names := make(map[string]struct{})
	for _, path := range programPaths {
		programsData, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("school catalog requires %s: %w", path, err)
		}
		var programs models.CurrentProgramsResponse
		if err := json.Unmarshal(programsData, &programs); err != nil {
			return fmt.Errorf("decode %s: %w", path, err)
		}
		for _, programme := range programs {
			for _, toteutus := range programme.Toteutukset {
				if name := strings.TrimSpace(toteutus.OppilaitosNimi.Fi); name != "" {
					names[name] = struct{}{}
				}
			}
		}
	}

	for _, round := range statsRounds {
		statsPath := filepath.Join(statisticsOutputDir, "hakijamaarat-"+strings.ReplaceAll(round, "_", "-")+".json")
		statsData, err := os.ReadFile(statsPath)
		if err != nil {
			return fmt.Errorf("school catalog requires %s: %w", statsPath, err)
		}
		var statistics models.StatisticsResponse
		if err := json.Unmarshal(statsData, &statistics); err != nil {
			return fmt.Errorf("decode %s: %w", statsPath, err)
		}
		for _, row := range statistics {
			if name := strings.TrimSpace(row.Korkeakoulu); name != "" {
				names[name] = struct{}{}
			}
		}
	}
	if len(names) == 0 {
		return errors.New("school catalog union produced no names")
	}

	sorted := make([]string, 0, len(names))
	for name := range names {
		sorted = append(sorted, name)
	}
	// ponytail: catalog order non-semantic; UI sorts with localeCompare("fi")
	sort.Strings(sorted)

	catalog := make(models.SchoolCatalog, 0, len(sorted))
	for _, name := range sorted {
		catalog = append(catalog, models.SchoolCatalogEntry{Name: name, ShortName: schoolShortNames[name]})
	}
	if err := writeJSON(schoolsCatalogPath, catalog); err != nil {
		return err
	}
	fmt.Printf("School catalog: round=%s schools=%d output=%s\n", currentRound, len(catalog), schoolsCatalogPath)
	return nil
}
