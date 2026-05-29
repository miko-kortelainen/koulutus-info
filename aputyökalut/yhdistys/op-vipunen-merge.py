import json
from difflib import SequenceMatcher

# --- Tunable thresholds ---
INSTITUTION_THRESHOLD = 0.70
PROGRAM_THRESHOLD = 0.55
COMBINED_THRESHOLD = 0.70
INSTITUTION_WEIGHT = 0.4
PROGRAM_WEIGHT = 0.6


def normalize_text(text: str) -> str:
    if not text:
        return ""
    return str(text).lower().strip()


def fuzzy_match(text1: str, text2: str) -> float:
    """Return similarity ratio [0.0, 1.0] for two already-normalized strings."""
    if not text1 or not text2:
        return 0.0
    return SequenceMatcher(None, text1, text2).ratio()


def build_institution_index(opintopolku_raw: dict) -> dict:
    """Index Opintopolku entries by normalized institution name."""
    index = {}
    for hit in opintopolku_raw.get("hits", []):
        koulutus_oid = hit.get("oid")
        for toteutus in hit.get("toteutukset", []):
            oppilaitos_fi = normalize_text(
                toteutus.get("oppilaitosNimi", {}).get("fi", "")
            )
            toteutus_fi = normalize_text(
                toteutus.get("toteutusNimi", {}).get("fi", "")
            )
            index.setdefault(oppilaitos_fi, []).append({
                "koulutusOid": koulutus_oid,
                "toteutusOid": toteutus.get("toteutusOid"),
                "toteutusNimi": toteutus.get("toteutusNimi", {}),
                "toteutus_fi_norm": toteutus_fi,
            })
    return index


def find_best_institution(korkeakoulu_norm: str, index: dict) -> tuple[list | None, float]:
    """
    Return (programs, score) for the best-matching institution.
    Priority: exact → substring → full fuzzy scan.
    """
    best_match = None
    best_score = 0.0

    for oppi_norm, programs in index.items():
        if korkeakoulu_norm == oppi_norm:
            return programs, 1.0  # Early exit on exact match
        if korkeakoulu_norm in oppi_norm or oppi_norm in korkeakoulu_norm:
            score = fuzzy_match(korkeakoulu_norm, oppi_norm)
            if score > best_score:
                best_score = score
                best_match = programs

    # Full fuzzy fallback if no substring match found
    if best_match is None:
        for oppi_norm, programs in index.items():
            score = fuzzy_match(korkeakoulu_norm, oppi_norm)
            if score > best_score:
                best_score = score
                best_match = programs

    return best_match, best_score


def find_best_program(
    hakukohde_norm: str,
    programs: list,
    institution_score: float,
) -> tuple[dict | None, float]:
    """Return (program, combined_score) for the best matching program."""
    best_prog = None
    best_score = 0.0

    for prog in programs:
        prog_score = fuzzy_match(hakukohde_norm, prog["toteutus_fi_norm"])
        if prog_score < PROGRAM_THRESHOLD:
            continue
        combined = institution_score * INSTITUTION_WEIGHT + prog_score * PROGRAM_WEIGHT
        if combined > best_score:
            best_score = combined
            best_prog = prog

    return best_prog, best_score


def merge_opintopolku_vipunen(
    opintopolku_path: str,
    vipunen_path: str,
    output_path: str,
) -> None:
    print("\n" + "=" * 80)
    print("IMPROVED FUZZY MATCHING MERGE (OPTIMIZED)")
    print("=" * 80)

    with open(opintopolku_path, "r", encoding="utf-8") as f:
        opintopolku_raw = json.load(f)
    with open(vipunen_path, "r", encoding="utf-8") as f:
        vipunen_data = json.load(f)

    index = build_institution_index(opintopolku_raw)
    merged_results = []

    for v_item in vipunen_data:
        hakukohde = v_item.get("hakukohde", "")
        korkeakoulu = v_item.get("korkeakoulu", "")
        hakukohde_norm = normalize_text(hakukohde)
        korkeakoulu_norm = normalize_text(korkeakoulu)

        matched_prog = None

        institution_programs, institution_score = find_best_institution(
            korkeakoulu_norm, index
        )

        if institution_programs and institution_score >= INSTITUTION_THRESHOLD:
            matched_prog, combined_score = find_best_program(
                hakukohde_norm, institution_programs, institution_score
            )
            if combined_score < COMBINED_THRESHOLD:
                matched_prog = None

        row = {**v_item}
        if matched_prog:
            row["opintopolku_toteutus_oid"] = matched_prog["toteutusOid"]
            row["opintopolku_koulutus_oid"] = matched_prog["koulutusOid"]
        else:
            row["opintopolku_toteutus_oid"] = None
            row["opintopolku_koulutus_oid"] = None
            print(f"  [UNMATCHED] '{korkeakoulu}' / '{hakukohde}'")

        merged_results.append(row)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(merged_results, f, ensure_ascii=False, indent=4)

    total = len(merged_results)
    matched = sum(1 for r in merged_results if r.get("opintopolku_koulutus_oid"))
    unmatched = total - matched

    print(f"\n✅ Merge complete! Results saved to {output_path}")
    print(f"\nStatistics:")
    print(f"  Total entries: {total}")
    if total > 0:
        print(f"  Matched:       {matched} ({100 * matched / total:.1f}%)")
        print(f"  Unmatched:     {unmatched} ({100 * unmatched / total:.1f}%)")


if __name__ == "__main__":
    merge_opintopolku_vipunen("opintopolku.json", "vipunen.json", "merged-op-vipunen.json")