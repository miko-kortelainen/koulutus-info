package pisterajat

import (
	"reflect"
	"strings"
	"testing"
)

func TestConvertGroupsRecordsAndHandlesBOM(t *testing.T) {
	input := strings.NewReader("\ufeffKoulu;Ohjelma;Valintatapa;Pisteraja\n" +
		"School A;Programme 1;Certificate, first-time applicants;145,60\n" +
		"School A;Programme 1;Certificate, all applicants;142,10\n" +
		"School A;Programme 1;Entrance exam;88,00\n" +
		"School A;Programme 2;Certificate, all applicants;120,00\n" +
		"School B;Programme 3;Certificate, all applicants;99,50\n")

	got, err := Convert(input)
	if err != nil {
		t.Fatalf("Convert() error = %v", err)
	}

	want := []School{
		{
			Name: "School A",
			Programmes: []Programme{
				{
					Name: "Programme 1",
					Cutoffs: []Cutoff{
						{SelectionMethod: "Certificate, first-time applicants", Score: 145.6},
						{SelectionMethod: "Certificate, all applicants", Score: 142.1},
						{SelectionMethod: "Entrance exam", Score: 88},
					},
				},
				{
					Name:    "Programme 2",
					Cutoffs: []Cutoff{{SelectionMethod: "Certificate, all applicants", Score: 120}},
				},
			},
		},
		{
			Name: "School B",
			Programmes: []Programme{
				{
					Name:    "Programme 3",
					Cutoffs: []Cutoff{{SelectionMethod: "Certificate, all applicants", Score: 99.5}},
				},
			},
		},
	}

	if !reflect.DeepEqual(got, want) {
		t.Errorf("Convert() = %#v, want %#v", got, want)
	}
}

func TestConvertRejectsInvalidScore(t *testing.T) {
	input := strings.NewReader("Koulu;Ohjelma;Valintatapa;Pisteraja\n" +
		"School A;Programme 1;Certificate;not-a-number\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "row 2: parse Pisteraja") {
		t.Fatalf("Convert() error = %v, want a row-specific score error", err)
	}
}

func TestConvertRejectsUnexpectedHeader(t *testing.T) {
	input := strings.NewReader("School;Programme;Selection method;Detail;Score\n")

	_, err := Convert(input)
	if err == nil || !strings.Contains(err.Error(), "unexpected header") {
		t.Fatalf("Convert() error = %v, want an unexpected header error", err)
	}
}
