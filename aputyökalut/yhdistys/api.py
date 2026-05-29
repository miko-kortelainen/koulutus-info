import requests
import json
import time

def fetch_all_koulutukset(output_filename="opintopolku.json"):
    # The base endpoint without the query string
    base_url = "https://opintopolku.fi/konfo-backend/external/search/koulutukset"
    
    # Parameters extracted and structured cleanly
    params = {
        "size": 100,
        "lng": "fi",
        "sort": "score",
        "order": "desc",
        "koulutustyyppi": "amk-alempi,kandi-ja-maisteri",
        "opetustapa": "opetuspaikkakk_1,opetuspaikkakk_2,opetuspaikkakk_3,opetuspaikkakk_4",
        "maksunmaara_min": 100,
        "maksunmaara_max": 100,
        "lukuvuosimaksunmaara_min": 100,
        "lukuvuosimaksunmaara_max": 100,
        "apuraha": "false",
        "tyovoimakoulutus": "false",
        "taydennyskoulutus": "false",
        "pieniosaamiskokonaisuus": "false",
        "hakutapa": "hakutapa_01,hakutapa_03,hakutapa_04",
        "alkamiskausi": "2026-kevat,2026-syksy"
    }

    all_hits = []
    page = 1
    total_expected = None

    # Using a Session maintains persistent TCP connections across requests
    with requests.Session() as session:
        print("Starting data extraction...")
        
        while True:
            params['page'] = page
            print(f"Fetching page {page}...")
            
            try:
                # Issue the GET request with the dynamic parameters
                response = session.get(base_url, params=params, timeout=10)
                response.raise_for_status() 
                data = response.json()
                
                hits = data.get("hits", [])
                
                # Capture the total expected hits on the first pass
                if total_expected is None:
                    total_expected = data.get("total", 0)
                    print(f"Total records reported by API: {total_expected}")
                
                # Break condition 1: The API returned an empty list of hits
                if not hits:
                    print("No more hits returned. Ending pagination.")
                    break
                    
                all_hits.extend(hits)
                print(f"Retrieved {len(hits)} records. Total accumulated: {len(all_hits)}")
                
                # Break condition 2: The API returned fewer hits than the max size, 
                # meaning we've hit the final partial page.
                if len(hits) < params["size"]:
                    print("Reached the final page.")
                    break
                    
                page += 1
                
                # A brief pause is best practice when scraping/looping APIs
                time.sleep(1) 
                
            except requests.exceptions.RequestException as e:
                print(f"A network error occurred on page {page}: {e}")
                break
            except ValueError:
                print(f"Failed to parse JSON response on page {page}.")
                break

    # Structure the final output for the JSON file
    final_output = {
        "total_fetched": len(all_hits),
        "total_reported_by_api": total_expected,
        "hits": all_hits
    }

    # Write the compiled data to a local file
    with open(output_filename, 'w', encoding='utf-8') as file:
        json.dump(final_output, file, ensure_ascii=False, indent=2)
        
    print(f"\nExtraction complete. Successfully saved {len(all_hits)} records to '{output_filename}'.")

if __name__ == "__main__":
    fetch_all_koulutukset()