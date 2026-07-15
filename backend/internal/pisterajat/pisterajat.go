// Package pisterajat converts admission cutoff CSV data into a hierarchical
// JSON-friendly representation.
package pisterajat

import (
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"regexp"
	"strconv"
	"strings"
)

var expectedHeader = []string{
	"yhteishaku",
	"alkamisvuosi",
	"alkamisaika",
	"sektori",
	"ylempi/alempi",
	"ala",
	"ala2",
	"koulu",
	"valintatapa",
	"ohjelma",
	"pisteet_alin",
	"pisteet_ylin",
}

// School contains every programme offered by one school.
type School struct {
	Name       string      `json:"name"`
	Sector     string      `json:"sector"`
	Programmes []Programme `json:"programmes"`
}

// Programme contains the cutoff scores for one programme.
type Programme struct {
	Name        string   `json:"name"`
	Koulutusala string   `json:"koulutusala"`
	Cutoffs     []Cutoff `json:"cutoffs"`
}

// Cutoff is one selection method and its admission cutoff score.
type Cutoff struct {
	SelectionMethod string  `json:"selectionMethod"`
	Score           float64 `json:"score"`
	StartYear       int     `json:"startYear"`
	StartSeason     string  `json:"startSeason"`
}

type schoolKey struct {
	jointApplication string
	school           string
}

type programmeKey struct {
	jointApplication string
	school           string
	programme        string
}

// Convert reads pisterajat.csv data. It preserves the source ordering while
// grouping records by joint application, school, and programme.
func Convert(input io.Reader) (map[string][]School, error) {
	reader := csv.NewReader(input)
	reader.Comma = ';'
	reader.TrimLeadingSpace = true

	header, err := reader.Read()
	if err == io.EOF {
		return nil, fmt.Errorf("read header: empty CSV")
	}
	if err != nil {
		return nil, fmt.Errorf("read header: %w", err)
	}
	if len(header) > 0 {
		header[0] = strings.TrimPrefix(header[0], "\ufeff")
	}
	if !matchesExpectedHeader(header) {
		return nil, fmt.Errorf("unexpected header %q; want %q", header, expectedHeader)
	}
	reader.FieldsPerRecord = len(expectedHeader)

	datasets := make(map[string][]School)
	schoolIndexes := make(map[schoolKey]int)
	programmeIndexes := make(map[programmeKey]int)
	for rowNumber := 2; ; rowNumber++ {
		record, err := reader.Read()
		if err == io.EOF {
			break
		}
		if err != nil {
			return nil, fmt.Errorf("read row %d: %w", rowNumber, err)
		}

		for i := range record {
			record[i] = strings.TrimSpace(record[i])
		}
		if err := validateRecord(record, rowNumber); err != nil {
			return nil, err
		}
		jointApplication, err := parseJointApplication(record[0])
		if err != nil {
			return nil, fmt.Errorf("row %d: parse yhteishaku %q: %w", rowNumber, record[0], err)
		}
		startYear, err := strconv.Atoi(record[1])
		if err != nil {
			return nil, fmt.Errorf("row %d: parse alkamisvuosi %q: %w", rowNumber, record[1], err)
		}
		score, err := parseScore(record[10])
		if err != nil {
			return nil, fmt.Errorf("row %d: parse pisteet_alin %q: %w", rowNumber, record[10], err)
		}

		schools := datasets[jointApplication]
		sKey := schoolKey{jointApplication: jointApplication, school: record[7]}
		schoolIndex, exists := schoolIndexes[sKey]
		if !exists {
			schoolIndex = len(schools)
			schools = append(schools, School{Name: record[7], Sector: record[3]})
			datasets[jointApplication] = schools
			schoolIndexes[sKey] = schoolIndex
		}

		pKey := programmeKey{jointApplication: jointApplication, school: record[7], programme: record[9]}
		programmeIndex, exists := programmeIndexes[pKey]
		if !exists {
			programmeIndex = len(schools[schoolIndex].Programmes)
			schools[schoolIndex].Programmes = append(schools[schoolIndex].Programmes, Programme{Name: record[9], Koulutusala: record[5]})
			programmeIndexes[pKey] = programmeIndex
		}

		programme := &schools[schoolIndex].Programmes[programmeIndex]
		programme.Cutoffs = append(programme.Cutoffs, Cutoff{
			SelectionMethod: record[8],
			Score:           score,
			StartYear:       startYear,
			StartSeason:     record[2],
		})
	}

	if len(datasets) == 0 {
		return nil, fmt.Errorf("CSV contains no data rows")
	}
	return datasets, nil
}

func matchesExpectedHeader(header []string) bool {
	if len(header) != len(expectedHeader) {
		return false
	}
	for i, value := range header {
		if strings.TrimSpace(value) != expectedHeader[i] {
			return false
		}
	}
	return true
}

func validateRecord(record []string, rowNumber int) error {
	for index, value := range record {
		if value == "" {
			return fmt.Errorf("row %d: %s is empty", rowNumber, expectedHeader[index])
		}
	}
	return nil
}

var jointApplicationPattern = regexp.MustCompile(`^(\d{4}),\s*(kevät|syksy)$`)

func parseJointApplication(value string) (string, error) {
	match := jointApplicationPattern.FindStringSubmatch(value)
	if match == nil {
		return "", fmt.Errorf("want '<year>, kevät|syksy'")
	}
	return match[1] + " " + match[2], nil
}

func parseScore(value string) (float64, error) {
	score, err := strconv.ParseFloat(strings.ReplaceAll(value, ",", "."), 64)
	if err != nil {
		return 0, err
	}
	if math.IsNaN(score) || math.IsInf(score, 0) {
		return 0, fmt.Errorf("must be a finite number")
	}
	return score, nil
}
