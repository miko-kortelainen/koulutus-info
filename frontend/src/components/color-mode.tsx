import { Button, HStack, Text } from "@chakra-ui/react";
import { ThemeProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

import { COLORS, THEME_COLOR } from "@/theme";

export const APPEARANCE_STORAGE_KEY = "yhteishaku:appearance";

/** Ignore further toggles until the theme has settled. */
const TOGGLE_COOLDOWN_MS = 400;

export function ColorModeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange storageKey={APPEARANCE_STORAGE_KEY} {...props}>
      <ThemeColorSync />
      {children}
    </ThemeProvider>
  );
}

function ThemeColorSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    if (resolvedTheme !== "light" && resolvedTheme !== "dark") return;

    const color = resolvedTheme === "dark" ? THEME_COLOR.dark : THEME_COLOR.light;
    let meta = document.querySelector("meta[name='theme-color'][data-appearance]");
    if (!(meta instanceof HTMLMetaElement)) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      meta.setAttribute("data-appearance", "");
      document.head.insertBefore(meta, document.head.firstChild);
    }
    meta.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
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
  const Icon = isDark ? HiOutlineSun : HiOutlineMoon;
  const label = isDark ? "vaalea teema" : "tumma teema";
  const description = isDark ? "Vaihda vaaleaan ulkoasuun" : "Vaihda tummaan ulkoasuun";

  return (
    <Button
      _hover={{ bg: "transparent" }}
      alignItems="flex-start"
      aria-pressed={mounted ? isDark : undefined}
      disabled={!mounted || busy}
      display="flex"
      flexDirection="column"
      font="inherit"
      fontWeight="normal"
      height="auto"
      onClick={() => {
        if (!mounted || busy) return;
        setBusy(true);
        setTheme(isDark ? "light" : "dark");
      }}
      px={0}
      py={0}
      textAlign="left"
      variant="ghost"
      whiteSpace="normal"
      width="100%"
    >
      <HStack gap={2}>
        <Icon color={COLORS.accentFg} size="1rem" />
        <Text as="span">{label}</Text>
      </HStack>
      <Text
        color="fg.muted"
        fontSize="sm"
        textDecor="underline"
        textDecorationColor={COLORS.accentFg}
        textDecorationStyle="dotted"
        textDecorationThickness={2}
      >
        {description}
      </Text>
    </Button>
  );
}
