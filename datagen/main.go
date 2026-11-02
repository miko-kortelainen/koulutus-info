package main

import (
	"datagen/models"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"slices"
	"strings"
	"time"
)

const (
	configPath              = "config.json"
	dataOutputDir           = "../frontend/public/data"
	statisticsOutputDir     = dataOutputDir + "/hakijamäärät"
	hakijaprofiiliOutputDir = dataOutputDir + "/hakijaprofiili"
	schoolsCatalogPath      = dataOutputDir + "/schools.json"
	metaOutputPath          = dataOutputDir + "/meta.json"
	manifestModulePath      = "../frontend/src/generated/dataManifest.ts"
)

var hakuIDPattern = regexp.MustCompile(`^\d{4}_(kevat|syksy)(_[1-9]\d*)?$`)

var (
	statisticsFilename     = regexp.MustCompile(`^hakijamaarat-(\d{4})-(kevat|syksy)\.json$`)
	hakijaprofiiliFilename = regexp.MustCompile(`^hakijaprofiili-(\d{4})-(kevat|syksy)\.json$`)
)

type refreshOptions struct {
	statistics  bool
	programmes  bool
	catalog     bool // offline schools.json rebuild; requires on-disk programmes + stats
	haut        []models.OpintopolkuHaku
	vipunen     models.VipunenConfig
	opintopolku models.OpintopolkuConfig
}

func programmeFilename(id string) string {
	return "current_programs-" + strings.ReplaceAll(id, "_", "-") + ".json"
}

func programsOutputPath(id string) string {
	return filepath.Join(dataOutputDir, programmeFilename(id))
}

func hautWithProgrammeFiles(dir string, haut []models.OpintopolkuHaku) []models.OpintopolkuHaku {
	existing := make([]models.OpintopolkuHaku, 0, len(haut))
	for _, haku := range haut {
		if _, err := os.Stat(filepath.Join(dir, programmeFilename(haku.ID))); err == nil {
			existing = append(existing, haku)
		}
	}
	return existing
}

func validateHaut(haut []models.OpintopolkuHaku) error {
	if len(haut) == 0 {
		return errors.New("opintopolku.haut must contain at least one haku")
	}
	seenID := make(map[string]struct{}, len(haut))
	seenOID := make(map[string]struct{}, len(haut))
	for _, haku := range haut {
		id := strings.TrimSpace(haku.ID)
		oid := strings.TrimSpace(haku.OID)
		if id == "" || oid == "" {
			return errors.New("opintopolku.haut entries require id and oid")
		}
		if !hakuIDPattern.MatchString(id) {
			return fmt.Errorf("invalid haku id %q; use YYYY_kevat_N or YYYY_syksy", id)
		}
		if _, exists := seenID[id]; exists {
			return fmt.Errorf("duplicate haku id %q", id)
		}
		if _, exists := seenOID[oid]; exists {
			return fmt.Errorf("duplicate haku oid %q", oid)
		}
		seenID[id] = struct{}{}
		seenOID[oid] = struct{}{}
	}
	return nil
}

func filterHautByOID(haut []models.OpintopolkuHaku, oid string) ([]models.OpintopolkuHaku, error) {
	i := slices.IndexFunc(haut, func(haku models.OpintopolkuHaku) bool { return haku.OID == oid })
	if i < 0 {
		return nil, fmt.Errorf("yhteishaku oid %q is not in opintopolku.haut", oid)
	}
	return haut[i : i+1], nil
}

func programmeFilesOnDisk(haut []models.OpintopolkuHaku) []string {
	existing := hautWithProgrammeFiles(dataOutputDir, haut)
	paths := make([]string, 0, len(existing))
	for _, haku := range existing {
		paths = append(paths, programsOutputPath(haku.ID))
	}
	return paths
}

func main() {
	if err := run(os.Args[1:]); err != nil {
		fmt.Fprintln(os.Stderr, "generation failed:", err)
		os.Exit(1)
	}
}

