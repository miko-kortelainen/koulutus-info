package pisterajat

import (
	"reflect"
	"strings"
	"testing"
)

func TestConvertGroupsRecordsAndHandlesBOM(t *testing.T) {
	input := strings.NewReader("\ufeffyhteishaku;alkamisvuosi;alkamisaika;sektori;ylempi/alempi;ala;ala2;koulu;valintatapa;ohjelma;pisteet_alin;pisteet_ylin\n" +
		"2026, kevät;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate, first-time applicants;Programme 1;145,60;160\n" +
		"2026, kevät;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate, all applicants;Programme 1;142,10;160\n" +
		"2026, kevät;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Entrance exam;Programme 1;88,00;100\n" +
		"2026, kevät;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate, all applicants;Programme 2;120,00;150\n" +
		"2025, syksy;2025;Spring;University of applied sciences;Bachelor;Field B;Detailed field B;School B;Certificate, all applicants;Programme 3;99,50;120\n")

	got, err := Convert(input)
	if err != nil {
		t.Fatalf("Convert() error = %v", err)
	}

	want := map[string][]School{
		"2026 kevät": {
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
		"2025 syksy": {
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
	input := strings.NewReader("yhteishaku;alkamisvuosi;alkamisaika;sektori;ylempi/alempi;ala;ala2;koulu;valintatapa;ohjelma;pisteet_alin;pisteet_ylin\n" +
		"2026, kevät;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate;Programme 1;not-a-number;120\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse pisteet_alin") {
		t.Fatalf("Convert() error = %v, want a row-specific score error", err)
	}
}

func TestConvertRejectsInvalidStartYear(t *testing.T) {
	input := strings.NewReader("yhteishaku;alkamisvuosi;alkamisaika;sektori;ylempi/alempi;ala;ala2;koulu;valintatapa;ohjelma;pisteet_alin;pisteet_ylin\n" +
		"2026, kevät;next year;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate;Programme 1;100;120\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse alkamisvuosi") {
		t.Fatalf("Convert() error = %v, want a row-specific start year error", err)
	}
}

func TestConvertRejectsInvalidJointApplication(t *testing.T) {
	input := strings.NewReader("yhteishaku;alkamisvuosi;alkamisaika;sektori;ylempi/alempi;ala;ala2;koulu;valintatapa;ohjelma;pisteet_alin;pisteet_ylin\n" +
		"2026 winter;2026;Autumn;University;Bachelor;Field A;Detailed field A;School A;Certificate;Programme 1;100;120\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse yhteishaku") {
		t.Fatalf("Convert() error = %v, want a row-specific joint application error", err)
	}
}

func TestConvertRejectsUnexpectedHeader(t *testing.T) {
	input := strings.NewReader("School;Programme;Selection method;Detail;Score\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "unexpected header") {
		t.Fatalf("Convert() error = %v, want an unexpected header error", err)
	}
}
