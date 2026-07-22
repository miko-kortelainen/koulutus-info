import { Box, CloseButton, Link, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "yhteishaku:ios-install-tip-dismissed";

function isIosSafari() {
  const isIos =
    /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isSafari = /Safari/.test(navigator.userAgent) && !/(CriOS|FxiOS|EdgiOS|OPiOS)/.test(navigator.userAgent);

  return isIos && isSafari;
}

function isStandalone() {
  const safariNavigator = navigator as Navigator & { standalone?: boolean };

  return window.matchMedia("(display-mode: standalone)").matches || safariNavigator.standalone === true;
}

export default function IosInstallTip() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "true";
    } catch {
      // Storage is optional; keep the tip usable for the current session.
    }
    setVisible(isIosSafari() && !isStandalone() && !dismissed);
  }, []);

  if (!visible) return null;

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch {
      // The tip still closes for the current session when storage is unavailable.
    }
  }

  return (
    <Box aria-label="Yhteishaku kotinäytöllä" as="aside" borderColor="border" borderRadius="lg" borderWidth="1px" p={3}>
      <Stack align="flex-start" direction="row" gap={2}>
        <Stack flex={1} gap={1}>
          <Text fontSize="xs" fontWeight="semibold">
            Lisää yhteishaku.app kotinäytöllesi
          </Text>
          <Text color="fg.muted" fontSize="xs">
            Voit lisätä tämän sivuston iPhonesi Koti-valikkoon.{" "}
            <Link color="fg.accent" href="/asenna/" textDecoration="underline">
              Katso lyhyt ohje
            </Link>
          </Text>
        </Stack>
        <CloseButton aria-label="Sulje kotinäyttövinkki" onClick={dismiss} size="2xs" />
      </Stack>
    </Box>
  );
}
