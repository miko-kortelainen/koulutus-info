package main

import (
	"os"
	"path/filepath"
	"school-api/models"
	"testing"
)

func testConfig() models.Config {
	return models.Config{
		Vipunen: models.VipunenConfig{TilastoVuosi: 2026},
		Opintopolku: models.OpintopolkuConfig{
			YhteishakuOID:     "configured-oid",
			Alkamisajankohdat: []string{"2026-kevat", "2026-syksy"},
		},
	}
}

func TestParseRefreshOptions(t *testing.T) {
	tests := []struct {
		name    string
		args    []string
		wantErr bool
		check   func(*testing.T, refreshOptions)
	}{
		{
			name: "statistics for another year",
			args: []string{"--year", "2027", "--statistics"},
			check: func(t *testing.T, options refreshOptions) {
				if !options.statistics || options.programmes || options.vipunen.TilastoVuosi != 2027 {
					t.Fatalf("unexpected options: %+v", options)
				}
			},
		},
		{
			name:    "programmes for another year require manual oid",
			args:    []string{"--year", "2027", "--programmes"},
			wantErr: true,
		},
		{
			name: "manual oid selects programmes for another year",
			args: []string{"--year", "2027", "--programmes", "--yhteishaku-oid", "manual-oid"},
			check: func(t *testing.T, options refreshOptions) {
				if !options.programmes || options.statistics || options.yhteishakuOID != "manual-oid" {
					t.Fatalf("unexpected options: %+v", options)
				}
			},
		},
		{
			name: "legacy all command remains supported",
			args: []string{"all"},
			check: func(t *testing.T, options refreshOptions) {
				if !options.programmes || !options.statistics || options.yhteishakuOID != "configured-oid" {
					t.Fatalf("unexpected options: %+v", options)
				}
			},
		},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			options, err := parseRefreshOptions(test.args, testConfig())
			if test.wantErr {
				if err == nil {
					t.Fatal("expected an error")
				}
				return
			}
			if err != nil {
				t.Fatalf("parseRefreshOptions() error = %v", err)
			}
			test.check(t, options)
		})
	}
}

func TestAvailableStatisticsYears(t *testing.T) {
	directory := t.TempDir()
	for _, name := range []string{"statistics-2024.json", "statistics-2026.json", "statistics-2025.json", "schools.json"} {
		if err := os.WriteFile(filepath.Join(directory, name), []byte("[]"), 0644); err != nil {
			t.Fatal(err)
		}
	}

	years, err := availableStatisticsYears(directory)
	if err != nil {
		t.Fatalf("availableStatisticsYears() error = %v", err)
	}
	want := []int{2026, 2025, 2024}
	if len(years) != len(want) {
		t.Fatalf("years = %v, want %v", years, want)
	}
	for i := range want {
		if years[i] != want[i] {
			t.Fatalf("years = %v, want %v", years, want)
		}
	}
}

func TestValidateRecordCount(t *testing.T) {
	path := filepath.Join(t.TempDir(), "data.json")
	if err := os.WriteFile(path, []byte("[{}, {}, {}, {}]"), 0644); err != nil {
		t.Fatal(err)
	}
	if err := validateRecordCount(path, 2, "test data"); err != nil {
		t.Fatalf("expected half the previous records to be accepted: %v", err)
	}
	if err := validateRecordCount(path, 1, "test data"); err == nil {
		t.Fatal("expected a large record-count drop to be rejected")
	}
}

func TestJSONChanged(t *testing.T) {
	path := filepath.Join(t.TempDir(), "data.json")
	value := []string{"same"}
	if err := writeJSON(path, value); err != nil {
		t.Fatal(err)
	}

	changed, err := jsonChanged(path, value)
	if err != nil {
		t.Fatal(err)
	}
	if changed {
		t.Fatal("expected identical JSON to be unchanged")
	}

	changed, err = jsonChanged(path, []string{"different"})
	if err != nil {
		t.Fatal(err)
	}
	if !changed {
		t.Fatal("expected different JSON to be changed")
	}
}
