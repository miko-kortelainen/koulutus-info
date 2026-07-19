package services

import (
	"fmt"
	"net/url"
	"school-api/models"
	"sort"
	"strconv"
	"strings"
	"time"
)

func FetchOpintopolkuData(apiURL string) (*models.OpintopolkuData, error) {
	u, err := url.Parse(apiURL)
	if err != nil {
		return nil, fmt.Errorf("invalid base URL: %w", err)
	}

	q := u.Query()

	var allHits []models.School
	page := 1
	var totalExpected int

	for {
		fmt.Printf("fetching page: %d\n", page)

		q.Set("page", strconv.Itoa(page))
		u.RawQuery = q.Encode()
		reqURL := u.String()

		var apiResp models.OpintopolkuData
		if err := FetchJSON("opintopolku", reqURL, &apiResp); err != nil {
			return nil, fmt.Errorf("error processing page %d: %w", page, err)
		}

		if page == 1 {
			totalExpected = apiResp.Total
		}

		if len(apiResp.Hits) == 0 {
			break
		}

		allHits = append(allHits, apiResp.Hits...)

		if len(apiResp.Hits) < 100 {
			break
		}

		page++
		time.Sleep(1 * time.Second)
	}

	return &models.OpintopolkuData{
		Total: totalExpected,
		Hits:  allHits,
	}, nil
}

const koulutusDetailBaseURL = "https://opintopolku.fi/konfo-backend/external/koulutus/"

// okmOhjauksenAlat maps OKM ohjauksen ala codes to the exact koulutusala names
// used in the Vipunen cutoff (pisterajat) data. The classification is official
// and stable; an unknown code fails generation loudly instead of silently
// dropping the schools.json -> pisterajat link.
var okmOhjauksenAlat = map[string]string{
	"okmohjauksenala_1":  "Kasvatusalat",
	"okmohjauksenala_2":  "Taiteet ja kulttuurialat",
	"okmohjauksenala_3":  "Humanistiset alat",
	"okmohjauksenala_4":  "Yhteiskunnalliset alat",
	"okmohjauksenala_5":  "Kauppa, hallinto ja oikeustieteet",
	"okmohjauksenala_6":  "Luonnontieteet",
	"okmohjauksenala_7":  "Tietojenkäsittely ja tietoliikenne",
	"okmohjauksenala_8":  "Tekniikan alat",
	"okmohjauksenala_9":  "Maa- ja metsätalousalat",
	"okmohjauksenala_10": "Lääketieteet",
	"okmohjauksenala_11": "Terveys- ja hyvinvointialat",
	"okmohjauksenala_12": "Palvelualat",
}

type koulutusalaEntry struct {
	KoulutusalaKoodiUrit []string `json:"koulutusalaKoodiUrit"`
}

type koulutusDetail struct {
	KoulutuskoodienAlatJaAsteet []koulutusalaEntry `json:"koulutuskoodienAlatJaAsteet"`
}

// FetchKoulutusalat fetches the Konfo detail of every koulutus hit and returns
// oid -> koulutusala names (OKM ohjauksen ala classification).
func FetchKoulutusalat(hits []models.School) (map[string][]string, error) {
	alat := make(map[string][]string, len(hits))
	for i, hit := range hits {
		var detail koulutusDetail
		// one retry: a single transient timeout must not kill a 145-call batch
		err := FetchJSON("opintopolku koulutus", koulutusDetailBaseURL+hit.Oid, &detail)
		if err != nil {
			time.Sleep(5 * time.Second)
			err = FetchJSON("opintopolku koulutus", koulutusDetailBaseURL+hit.Oid, &detail)
		}
		if err != nil {
			return nil, fmt.Errorf("koulutus %s: %w", hit.Oid, err)
		}
		names, err := alaNamesFromKoodiUrit(&detail)
		if err != nil {
			return nil, fmt.Errorf("koulutus %s (%s): %w", hit.Oid, hit.Nimi.Fi, err)
		}
		alat[hit.Oid] = names
		if (i+1)%20 == 0 {
			fmt.Printf("fetched koulutusalat: %d/%d\n", i+1, len(hits))
		}
		time.Sleep(1 * time.Second)
	}
	return alat, nil
}

func alaNamesFromKoodiUrit(detail *koulutusDetail) ([]string, error) {
	seen := map[string]bool{}
	var names []string
	for _, entry := range detail.KoulutuskoodienAlatJaAsteet {
		for _, uri := range entry.KoulutusalaKoodiUrit {
			code, _, _ := strings.Cut(uri, "#")
			if !strings.HasPrefix(code, "okmohjauksenala_") {
				continue
			}
			name, ok := okmOhjauksenAlat[code]
			if !ok {
				return nil, fmt.Errorf("unmapped OKM ohjauksen ala code %q", code)
			}
			if !seen[name] {
				seen[name] = true
				names = append(names, name)
			}
		}
	}
	if len(names) == 0 {
		return nil, fmt.Errorf("no OKM ohjauksen ala codes in koulutus detail")
	}
	sort.Strings(names)
	return names, nil
}

