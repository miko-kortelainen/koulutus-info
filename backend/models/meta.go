package models

import "time"

type Meta struct {
	GeneratedAt            time.Time  `json:"generatedAt"`
	StatisticsRounds       []string   `json:"statisticsRounds"`
	CurrentStatisticsRound string     `json:"currentStatisticsRound"`
	StatisticsUpdatedAt    *time.Time `json:"statisticsUpdatedAt,omitempty"`
	ProgrammesUpdatedAt    *time.Time `json:"programmesUpdatedAt,omitempty"`
	// ProgrammesHaut[0] is the default /koulutukset wave; the manifest derives PROGRAMME_ROUNDS from it.
	ProgrammesHaut []OpintopolkuHaku `json:"programmesHaut,omitempty"`
}
