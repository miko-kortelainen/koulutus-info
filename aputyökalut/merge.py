import json
import os

FIELDS_TO_REMOVE = [
    "hakutyyppi",
    "valintatapajononTyyppi",
    "koulutusala2002",
    "opintoala2002",
    "koulutusalaTaso2",
    "kooditKuntaHakukohde",
    "kooditKorkeakoulu",
    "kooditPaaasiallinenTutkintoHakukohde",
    "tutkinnonAloitussykli",
    "valitutLkm",
    "paikanVastaanottaneetLkm",
    "aloittaneetLkm",
    "alinHyvaksyttyPistemaara",
    "ylinHyvaksyttyPistemaara",
]

def normalize(s):
    """Lowercase and normalize spaces around commas."""
    if not s:
        return s
    # Collapse any spaces around commas into a single ", "
    import re
    s = re.sub(r'\s*,\s*', ', ', s)
    return s.lower()

def find_matching_koulutus(paaasiallinen, koulutus_list):
    """Returns the matching koulutus string if found, else None."""
    if not paaasiallinen:
        return None
    paaasiallinen_norm = normalize(paaasiallinen)
    for k in koulutus_list:
        if normalize(k) in paaasiallinen_norm:
            return k
    return None

def validate_koulutus_pairs(merged_data, koulutukset_file_path, script_dir):
    with open(koulutukset_file_path, "r", encoding="utf-8") as f:
        koulutukset = json.load(f)

    koulutus_list = [item["koulutus"] for item in koulutukset if item.get("koulutus")]
    koulutus_set = set(koulutus_list)

    print(f"\n--- Koulutus Pair Validation ---")
    print(f"Unique koulutus entries in koulutukset: {len(koulutus_set)}")

    unmatched_merged = []
    matched_koulutus = set()

    for item in merged_data:
        paaasiallinen = item.get("hakukohde")
        match = find_matching_koulutus(paaasiallinen, koulutus_list)
        if match:
            matched_koulutus.add(match)
        else:
            unmatched_merged.append({
                "kooditHakukohde": item.get("kooditHakukohde"),
                "paaasiallinenTutkintoHakukohde": paaasiallinen,
            })

    unmatched_koulutus = koulutus_set - matched_koulutus

    if unmatched_merged:
        print(f"\n  {len(unmatched_merged)} merged item(s) with NO matching koulutus:")
        unmatched_path = os.path.join(script_dir, "unmatched_merged.json")
        with open(unmatched_path, "w", encoding="utf-8") as f:
            json.dump(unmatched_merged, f, indent=2, ensure_ascii=False)
        print(f"  Written to unmatched_merged.json")
    else:
        print("\n✅ All merged items have a matching koulutus.")

    if unmatched_koulutus:
        print(f"\n  {len(unmatched_koulutus)} koulutus entry/entries with NO matching merged item:")
    else:
        print("✅ All koulutus entries matched at least one merged item.")

    print(f"\nSummary: {len(matched_koulutus)}/{len(koulutus_set)} koulutus entries matched.")

def process_application_data(input_file_name, output_file_name, koulutukset_file_name):
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # 1. Load the data from the JSON file
    file_path = os.path.join(script_dir, input_file_name)
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Successfully loaded {len(data)} records.")

    # 2. Perform the merge logic
    merged_map = {}
    for item in data:
        id_ = item["hakukohde"]
        if id_ not in merged_map:
            merged_map[id_] = dict(item)
        else:
            existing = merged_map[id_]
            for key, value in item.items():
                if existing.get(key) is None and value is not None:
                    existing[key] = value

    final_results = list(merged_map.values())
    print(f"Merge complete. Reduced to {len(final_results)} unique items.")

    # Filter out entries where hakukohde includes "muuntokoulutus", "arkistoitu", or "avoimen väylä"
    terms_to_filter = ["muuntokoulutus", "arkistoitu", "avoimen väylä"]
    final_results = [item for item in final_results if not any(term in item.get("hakukohde", "").lower() for term in terms_to_filter)]
    print(f"After filtering unwanted terms: {len(final_results)} items remaining.")

    # 3. Remove listed fields
    for item in final_results:
        for field in FIELDS_TO_REMOVE:
            item.pop(field, None)
    print(f"Removed fields: {FIELDS_TO_REMOVE}")

    # 4. Validate koulutus pairs
    koulutukset_path = os.path.join(script_dir, koulutukset_file_name)
    validate_koulutus_pairs(final_results, koulutukset_path, script_dir)

    # 5. Save the merged data to a new file
    output_path = os.path.join(script_dir, output_file_name)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(final_results, f, indent=2, ensure_ascii=False)
    print(f"\nSaved merged data to {output_file_name}")

process_application_data("data.json", "merged_data.json", "koulutukset.json")