package main

import (
	"fmt"
	"net/http"
	"school-api/handlers"
)

func main() {
	http.HandleFunc("/api/schools", handlers.GetSchools)
	http.HandleFunc("/api/statistics", handlers.GetStatistics)

	fmt.Println("Server starting on port 8080")
	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		fmt.Println("server failed to start", err)
	}
}
