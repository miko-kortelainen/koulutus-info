package pisterajat

import (
	"reflect"
	"strings"
	"testing"
)

func TestConvertGroupsRecordsAndHandlesBOM(t *testing.T) {
	input := strings.NewReader("\ufeffKoulu;Ohjelma;Valintatapa;Tarkenne;Pisteraja\n" +
		"School A;Programme 1;Certificate;First-time applicants;145,60\n" +
		"School A;Programme 1;Certificate;All applicants;142,10\n" +
		"School A;Programme 1;Entrance exam;All applicants;88,00\n" +
		"School A;Programme 2;Certificate;All applicants;120,00\n" +
		"School B;Programme 3;Certificate;All applicants;99,50\n")

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
					SelectionMethods: []SelectionMethod{
						{
							Name: "Certificate",
							Cutoffs: []Cutoff{
								{Detail: "First-time applicants", Score: 145.6},
								{Detail: "All applicants", Score: 142.1},
							},
						},
						{
							Name:    "Entrance exam",
							Cutoffs: []Cutoff{{Detail: "All applicants", Score: 88}},
						},
					},
				},
				{
					Name: "Programme 2",
					SelectionMethods: []SelectionMethod{
						{
							Name:    "Certificate",
							Cutoffs: []Cutoff{{Detail: "All applicants", Score: 120}},
						},
					},
				},
			},
		},
		{
			Name: "School B",
			Programmes: []Programme{
				{
					Name: "Programme 3",
					SelectionMethods: []SelectionMethod{
						{
							Name:    "Certificate",
							Cutoffs: []Cutoff{{Detail: "All applicants", Score: 99.5}},
						},
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
	input := strings.NewReader("Koulu;Ohjelma;Valintatapa;Tarkenne;Pisteraja\n" +
		"School A;Programme 1;Certificate;All applicants;not-a-number\n")

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
