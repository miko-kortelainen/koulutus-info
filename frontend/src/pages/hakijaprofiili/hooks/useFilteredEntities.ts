import Fuse from "fuse.js";
import { useMemo } from "react";
import type { HakijaprofiiliEntity, HakijaprofiiliKohdeTyyppi } from "@/api/dataValidation";
import { hasPublishableProfili } from "../lib/masking";
import { type SortOption, sortEntities } from "../lib/sortEntities";

const FUSE_OPTIONS = { keys: ["kohdeNimi"], threshold: 0.35, ignoreLocation: true };

export default function useFilteredEntities(
  data: HakijaprofiiliEntity[] | undefined,
  scope: HakijaprofiiliKohdeTyyppi,
  searchTerm: string,
  sortOrder: SortOption,
) {
  return useMemo(() => {
    const scoped = (data ?? [])
      .filter((entity) => entity.kohdeTyyppi === scope)
      .filter((entity) => scope !== "tutkinto" || hasPublishableProfili(entity));

    const trimmed = searchTerm.trim();
    let filtered: HakijaprofiiliEntity[];
    if (!trimmed) {
      filtered = scoped;
    } else if (scope === "tutkinto") {
      filtered = new Fuse(scoped, FUSE_OPTIONS).search(trimmed).map(({ item }) => item);
    } else {
      const needle = trimmed.toLocaleLowerCase("fi");
      filtered = scoped.filter((entity) => entity.kohdeNimi.toLocaleLowerCase("fi").includes(needle));
    }

    return sortEntities(filtered, sortOrder);
  }, [data, scope, searchTerm, sortOrder]);
}