func run(args []string) error {
	cfg, err := readConfig(configPath)
	if err != nil {
		return err
	}

	options, err := parseRefreshOptions(args, cfg)
	if err != nil {
		return err
	}

	meta, err := readMeta(metaOutputPath)
	if err != nil {
		return err
	}
	now := time.Now().UTC()

	dataChanged := false
	if options.statistics {
		changed, err := generateVipunen(options.vipunen)
		if err != nil {
			return err
		}
		if err := generateToinenAste(options.vipunen.TilastoVuosi); err != nil {
			return err
		}
		if changed {
			meta.StatisticsUpdatedAt = &now
			dataChanged = true
		}
	}
	if options.programmes {
		if err := validateHaut(options.opintopolku.Haut); err != nil {
			return err
		}
		changed, err := generateOpintopolku(options.haut, options.opintopolku.Alkamisajankohdat)
		if err != nil {
			return err
		}
		programmesHaut := hautWithProgrammeFiles(dataOutputDir, options.opintopolku.Haut)
		if len(programmesHaut) == 0 {
			return errors.New("no programme files were generated")
		}
		if changed || !slices.Equal(meta.ProgrammesHaut, programmesHaut) {
			meta.ProgrammesUpdatedAt = &now
			dataChanged = true
		}
		meta.ProgrammesHaut = programmesHaut
	} else if existing := hautWithProgrammeFiles(dataOutputDir, options.opintopolku.Haut); len(existing) > 0 {
		meta.ProgrammesHaut = existing
	}

	statisticsRounds, err := availableStatisticsRounds(statisticsOutputDir)
	if err != nil {
		return err
	}
	if len(statisticsRounds) == 0 {
		return errors.New("no statistics files were generated")
	}

	meta.StatisticsRounds = statisticsRounds
	meta.CurrentStatisticsRound = statisticsRounds[0]
	if dataChanged {
		meta.GeneratedAt = now
	}
	if err := writeJSON(metaOutputPath, meta); err != nil {
		return err
	}
	if err := writeDataManifestModule(manifestModulePath, meta); err != nil {
		return err
	}

	if err := maybeRebuildSchoolCatalog(meta.CurrentStatisticsRound, programmeFilesOnDisk(options.opintopolku.Haut), options.catalog); err != nil {
		return err
	}

	fmt.Printf(
		"Data manifest: currentStatisticsRound=%s statisticsRounds=%v\n",
		meta.CurrentStatisticsRound,
		meta.StatisticsRounds,
	)
	return nil
}

func parseRefreshOptions(args []string, cfg models.Config) (refreshOptions, error) {
	if len(args) == 1 {
		switch args[0] {
		case "vipunen":
			return refreshOptions{statistics: true, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
		case "opintopolku":
			return refreshOptions{programmes: true, haut: cfg.Opintopolku.Haut, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
		case "all":
			return refreshOptions{statistics: true, programmes: true, haut: cfg.Opintopolku.Haut, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
		case "catalog":
			// Offline rebuild of schools.json from on-disk programmes + current stats round.
			return refreshOptions{catalog: true, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
		}
	}

	flags := flag.NewFlagSet("data generator", flag.ContinueOnError)
	flags.SetOutput(io.Discard)
	year := flags.Int("year", cfg.Vipunen.TilastoVuosi, "programme start year")
	statistics := flags.Bool("statistics", false, "refresh Vipunen statistics")
	programmes := flags.Bool("programmes", false, "refresh Opintopolku programmes")
	yhteishakuOID := flags.String("yhteishaku-oid", "", "refresh only this configured joint-application OID")
	if err := flags.Parse(args); err != nil {
		return refreshOptions{}, fmt.Errorf("parse arguments: %w", err)
	}
	if flags.NArg() != 0 {
		return refreshOptions{}, fmt.Errorf("unknown command %q; use --statistics and/or --programmes", flags.Arg(0))
	}
	if *year < 1000 || *year > 9999 {
		return refreshOptions{}, errors.New("--year must be a four-digit year")
	}
	if !*statistics && !*programmes {
		*statistics = true
		*programmes = true
	}

	configuredYear := cfg.Vipunen.TilastoVuosi
	cfg.Vipunen.TilastoVuosi = *year
	haut := cfg.Opintopolku.Haut
	oid := strings.TrimSpace(*yhteishakuOID)
	if *programmes {
		if oid == "" && *year != configuredYear {
			return refreshOptions{}, fmt.Errorf("--programmes for %d requires --yhteishaku-oid because the joint-application OID is sourced manually", *year)
		}
		if oid != "" {
			filtered, err := filterHautByOID(cfg.Opintopolku.Haut, oid)
			if err != nil {
				return refreshOptions{}, err
			}
			haut = filtered
		}
	}

	return refreshOptions{
		statistics:  *statistics,
		programmes:  *programmes,
		haut:        haut,
		vipunen:     cfg.Vipunen,
		opintopolku: cfg.Opintopolku,
	}, nil
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
