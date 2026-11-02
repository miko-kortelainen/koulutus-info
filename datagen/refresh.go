package main

import (
	"datagen/models"
	"datagen/services"
	"errors"
	"fmt"
	"path/filepath"
	"sort"
	"strings"
)

func generateVipunen(cfg models.VipunenConfig) (bool, error) {
	apiURL, err := services.BuildVipunenURL(cfg)
	if err != nil {
		return false, fmt.Errorf("invalid Vipunen configuration: %w", err)
	}
	var fetched []services.VipunenRow
	if err := services.FetchJSON("vipunen", apiURL, &fetched); err != nil {
		return false, err
	}
	if len(fetched) == 0 {
		return false, errors.New("Vipunen returned no records")
	}

	recordsByRound, err := services.GroupStatisticsByRound(fetched)
	if err != nil {
		return false, err
	}

	rounds := make([]string, 0, len(recordsByRound))
	for round := range recordsByRound {
		rounds = append(rounds, round)
	}
	sort.Sort(sort.Reverse(sort.StringSlice(rounds)))

	changedAny := false
	for _, round := range rounds {
		statistics := services.DropConflictingEmptyDuplicates(services.MergeRecords(recordsByRound[round]))
		if len(statistics) == 0 {
			return false, fmt.Errorf("Vipunen produced no statistics for %s after cleanup", round)
		}

		outputPath := filepath.Join(statisticsOutputDir, "hakijamaarat-"+strings.ReplaceAll(round, "_", "-")+".json")
		if err := validateRecordCount(outputPath, len(statistics), "Vipunen statistics"); err != nil {
			return false, err
		}
		changed, err := jsonChanged(outputPath, statistics)
		if err != nil {
			return false, err
		}
		if err := writeJSON(outputPath, statistics); err != nil {
			return false, err
		}
		changedAny = changedAny || changed
		fmt.Printf(
			"Vipunen: startYear=%d round=%s fetched=%d generated=%d changed=%t output=%s\n",
			cfg.TilastoVuosi,
			round,
			len(recordsByRound[round]),
			len(statistics),
			changed,
			outputPath,
		)
	}

	return changedAny, nil
}

func generateOpintopolku(haut []models.OpintopolkuHaku, alkamisajankohdat []string) (bool, error) {
	changedAny := false
	for _, haku := range haut {
		changed, err := generateOneHaku(haku, alkamisajankohdat)
		if err != nil {
			return false, err
		}
		changedAny = changedAny || changed
	}
	return changedAny, nil
}

func generateOneHaku(haku models.OpintopolkuHaku, alkamisajankohdat []string) (bool, error) {
	apiURL, selection, err := services.BuildOpintopolkuURL(haku.OID, alkamisajankohdat)
	if err != nil {
		return false, fmt.Errorf("invalid Opintopolku configuration for %s: %w", haku.ID, err)
	}

	fetched, err := services.FetchOpintopolkuData(apiURL)
	if err != nil {
		return false, fmt.Errorf("%s: %w", haku.ID, err)
	}
	if fetched == nil || len(fetched.Hits) == 0 {
		return false, fmt.Errorf("Opintopolku returned no records for %s", haku.ID)
	}

	koulutusalat, err := services.FetchKoulutusalat(fetched.Hits)
	if err != nil {
		return false, fmt.Errorf("%s: %w", haku.ID, err)
	}

	programs := services.TransformOpintopolkuData(fetched, koulutusalat)
	if len(programs) == 0 {
		return false, fmt.Errorf("Opintopolku produced no programmes after cleanup for %s", haku.ID)
	}
	outputPath := programsOutputPath(haku.ID)
	if err := validateRecordCount(outputPath, len(programs), "Opintopolku programmes "+haku.ID); err != nil {
		return false, err
	}
	changed, err := jsonChanged(outputPath, programs)
	if err != nil {
		return false, err
	}

	if err := writeJSON(outputPath, programs); err != nil {
		return false, err
	}

	fmt.Printf("Opintopolku: id=%s selection=%s fetched=%d generated=%d changed=%t output=%s\n", haku.ID, selection, len(fetched.Hits), len(programs), changed, outputPath)
	return changed, nil
}
