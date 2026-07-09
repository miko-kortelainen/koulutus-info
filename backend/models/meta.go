package models

import "time"

type Meta struct {
	GeneratedAt             time.Time  `json:"generatedAt"`
	StatisticsYears         []int      `json:"statisticsYears"`
	CurrentStatisticsYear   int        `json:"currentStatisticsYear"`
	StatisticsUpdatedAt     *time.Time `json:"statisticsUpdatedAt,omitempty"`
	ProgrammesUpdatedAt     *time.Time `json:"programmesUpdatedAt,omitempty"`
	ProgrammesYhteishakuOID string     `json:"programmesYhteishakuOid,omitempty"`
}
