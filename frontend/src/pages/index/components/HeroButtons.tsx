import { Button, HStack, Spinner, Stack, Text } from "@chakra-ui/react";
import { motion } from "motion/react";
import { type MouseEvent, useState } from "react";
import type { IconType } from "react-icons";
import { HiOutlineArrowRight, HiOutlineCalculator, HiOutlineChartBar } from "react-icons/hi";

const heroLinks: { href: string; icon: IconType; label: string }[] = [
  { href: "/pistelaskuri/", icon: HiOutlineCalculator, label: "Laske todistuspisteeni" },
  { href: "/hakijamaarat/", icon: HiOutlineChartBar, label: "Näytä hakijamäärät" },
];

function isUnmodifiedLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

export default function HeroButtons() {
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  return (
    <Stack
      direction={{ base: "column", lg: "row" }}
      gap={{ base: 3, md: 4, lg: 8 }}
      width={{ base: "100%", lg: "auto" }}
    >
      {heroLinks.map(({ href, icon: Icon, label }, index) => {
        const isPending = pendingHref === href;
        return (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 8 }}
            key={href}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Button
              _active={{ transform: "scale(0.96)" }}
              _hover={{ bg: "accentFg", color: "bg" }}
              asChild
              bg="accent"
              color="onAccent"
              transitionDuration="0.15s"
              transitionProperty="transform, background-color, color"
              transitionTimingFunction="ease-out"
              variant="solid"
              width={{ base: "100%", lg: "236px" }}
            >
              <a
                aria-busy={isPending || undefined}
                href={href}
                onClick={(event) => {
                  if (!isUnmodifiedLeftClick(event)) return;
                  setPendingHref(href);
                }}
              >
                <HStack gap={2} width="13rem">
                  <Icon aria-hidden="true" />
                  <Text as="span" flex={1} textAlign="left">
                    {label}
                  </Text>
                  {isPending ? (
                    <Spinner aria-hidden="true" color="currentColor" size="inherit" />
                  ) : (
                    <HiOutlineArrowRight aria-hidden="true" />
                  )}
                </HStack>
              </a>
            </Button>
          </motion.div>
        );
      })}
    </Stack>
  );
}
