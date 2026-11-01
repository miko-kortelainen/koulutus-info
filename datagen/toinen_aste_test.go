package main

import (
	"os"
	"path/filepath"
	"strings"
	"testing"
)

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
