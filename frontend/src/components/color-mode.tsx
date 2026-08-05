import { IconButton } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

export const APPEARANCE_STORAGE_KEY = "yhteishaku:appearance";

/** Ignore further toggles until the theme has settled. */
const TOGGLE_COOLDOWN_MS = 400;

export function ColorModeProvider(props: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange storageKey={APPEARANCE_STORAGE_KEY} {...props} />
  );
}

export function ColorModeButton() {
  const { resolvedTheme, setTheme } = useTheme();
  // next-themes resolves on the client during the first render (useSyncExternalStore),
  // so gating on resolvedTheme mismatches SSR HTML and React 19 leaves disabled stuck.
  const [mounted, setMounted] = useState(false);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    if (!busy) return;
    const id = window.setTimeout(() => setBusy(false), TOGGLE_COOLDOWN_MS);
    return () => window.clearTimeout(id);
  }, [busy]);
  const isDark = mounted && resolvedTheme === "dark";

  return (
    <IconButton
      aria-label="Tumma teema"
      aria-pressed={mounted ? isDark : undefined}
      disabled={!mounted || busy}
      onClick={() => {
        if (!mounted || busy) return;
        setBusy(true);
        setTheme(isDark ? "light" : "dark");
      }}
      size="sm"
      variant="ghost"
    >
      {isDark ? <HiOutlineSun /> : <HiOutlineMoon />}
    </IconButton>
  );
}
