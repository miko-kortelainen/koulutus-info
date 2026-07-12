package main

import (
	"bytes"
	"os"
	"path/filepath"
	"strings"
	"testing"
)

func TestRunWritesJSONToStdout(t *testing.T) {
	inputPath := filepath.Join(t.TempDir(), "pisterajat.csv")
	csv := "Koulu;Ohjelma;Valintatapa;Pisteraja;Koulutusala\n" +
		"School A;Programme 1;Certificate, all applicants;100,50;Field A\n"
	if err := os.WriteFile(inputPath, []byte(csv), 0644); err != nil {
		t.Fatal(err)
	}

	var stdout bytes.Buffer
	var stderr bytes.Buffer
	if err := run([]string{"--input", inputPath, "--output", "-"}, &stdout, &stderr); err != nil {
		t.Fatalf("run() error = %v", err)
	}

	want := "[\n  {\n    \"name\": \"School A\",\n    \"programmes\": [\n      {\n        \"name\": \"Programme 1\",\n        \"koulutusala\": \"Field A\",\n        \"cutoffs\": [\n          {\n            \"selectionMethod\": \"Certificate, all applicants\",\n            \"score\": 100.5\n          }\n        ]\n      }\n    ]\n  }\n]\n"
	if stdout.String() != want {
		t.Errorf("stdout = %q, want %q", stdout.String(), want)
	}
	if !strings.Contains(stderr.String(), "Converted 1 schools and 1 programmes to -") {
		t.Errorf("stderr = %q, want conversion summary", stderr.String())
	}
}
