package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"school-api/services"
)

// endpoint /api/schools (opintopolku)
func GetSchools(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	data, err := services.GetOpintopolkuDataCached()
	if err != nil {
		http.Error(w, "Failed to fetch schools", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}

// endpoint /api/statistics (vipunen)
func GetStatistics(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// fetch statistics from vipunen API
	data, err := services.GetVipunenDataCached()
	if err != nil {
		http.Error(w, "Failed to fetch statistics", http.StatusInternalServerError)
		return
	}

	// merge duplicates into one since kaikkiHakijatLkm and aloituspaikatLkm are in different items.
	merged := services.MergeRecords(data)
	if len(merged) == 0 {
		log.Printf("warn: MergeRecords returned 0 results from %d records", len(data))
		http.Error(w, "Failed to merge statistics", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(merged)
}
