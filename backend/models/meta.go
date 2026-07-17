package models

import "time"

type Meta struct {
	GeneratedAt             time.Time  `json:"generatedAt"`
	StatisticsRounds        []string   `json:"statisticsRounds"`
	CurrentStatisticsRound  string     `json:"currentStatisticsRound"`
	StatisticsUpdatedAt     *time.Time `json:"statisticsUpdatedAt,omitempty"`
	ProgrammesUpdatedAt     *time.Time `json:"programmesUpdatedAt,omitempty"`
	ProgrammesYhteishakuOID string     `json:"programmesYhteishakuOid,omitempty"`
}
