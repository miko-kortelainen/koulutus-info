import { useCallback, useSyncExternalStore } from "react";
import type { ToteutusEntry } from "@/types.gen";

const STORAGE_KEY = "yhteishaku:tallennetut";
const EMPTY: ToteutusEntry[] = [];
const listeners = new Set<() => void>();
let cache: ToteutusEntry[] | null = null;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isLanguageStrings = (value: unknown) =>
  isRecord(value) &&
  [value.fi, value.sv, value.en].every((translation) => translation === undefined || typeof translation === "string");

const isFavorite = (value: unknown): value is ToteutusEntry =>
  isRecord(value) &&
  typeof value.toteutusOid === "string" &&
  isLanguageStrings(value.toteutusNimi) &&
  isLanguageStrings(value.oppilaitosNimi) &&
  Array.isArray(value.kunnat) &&
  value.kunnat.every((kunta) => typeof kunta === "string");

function readFromStorage(): ToteutusEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.every(isFavorite) ? parsed : EMPTY;
  } catch {
    return EMPTY;
  }
}

function getSnapshot(): ToteutusEntry[] {
  if (cache === null) {
    cache = readFromStorage();
  }
  return cache;
}

function getServerSnapshot(): ToteutusEntry[] {
  return EMPTY;
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  return () => listeners.delete(onStoreChange);
}

function writeFavorites(next: ToteutusEntry[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage is optional; keep favorites usable for the current session if persistence is unavailable.
  }
  listeners.forEach((listener) => {
    listener();
  });
}

export default function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback((oid: string) => favorites.some((f) => f.toteutusOid === oid), [favorites]);

  const toggleFavorite = useCallback((toteutus: ToteutusEntry) => {
    const current = getSnapshot();
    const next = current.some((f) => f.toteutusOid === toteutus.toteutusOid)
      ? current.filter((f) => f.toteutusOid !== toteutus.toteutusOid)
      : [...current, toteutus];
    writeFavorites(next);
  }, []);

  return { favorites, isFavorite, toggleFavorite };
}
