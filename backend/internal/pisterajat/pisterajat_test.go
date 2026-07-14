package pisterajat

import (
	"reflect"
	"strings"
	"testing"
)

func TestConvertGroupsRecordsAndHandlesBOM(t *testing.T) {
	input := strings.NewReader("\ufeffSektori;Koulu;Koulutusala;Ohjelma;Valintatapa;Pisteraja;Alkamisvuosi;Alkamiskausi;Yhteishaku\n" +
		"University;School A;Field A;Programme 1;Certificate, first-time applicants;145,60;2026;Autumn;2026 spring\n" +
		"University;School A;Field A;Programme 1;Certificate, all applicants;142,10;2026;Autumn;2026 spring\n" +
		"University;School A;Field A;Programme 1;Entrance exam;88,00;2026;Autumn;2026 spring\n" +
		"University;School A;Field A;Programme 2;Certificate, all applicants;120,00;2026;Autumn;2026 spring\n" +
		"University of applied sciences;School B;Field B;Programme 3;Certificate, all applicants;99,50;2025;Spring;2025 autumn\n")

	got, err := Convert(input)
	if err != nil {
		t.Fatalf("Convert() error = %v", err)
	}

	want := map[string][]School{
		"2026 spring": {
			{
				Name:   "School A",
				Sector: "University",
				Programmes: []Programme{
					{
						Name:        "Programme 1",
						Koulutusala: "Field A",
						Cutoffs: []Cutoff{
							{SelectionMethod: "Certificate, first-time applicants", Score: 145.6, StartYear: 2026, StartSeason: "Autumn"},
							{SelectionMethod: "Certificate, all applicants", Score: 142.1, StartYear: 2026, StartSeason: "Autumn"},
							{SelectionMethod: "Entrance exam", Score: 88, StartYear: 2026, StartSeason: "Autumn"},
						},
					},
					{
						Name:        "Programme 2",
						Koulutusala: "Field A",
						Cutoffs:     []Cutoff{{SelectionMethod: "Certificate, all applicants", Score: 120, StartYear: 2026, StartSeason: "Autumn"}},
					},
				},
			},
		},
		"2025 autumn": {
			{
				Name:   "School B",
				Sector: "University of applied sciences",
				Programmes: []Programme{
					{
						Name:        "Programme 3",
						Koulutusala: "Field B",
						Cutoffs:     []Cutoff{{SelectionMethod: "Certificate, all applicants", Score: 99.5, StartYear: 2025, StartSeason: "Spring"}},
					},
				},
			},
		},
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("Convert() = %#v, want %#v", got, want)
	}
}

func TestConvertRejectsInvalidScore(t *testing.T) {
	input := strings.NewReader("Sektori;Koulu;Koulutusala;Ohjelma;Valintatapa;Pisteraja;Alkamisvuosi;Alkamiskausi;Yhteishaku\n" +
		"University;School A;Field A;Programme 1;Certificate;not-a-number;2026;Autumn;2026 spring\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse Pisteraja") {
		t.Fatalf("Convert() error = %v, want a row-specific score error", err)
	}
}

func TestConvertRejectsInvalidStartYear(t *testing.T) {
	input := strings.NewReader("Sektori;Koulu;Koulutusala;Ohjelma;Valintatapa;Pisteraja;Alkamisvuosi;Alkamiskausi;Yhteishaku\n" +
		"University;School A;Field A;Programme 1;Certificate;100;next year;Autumn;2026 spring\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse Alkamisvuosi") {
		t.Fatalf("Convert() error = %v, want a row-specific start year error", err)
	}
}

func TestConvertRejectsUnexpectedHeader(t *testing.T) {
	input := strings.NewReader("School;Programme;Selection method;Detail;Score\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "unexpected header") {
		t.Fatalf("Convert() error = %v, want an unexpected header error", err)
	}
}
