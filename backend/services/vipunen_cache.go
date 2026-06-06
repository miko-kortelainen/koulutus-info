package services

import (
	"fmt"
	"school-api/models"
	"sync"
	"time"
)

type VipunenDataCache struct {
	mu          sync.RWMutex
	Data        []models.VipunenData
	LastUpdated time.Time
}

var VipunenCache = VipunenDataCache{}

const VipunenURL = "https://api.vipunen.fi/api/resources/korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet/data?filter=koulutuksenAlkamisvuosi%3D%3D%272026%27%20and%20hakutapa%3D%3D%27Yhteishaku%27%20and%20koulutusasteTaso1%3D%3D%27Alempi%20korkeakouluaste%27"

func GetVipunenDataCached() ([]models.VipunenData, error) {
	VipunenCache.mu.RLock()
	dataExists := len(VipunenCache.Data) > 0
	timeSinceUpdate := time.Since(VipunenCache.LastUpdated)
	cachedData := copyVipunenData(VipunenCache.Data)
	VipunenCache.mu.RUnlock()

	// if no cache or data is stale
	if !dataExists || timeSinceUpdate > 24*time.Hour {

		fmt.Println("/api/statistics/: data not in cache or it's stale, requesting new...")

		// get fresh data from vipunen API
		freshData, err := FetchVipunenData(VipunenURL)
		if err != nil {
			return nil, err
		}

		// merge duplicates from fresh data
		mergedData := MergeRecords(freshData)

		VipunenCache.mu.Lock()
		VipunenCache.Data = mergedData
		VipunenCache.LastUpdated = time.Now()
		VipunenCache.mu.Unlock()

		return copyVipunenData(mergedData), nil
	}

	fmt.Println("/api/statistics/: using cached data.")
	return cachedData, nil
}

func copyVipunenData(data []models.VipunenData) []models.VipunenData {
	if len(data) == 0 {
		return nil
	}

	copied := make([]models.VipunenData, len(data))
	copy(copied, data)
	return copied
}
