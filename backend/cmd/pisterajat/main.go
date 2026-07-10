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
)

const (
	defaultInputPath  = "pisterajat.csv"
	defaultOutputPath = "../frontend/public/data/pisterajat.json"
)

func main() {
	if err := run(os.Args[1:], os.Stdout, os.Stderr); err != nil {
		if errors.Is(err, flag.ErrHelp) {
			return
		}
		fmt.Fprintln(os.Stderr, "conversion failed:", err)
		os.Exit(1)
	}
}

func run(args []string, stdout, stderr io.Writer) error {
	flags := flag.NewFlagSet("pisterajat", flag.ContinueOnError)
	flags.SetOutput(stderr)
	inputPath := flags.String("input", defaultInputPath, "path to pisterajat.csv")
	outputPath := flags.String("output", defaultOutputPath, "path for JSON output; use - for stdout")
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

	schools, err := pisterajat.Convert(input)
	if err != nil {
		return fmt.Errorf("convert %s: %w", *inputPath, err)
	}
	if *outputPath == "-" {
		if err := writeJSON(stdout, schools); err != nil {
			return fmt.Errorf("write JSON to stdout: %w", err)
		}
	} else if err := writeJSONFile(*outputPath, schools); err != nil {
		return err
	}

	fmt.Fprintf(stderr, "Converted %d schools and %d programmes to %s\n", len(schools), countProgrammes(schools), *outputPath)
	return nil
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
