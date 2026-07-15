// pisterajat converts pisterajat.csv into hierarchical JSON.
package main

import (
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"school-api/internal/pisterajat"
	"sort"
	"strconv"
	"strings"
)

const (
	defaultInputPath = "pisterajat.csv"
	defaultOutputDir = "../frontend/public/data"
)

func main() {
	if err := run(os.Args[1:], os.Stderr); err != nil {
		if errors.Is(err, flag.ErrHelp) {
			return
		}
		fmt.Fprintln(os.Stderr, "conversion failed:", err)
		os.Exit(1)
	}
}

func run(args []string, stderr io.Writer) error {
	flags := flag.NewFlagSet("pisterajat", flag.ContinueOnError)
	flags.SetOutput(stderr)
	inputPath := flags.String("input", defaultInputPath, "path to pisterajat.csv")
	outputDir := flags.String("output-dir", defaultOutputDir, "directory for generated JSON files")
	if err := flags.Parse(args); err != nil {
		return err
	}
	if flags.NArg() != 0 {
		return fmt.Errorf("unexpected argument %q", flags.Arg(0))
	}

	input, err := os.Open(*inputPath)
	if err != nil {
		return fmt.Errorf("open input %s: %w", *inputPath, err)
	}
	defer input.Close()

	datasets, err := pisterajat.Convert(input)
	if err != nil {
		return fmt.Errorf("convert %s: %w", *inputPath, err)
	}

	jointApplications := make([]string, 0, len(datasets))
	for jointApplication := range datasets {
		jointApplications = append(jointApplications, jointApplication)
	}
	sort.Strings(jointApplications)
	for _, jointApplication := range jointApplications {
		filename, err := outputFilename(jointApplication)
		if err != nil {
			return err
		}
		outputPath := filepath.Join(*outputDir, filename)
		schools := datasets[jointApplication]
		if err := writeJSONFile(outputPath, schools); err != nil {
			return err
		}
		fmt.Fprintf(
			stderr,
			"Converted %d schools and %d programmes for %s to %s\n",
			len(schools),
			countProgrammes(schools),
			jointApplication,
			outputPath,
		)
	}
	return nil
}

func outputFilename(jointApplication string) (string, error) {
	parts := strings.Fields(jointApplication)
	if len(parts) != 2 {
		return "", fmt.Errorf("unexpected Yhteishaku %q; want '<year> <season>'", jointApplication)
	}
	if len(parts[0]) != 4 {
		return "", fmt.Errorf("unexpected Yhteishaku year %q", parts[0])
	}
	if _, err := strconv.Atoi(parts[0]); err != nil {
		return "", fmt.Errorf("unexpected Yhteishaku year %q: %w", parts[0], err)
	}

	season := parts[1]
	switch season {
	case "kevät":
		season = "kevat"
	case "syksy":
	default:
		return "", fmt.Errorf("unexpected Yhteishaku season %q", parts[1])
	}
	return fmt.Sprintf("pisterajat-%s-%s.json", parts[0], season), nil
}

func countProgrammes(schools []pisterajat.School) int {
	count := 0
	for _, school := range schools {
		count += len(school.Programmes)
	}
	return count
}

func writeJSONFile(path string, value any) error {
	directory := filepath.Dir(path)
	if err := os.MkdirAll(directory, 0755); err != nil {
		return fmt.Errorf("create output directory %s: %w", directory, err)
	}

	temporary, err := os.CreateTemp(directory, ".pisterajat-*.json")
	if err != nil {
		return fmt.Errorf("create temporary output for %s: %w", path, err)
	}
	temporaryPath := temporary.Name()
	defer os.Remove(temporaryPath)

	if err := writeJSON(temporary, value); err != nil {
		temporary.Close()
		return fmt.Errorf("encode %s: %w", path, err)
	}
	if err := temporary.Chmod(0644); err != nil {
		temporary.Close()
		return fmt.Errorf("set permissions for %s: %w", path, err)
	}
	if err := temporary.Close(); err != nil {
		return fmt.Errorf("close temporary output for %s: %w", path, err)
	}
	if err := os.Rename(temporaryPath, path); err != nil {
		return fmt.Errorf("replace %s: %w", path, err)
	}
	return nil
}

func writeJSON(output io.Writer, value any) error {
	encoder := json.NewEncoder(output)
	encoder.SetIndent("", "  ")
	return encoder.Encode(value)
}
