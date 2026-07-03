package services

import (
	"encoding/json"
	"os"
	"school-api/models"
	"testing"
)

func TestMergeRecords(t *testing.T) {
	data, err := os.ReadFile("testdata/vipunen_sample.json")
	if err != nil {
		t.Fatalf("failed to read test file: %v", err)
	}

	var records []models.StatisticsEntry
	if err := json.Unmarshal(data, &records); err != nil {
		t.Fatalf("failed to unmarshal test data %v", err)
	}

	merged := MergeRecords(records)

	if len(merged) == 0 {
		t.Fatalf("expected merged results, got none")
	}

	out, err := json.MarshalIndent(merged, "", "	")
	if err != nil {
		t.Fatalf("failed to marshal merged file: %v", err)
	}

	if err := os.WriteFile("testdata/vipunen_merged.json", out, 0644); err != nil {
		t.Fatalf("failed to write merged file %v", err)
	}

	t.Logf("wrote %d merged records", len(merged))
}
