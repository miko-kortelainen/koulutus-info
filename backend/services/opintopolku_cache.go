package services

import (
	"fmt"
	"school-api/models"
	"sync"
	"time"
)

type OpintopolkuDataCache struct {
	mu          sync.RWMutex
	Data        *models.OpintopolkuData
	LastUpdated time.Time
}

var OpintopolkuCache = OpintopolkuDataCache{}

const OpintopolkuURL = "https://opintopolku.fi/konfo-backend/external/search/koulutukset?size=100&lng=fi&koulutustyyppi=amk-alempi,kandi-ja-maisteri&opetustapa=opetuspaikkakk_1,opetuspaikkakk_2,opetuspaikkakk_3,opetuspaikkakk_4&maksullisuustyyppi=maksuton&apuraha=false&jotpa=false&tyovoimakoulutus=false&taydennyskoulutus=false&pieniosaamiskokonaisuus=false&hakutapa=hakutapa_01&alkamiskausi=2026-kevat,2026-syksy"

func GetOpintopolkuDataCached() (*models.OpintopolkuData, error) {
	OpintopolkuCache.mu.RLock()
	cachedData := OpintopolkuCache.Data
	dataExists := cachedData != nil && len(cachedData.Hits) > 0
	timeSinceUpdate := time.Since(OpintopolkuCache.LastUpdated)
	OpintopolkuCache.mu.RUnlock()

	// if no cache or data is stale
	if !dataExists || timeSinceUpdate > 24*time.Hour {

		fmt.Println("/api/schools/: data not in cache or it's stale, requesting new...")

		// get fresh data from opintopolku API
		freshData, err := FetchOpintopolkuData(OpintopolkuURL)
		if err != nil {
			return nil, err
		}

		OpintopolkuCache.mu.Lock()
		OpintopolkuCache.Data = freshData
		OpintopolkuCache.LastUpdated = time.Now()
		OpintopolkuCache.mu.Unlock()

		return freshData, nil
	}

	fmt.Println("/api/schools/: using cached data.")
	return cachedData, nil
}
