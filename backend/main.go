package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
	"school-api/models"
	"school-api/services"
)

const (
	configPath        = "config.json"
	dataOutputDir     = "../frontend/public/data"
	schoolsOutputPath = dataOutputDir + "/schools.json"
)

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "generation failed:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	if len(args) != 1 {
		return errors.New("usage: go run . <vipunen|opintopolku|all>")
	}

	cfg, err := readConfig(configPath)
	if err != nil {
		return err
	}

	switch args[0] {
	case "vipunen":
		return generateVipunen(cfg.Vipunen)
	case "opintopolku":
		return generateOpintopolku(cfg.Opintopolku)
	case "all":
		if err := generateVipunen(cfg.Vipunen); err != nil {
			return err
		}
		return generateOpintopolku(cfg.Opintopolku)
	default:
		return fmt.Errorf("unknown source %q; use vipunen, opintopolku, or all", args[0])
	}
}

func readConfig(path string) (models.Config, error) {
	var cfg models.Config

	file, err := os.Open(path)
	if err != nil {
		return cfg, fmt.Errorf("open %s: %w", path, err)
	}
	defer file.Close()

	decoder := json.NewDecoder(file)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(&cfg); err != nil {
		return cfg, fmt.Errorf("decode %s: %w", path, err)
	}

	return cfg, nil
}

func generateVipunen(cfg models.VipunenConfig) error {
	apiURL, err := services.BuildVipunenURL(cfg.AineistoURL, cfg.TilastoVuosi)
	if err != nil {
		return fmt.Errorf("invalid Vipunen configuration: %w", err)
	}
	outputPath, err := statisticsOutputPath(cfg.TilastoVuosi)
	if err != nil {
		return fmt.Errorf("invalid Vipunen configuration: %w", err)
	}

	fetched, err := services.FetchVipunenData(apiURL)
	if err != nil {
		return err
	}
	if len(fetched) == 0 {
		return errors.New("Vipunen returned no records")
	}

	merged := services.MergeRecords(fetched)
	statistics := services.TransformVipunenData(merged)
	if len(statistics) == 0 {
		return errors.New("Vipunen produced no statistics after cleanup")
	}

	if err := writeJSON(outputPath, statistics); err != nil {
		return err
	}

	fmt.Printf("Vipunen: year=%s fetched=%d generated=%d output=%s\n", cfg.TilastoVuosi, len(fetched), len(statistics), outputPath)
	return nil
}

func statisticsOutputPath(year string) (string, error) {
	if len(year) != 4 {
		return "", errors.New("tilastoVuosi must be a four-digit year")
	}
	for _, character := range year {
		if character < '0' || character > '9' {
			return "", errors.New("tilastoVuosi must be a four-digit year")
		}
	}

	return filepath.Join(dataOutputDir, "statistics-"+year+".json"), nil
}

func generateOpintopolku(cfg models.OpintopolkuConfig) error {
	apiURL, selection, err := services.BuildOpintopolkuURL(cfg.YhteishakuOID, cfg.Alkamisajankohdat)
	if err != nil {
		return fmt.Errorf("invalid Opintopolku configuration: %w", err)
	}

	fetched, err := services.FetchOpintopolkuData(apiURL)
	if err != nil {
		return err
	}
	if fetched == nil || len(fetched.Hits) == 0 {
		return errors.New("Opintopolku returned no records")
	}

	schools := services.TransformOpintopolkuData(fetched)
	if len(schools) == 0 {
		return errors.New("Opintopolku produced no schools after cleanup")
	}

	if err := writeJSON(schoolsOutputPath, schools); err != nil {
		return err
	}

	fmt.Printf("Opintopolku: selection=%s fetched=%d generated=%d output=%s\n", selection, len(fetched.Hits), len(schools), schoolsOutputPath)
	return nil
}

func writeJSON(path string, value any) error {
	directory := filepath.Dir(path)
	if err := os.MkdirAll(directory, 0755); err != nil {
		return fmt.Errorf("create output directory %s: %w", directory, err)
	}

	temporary, err := os.CreateTemp(directory, ".generated-*.json")
	if err != nil {
		return fmt.Errorf("create temporary output for %s: %w", path, err)
	}
	temporaryPath := temporary.Name()
	defer os.Remove(temporaryPath)

	encoder := json.NewEncoder(temporary)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(value); err != nil {
		temporary.Close()
		return fmt.Errorf("encode %s: %w", path, err)
	}
	if err := temporary.Close(); err != nil {
		return fmt.Errorf("close temporary output for %s: %w", path, err)
	}
	if err := os.Rename(temporaryPath, path); err != nil {
		return fmt.Errorf("replace %s: %w", path, err)
	}

	return nil
}
