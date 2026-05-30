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

const VipunenURL = "https://api.vipunen.fi/api/resources/korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet/data?filter=koulutuksenAlkamisvuosi%3D%3D%272026%27%20and%20koulutusasteTaso1%3D%3D%27Alempi%20korkeakouluaste%27"

func GetVipunenDataCached() ([]models.VipunenData, error) {
	VipunenCache.mu.RLock()
	dataExists := len(VipunenCache.Data) > 0
	timeSinceUpdate := time.Since(VipunenCache.LastUpdated)
	VipunenCache.mu.RUnlock()

	// if no cache or data is stale
	if !dataExists || timeSinceUpdate > 24*time.Hour {

		fmt.Println("/api/statistics/: data not in cache or it's stale, requesting new...")

		freshData, err := FetchVipunenData(VipunenURL)

		if err != nil {
			return nil, err
		}

		VipunenCache.mu.Lock()
		VipunenCache.Data = freshData
		VipunenCache.LastUpdated = time.Now()
		VipunenCache.mu.Unlock()

		return freshData, nil
	}

	fmt.Println("/api/statistics/: using cached data.")
	return VipunenCache.Data, nil
}
