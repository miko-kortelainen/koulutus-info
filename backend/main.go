package main

import (
	"bytes"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"regexp"
	"school-api/models"
	"school-api/services"
	"sort"
	"strconv"
	"strings"
	"time"
)

const (
	configPath              = "config.json"
	dataOutputDir           = "../frontend/public/data"
	statisticsOutputDir     = dataOutputDir + "/hakijamäärät"
	hakijaprofiiliOutputDir = dataOutputDir + "/hakijaprofiili"
	programsOutputPath      = dataOutputDir + "/current_programs.json"
	schoolsCatalogPath      = dataOutputDir + "/schools.json"
	metaOutputPath          = dataOutputDir + "/meta.json"
	manifestModulePath      = "../frontend/src/generated/dataManifest.ts"
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

var (
	statisticsFilename     = regexp.MustCompile(`^hakijamaarat-(\d{4})-(kevat|syksy)\.json$`)
	hakijaprofiiliFilename = regexp.MustCompile(`^hakijaprofiili-(\d{4})-(kevat|syksy)\.json$`)
)

type refreshOptions struct {
	statistics    bool
	programmes    bool
	catalog       bool // offline schools.json rebuild; requires on-disk programmes + stats
	yhteishakuOID string
	vipunen       models.VipunenConfig
	opintopolku   models.OpintopolkuConfig
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
		if changed {
			meta.StatisticsUpdatedAt = &now
			dataChanged = true
		}
	}
	if options.programmes {
		changed, err := generateOpintopolku(options.opintopolku)
		if err != nil {
			return err
		}
		if changed || meta.ProgrammesYhteishakuOID != options.yhteishakuOID {
			meta.ProgrammesUpdatedAt = &now
			meta.ProgrammesYhteishakuOID = options.yhteishakuOID
			dataChanged = true
		}
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

	if err := maybeRebuildSchoolCatalog(meta.CurrentStatisticsRound, options.catalog); err != nil {
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
			return refreshOptions{programmes: true, yhteishakuOID: cfg.Opintopolku.YhteishakuOID, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
		case "all":
			return refreshOptions{statistics: true, programmes: true, yhteishakuOID: cfg.Opintopolku.YhteishakuOID, vipunen: cfg.Vipunen, opintopolku: cfg.Opintopolku}, nil
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
	yhteishakuOID := flags.String("yhteishaku-oid", "", "manually sourced Opintopolku joint-application OID")
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
	oid := strings.TrimSpace(*yhteishakuOID)
	if oid != "" {
		cfg.Opintopolku.YhteishakuOID = oid
	}
	if *programmes && oid == "" && *year != configuredYear {
		return refreshOptions{}, fmt.Errorf("--programmes for %d requires --yhteishaku-oid because the joint-application OID is sourced manually", *year)
	}

	return refreshOptions{
		statistics:    *statistics,
		programmes:    *programmes,
		yhteishakuOID: cfg.Opintopolku.YhteishakuOID,
		vipunen:       cfg.Vipunen,
		opintopolku:   cfg.Opintopolku,
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
		statistics := services.MergeRecords(recordsByRound[round])
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

func generateOpintopolku(cfg models.OpintopolkuConfig) (bool, error) {
	apiURL, selection, err := services.BuildOpintopolkuURL(cfg.YhteishakuOID, cfg.Alkamisajankohdat)
	if err != nil {
		return false, fmt.Errorf("invalid Opintopolku configuration: %w", err)
	}

	fetched, err := services.FetchOpintopolkuData(apiURL)
	if err != nil {
		return false, err
	}
	if fetched == nil || len(fetched.Hits) == 0 {
		return false, errors.New("Opintopolku returned no records")
	}

	koulutusalat, err := services.FetchKoulutusalat(fetched.Hits)
	if err != nil {
		return false, err
	}

	programs := services.TransformOpintopolkuData(fetched, koulutusalat)
	if len(programs) == 0 {
		return false, errors.New("Opintopolku produced no programmes after cleanup")
	}
	if err := validateRecordCount(programsOutputPath, len(programs), "Opintopolku programmes"); err != nil {
		return false, err
	}
	changed, err := jsonChanged(programsOutputPath, programs)
	if err != nil {
		return false, err
	}

	if err := writeJSON(programsOutputPath, programs); err != nil {
		return false, err
	}

	fmt.Printf("Opintopolku: selection=%s fetched=%d generated=%d changed=%t output=%s\n", selection, len(fetched.Hits), len(programs), changed, programsOutputPath)
	return changed, nil
}

// maybeRebuildSchoolCatalog rebuilds schools.json when programmes exist on disk.
// Partial refreshes (e.g. vipunen alone on a fresh install) skip the catalog
// until current_programs.json is available; the catalog command still requires it.
func maybeRebuildSchoolCatalog(currentRound string, catalogRequired bool) error {
	if _, err := os.Stat(programsOutputPath); errors.Is(err, os.ErrNotExist) {
		if catalogRequired {
			return fmt.Errorf("school catalog requires %s", programsOutputPath)
		}
		fmt.Printf("School catalog: skipped (missing %s); run opintopolku or catalog after programmes exist\n", programsOutputPath)
		return nil
	} else if err != nil {
		return fmt.Errorf("stat %s: %w", programsOutputPath, err)
	}
	return rebuildSchoolCatalog(currentRound)
}

func rebuildSchoolCatalog(currentRound string) error {
	if currentRound == "" {
		return errors.New("school catalog requires currentStatisticsRound")
	}
	programsData, err := os.ReadFile(programsOutputPath)
	if err != nil {
		return fmt.Errorf("school catalog requires %s: %w", programsOutputPath, err)
	}
	var programs models.CurrentProgramsResponse
	if err := json.Unmarshal(programsData, &programs); err != nil {
		return fmt.Errorf("decode %s: %w", programsOutputPath, err)
	}

	statsPath := filepath.Join(statisticsOutputDir, "hakijamaarat-"+strings.ReplaceAll(currentRound, "_", "-")+".json")
	statsData, err := os.ReadFile(statsPath)
	if err != nil {
		return fmt.Errorf("school catalog requires %s: %w", statsPath, err)
	}
	var statistics models.StatisticsResponse
	if err := json.Unmarshal(statsData, &statistics); err != nil {
		return fmt.Errorf("decode %s: %w", statsPath, err)
	}

	names := make(map[string]struct{})
	for _, programme := range programs {
		for _, toteutus := range programme.Toteutukset {
			if name := strings.TrimSpace(toteutus.OppilaitosNimi.Fi); name != "" {
				names[name] = struct{}{}
			}
		}
	}
	for _, row := range statistics {
		if name := strings.TrimSpace(row.Korkeakoulu); name != "" {
			names[name] = struct{}{}
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

func jsonChanged(path string, value any) (bool, error) {
	encoded, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return false, fmt.Errorf("encode %s for comparison: %w", path, err)
	}
	encoded = append(encoded, '\n')
	existing, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return true, nil
	}
	if err != nil {
		return false, fmt.Errorf("read %s for comparison: %w", path, err)
	}
	return !bytes.Equal(existing, encoded), nil
}

func validateRecordCount(path string, generated int, source string) error {
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("read previous %s: %w", source, err)
	}

	var previous []json.RawMessage
	if err := json.Unmarshal(data, &previous); err != nil {
		return fmt.Errorf("decode previous %s: %w", source, err)
	}
	if len(previous) > 0 && generated*2 < len(previous) {
		return fmt.Errorf("%s dropped from %d to %d records; refusing to replace the dataset", source, len(previous), generated)
	}
	return nil
}

func readMeta(path string) (models.Meta, error) {
	var meta models.Meta
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return meta, nil
	}
	if err != nil {
		return meta, fmt.Errorf("read %s: %w", path, err)
	}
	if err := json.Unmarshal(data, &meta); err != nil {
		return meta, fmt.Errorf("decode %s: %w", path, err)
	}
	if meta.StatisticsUpdatedAt == nil && !meta.GeneratedAt.IsZero() {
		updatedAt := meta.GeneratedAt
		meta.StatisticsUpdatedAt = &updatedAt
	}
	if meta.ProgrammesUpdatedAt == nil && !meta.GeneratedAt.IsZero() {
		updatedAt := meta.GeneratedAt
		meta.ProgrammesUpdatedAt = &updatedAt
	}
	return meta, nil
}

func availableStatisticsRounds(directory string) ([]string, error) {
	return availableRoundFiles(directory, statisticsFilename)
}

func availableHakijaprofiiliRounds(directory string) ([]string, error) {
	rounds, err := availableRoundFiles(directory, hakijaprofiiliFilename)
	if err != nil && errors.Is(err, os.ErrNotExist) {
		return nil, nil
	}
	return rounds, err
}

func availableRoundFiles(directory string, pattern *regexp.Regexp) ([]string, error) {
	entries, err := os.ReadDir(directory)
	if err != nil {
		return nil, fmt.Errorf("read data directory %s: %w", directory, err)
	}

	rounds := make([]string, 0)
	for _, entry := range entries {
		matches := pattern.FindStringSubmatch(entry.Name())
		if entry.IsDir() || matches == nil {
			continue
		}
		rounds = append(rounds, matches[1]+"_"+matches[2])
	}
	sort.Sort(sort.Reverse(sort.StringSlice(rounds)))
	return rounds, nil
}

func writeDataManifestModule(path string, meta models.Meta) error {
	rounds := make([]string, len(meta.StatisticsRounds))
	for i, round := range meta.StatisticsRounds {
		rounds[i] = strconv.Quote(round)
	}
	profiliRounds, err := availableHakijaprofiiliRounds(hakijaprofiiliOutputDir)
	if err != nil {
		return err
	}
	profiliQuoted := make([]string, len(profiliRounds))
	for i, round := range profiliRounds {
		profiliQuoted[i] = strconv.Quote(round)
	}
	content := fmt.Sprintf(
		"// Generated by the data generator. Do not edit manually.\nexport const STATISTICS_ROUNDS = [%s] as const;\nexport const CURRENT_STATISTICS_ROUND = %q;\nexport const HAKIJAPROFIILI_ROUNDS = [%s] as const;\n",
		strings.Join(rounds, ", "),
		meta.CurrentStatisticsRound,
		strings.Join(profiliQuoted, ", "),
	)

	directory := filepath.Dir(path)
	if err := os.MkdirAll(directory, 0755); err != nil {
		return fmt.Errorf("create output directory %s: %w", directory, err)
	}
	temporary, err := os.CreateTemp(directory, ".generated-*.ts")
	if err != nil {
		return fmt.Errorf("create temporary output for %s: %w", path, err)
	}
	temporaryPath := temporary.Name()
	defer os.Remove(temporaryPath)
	if _, err := temporary.WriteString(content); err != nil {
		temporary.Close()
		return fmt.Errorf("write %s: %w", path, err)
	}
	if err := temporary.Close(); err != nil {
		return fmt.Errorf("close %s: %w", path, err)
	}
	if err := os.Rename(temporaryPath, path); err != nil {
		return fmt.Errorf("replace %s: %w", path, err)
	}
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
