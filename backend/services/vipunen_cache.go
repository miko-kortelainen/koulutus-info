package services

import (
	"fmt"
	"school-api/models"
	"sync"
	"time"
)

type VipunenDataCache struct {
	mu          sync.RWMutex
	Sorted      map[Order][]models.VipunenData
	LastUpdated time.Time
}

var VipunenCache = VipunenDataCache{
	Sorted: make(map[Order][]models.VipunenData),
}

var allOrders = []Order{OrderAsc, OrderDesc, OrderMostPopular, OrderLeastPopular, OrderMostSpots, OrderLeastSpots}

const VipunenURL = "https://api.vipunen.fi/api/resources/korkeakoulutus_hakeneet_ja_paikan_vastaanottaneet/data?filter=koulutuksenAlkamisvuosi%3D%3D%272026%27%20and%20hakutapa%3D%3D%27Yhteishaku%27%20and%20koulutusasteTaso1%3D%3D%27Alempi%20korkeakouluaste%27"

func GetVipunenDataCached(order Order) ([]models.VipunenData, error) {
	VipunenCache.mu.RLock()
	dataExists := len(VipunenCache.Sorted) > 0
	timeSinceUpdate := time.Since(VipunenCache.LastUpdated)
	cachedData := VipunenCache.Sorted[order]
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

		// pre-sort all order variants once
		sorted := make(map[Order][]models.VipunenData, len(allOrders))
		for _, o := range allOrders {
			cp := make([]models.VipunenData, len(mergedData))
			copy(cp, mergedData)
			SortVipunenData(cp, o)
			sorted[o] = cp
		}

		VipunenCache.mu.Lock()
		VipunenCache.Sorted = sorted
		VipunenCache.LastUpdated = time.Now()
		VipunenCache.mu.Unlock()

		return sorted[order], nil
	}

	fmt.Println("/api/statistics/: using cached data.")
	return cachedData, nil
}
