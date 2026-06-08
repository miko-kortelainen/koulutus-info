package handlers

import (
	"encoding/json"
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

	// get order param
	order := services.Order(r.URL.Query().Get("order"))
	if !order.IsValid() {
		order = services.OrderAsc
	}

	// fetch statistics from vipunen API (already sorted by order)
	data, err := services.GetVipunenDataCached(order)
	if err != nil {
		http.Error(w, "Failed to fetch statistics", http.StatusInternalServerError)
		return
	}

	if len(data) == 0 {
		http.Error(w, "No data available", http.StatusNotFound)
		return
	}

	json.NewEncoder(w).Encode(data)
}
