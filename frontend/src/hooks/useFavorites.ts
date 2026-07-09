import { useCallback, useSyncExternalStore } from "react";
import type { ToteutusEntry } from "@/types.gen";

const STORAGE_KEY = "yhteishaku:tallennetut";
const EMPTY: ToteutusEntry[] = [];
const listeners = new Set<() => void>();
let cache: ToteutusEntry[] | null = null;

function readFromStorage(): ToteutusEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY;
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
