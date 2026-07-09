// Package pisterajat converts admission cutoff CSV data into a hierarchical
// JSON-friendly representation.
package pisterajat

import (
	"encoding/csv"
	"fmt"
	"io"
	"math"
	"strconv"
	"strings"
)

var expectedHeader = []string{"Koulu", "Ohjelma", "Valintatapa", "Pisteraja"}

// School contains every programme offered by one school.
type School struct {
	Name       string      `json:"name"`
	Programmes []Programme `json:"programmes"`
}

// Programme contains the cutoff scores for one programme.
type Programme struct {
	Name    string   `json:"name"`
	Cutoffs []Cutoff `json:"cutoffs"`
}

// Cutoff is one selection method and its admission cutoff score.
type Cutoff struct {
	SelectionMethod string  `json:"selectionMethod"`
	Score           float64 `json:"score"`
}

type programmeKey struct {
	school    string
	programme string
}

// Convert reads pisterajat.csv data. It preserves the source ordering while
// grouping records by school and programme.
func Convert(input io.Reader) ([]School, error) {
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

	schools := make([]School, 0)
	schoolIndexes := make(map[string]int)
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
		score, err := parseScore(record[3])
		if err != nil {
			return nil, fmt.Errorf("row %d: parse Pisteraja %q: %w", rowNumber, record[3], err)
		}

		schoolIndex, exists := schoolIndexes[record[0]]
		if !exists {
			schoolIndex = len(schools)
			schools = append(schools, School{Name: record[0]})
			schoolIndexes[record[0]] = schoolIndex
		}

		programmeKey := programmeKey{school: record[0], programme: record[1]}
		programmeIndex, exists := programmeIndexes[programmeKey]
		if !exists {
			programmeIndex = len(schools[schoolIndex].Programmes)
			schools[schoolIndex].Programmes = append(schools[schoolIndex].Programmes, Programme{Name: record[1]})
			programmeIndexes[programmeKey] = programmeIndex
		}

		programme := &schools[schoolIndex].Programmes[programmeIndex]
		programme.Cutoffs = append(programme.Cutoffs, Cutoff{
			SelectionMethod: record[2],
			Score:           score,
		})
	}

	if len(schools) == 0 {
		return nil, fmt.Errorf("CSV contains no data rows")
	}
	return schools, nil
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
