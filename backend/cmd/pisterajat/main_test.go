package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunWritesOneJSONFilePerJointApplication(t *testing.T) {
	inputPath := filepath.Join(t.TempDir(), "pisterajat.csv")
	outputDir := filepath.Join(t.TempDir(), "data")
	csv := "Sektori;Koulu;Koulutusala;Ohjelma;Valintatapa;Pisteraja;Alkamisvuosi;Alkamiskausi;Yhteishaku\n" +
		"University;School A;Field A;Programme 1;Certificate, all applicants;100,50;2026;Autumn;2026 kevät\n" +
		"University;School A;Field A;Programme 1;Entrance exam;80;2025;Autumn;2025 syksy\n"
	if err := os.WriteFile(inputPath, []byte(csv), 0644); err != nil {
		t.Fatal(err)
	}

	var stderr bytes.Buffer
	if err := run([]string{"--input", inputPath, "--output-dir", outputDir}, &stderr); err != nil {
		t.Fatalf("run() error = %v", err)
	}

	want := "[\n  {\n    \"name\": \"School A\",\n    \"sector\": \"University\",\n    \"programmes\": [\n      {\n        \"name\": \"Programme 1\",\n        \"koulutusala\": \"Field A\",\n        \"cutoffs\": [\n          {\n            \"selectionMethod\": \"Certificate, all applicants\",\n            \"score\": 100.5,\n            \"startYear\": 2026,\n            \"startSeason\": \"Autumn\"\n          }\n        ]\n      }\n    ]\n  }\n]\n"
	got, err := os.ReadFile(filepath.Join(outputDir, "pisterajat-2026-kevat.json"))
	if err != nil {
		t.Fatal(err)
	}
	if string(got) != want {
		t.Errorf("output = %q, want %q", got, want)
	}
	if _, err := os.Stat(filepath.Join(outputDir, "pisterajat-2025-syksy.json")); err != nil {
		t.Errorf("expected autumn dataset: %v", err)
	}
	if !strings.Contains(stderr.String(), "Converted 1 schools and 1 programmes for 2026 kevät") {
		t.Errorf("stderr = %q, want per-application conversion summary", stderr.String())
	}
}

func TestOutputFilenameRejectsUnexpectedJointApplication(t *testing.T) {
	_, err := outputFilename("2026 winter")
	if err == nil || !strings.Contains(err.Error(), "unexpected Yhteishaku season") {
		t.Fatalf("outputFilename() error = %v, want an unexpected season error", err)
	}
}
