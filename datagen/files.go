package main

import (
	"bytes"
	"datagen/models"
	"encoding/json"
	"errors"
	"fmt"
	"os"
	"path/filepath"
)

func jsonChanged(path string, value any) (bool, error) {
	encoded, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return false, fmt.Errorf("encode %s for comparison: %w", path, err)
	}
	encoded = append(encoded, '\n')
	existing, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return true, nil
	}
	if err != nil {
		return false, fmt.Errorf("read %s for comparison: %w", path, err)
	}
	return !bytes.Equal(existing, encoded), nil
}

func validateRecordCount(path string, generated int, source string) error {
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return fmt.Errorf("read previous %s: %w", source, err)
	}

	var previous []json.RawMessage
	if err := json.Unmarshal(data, &previous); err != nil {
		return fmt.Errorf("decode previous %s: %w", source, err)
	}
	if len(previous) > 0 && generated*2 < len(previous) {
		return fmt.Errorf("%s dropped from %d to %d records; refusing to replace the dataset", source, len(previous), generated)
	}
	return nil
}

func readMeta(path string) (models.Meta, error) {
	var meta models.Meta
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return meta, nil
	}
	if err != nil {
		return meta, fmt.Errorf("read %s: %w", path, err)
	}
	if err := json.Unmarshal(data, &meta); err != nil {
		return meta, fmt.Errorf("decode %s: %w", path, err)
	}
	if meta.StatisticsUpdatedAt == nil && !meta.GeneratedAt.IsZero() {
		updatedAt := meta.GeneratedAt
		meta.StatisticsUpdatedAt = &updatedAt
	}
	if meta.ProgrammesUpdatedAt == nil && !meta.GeneratedAt.IsZero() {
		updatedAt := meta.GeneratedAt
		meta.ProgrammesUpdatedAt = &updatedAt
	}
	return meta, nil
}

func writeJSON(path string, value any) error {
	directory := filepath.Dir(path)
	if err := os.MkdirAll(directory, 0755); err != nil {
		return fmt.Errorf("create output directory %s: %w", directory, err)
	}

	temporary, err := os.CreateTemp(directory, ".generated-*.json")
	if err != nil {
		return fmt.Errorf("create temporary output for %s: %w", path, err)
	}
	temporaryPath := temporary.Name()
	defer os.Remove(temporaryPath)

	encoder := json.NewEncoder(temporary)
	encoder.SetIndent("", "  ")
	if err := encoder.Encode(value); err != nil {
		temporary.Close()
		return fmt.Errorf("encode %s: %w", path, err)
	}
	if err := temporary.Close(); err != nil {
		return fmt.Errorf("close temporary output for %s: %w", path, err)
	}
	if err := os.Rename(temporaryPath, path); err != nil {
		return fmt.Errorf("replace %s: %w", path, err)
	}

	return nil
}
