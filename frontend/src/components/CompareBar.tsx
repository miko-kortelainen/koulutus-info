import { ActionBar, Button, HStack, Portal, Tag } from "@chakra-ui/react";
import type { StatisticsEntry } from "@/types.gen";
import { COLORS } from "@/theme";

interface CompareBarProps {
  selected: StatisticsEntry[];
  year: string;
  onRemove: (degree: StatisticsEntry) => void;
}

export default function CompareBar({ selected, year, onRemove }: CompareBarProps) {
  const compareHref =
    selected.length === 2
      ? `/vertaile?a=${encodeURIComponent(selected[0].kooditHakukohde)}&b=${encodeURIComponent(selected[1].kooditHakukohde)}&vuosi=${year}`
      : undefined;

  return (
    <ActionBar.Root open={selected.length > 0}>
      <Portal>
        <ActionBar.Positioner zIndex="popover">
          <ActionBar.Content
            w={{ base: "90%", md: "65rem" }}
            bg={COLORS.surfaceMuted}
            minH={{ base: "3rem", md: "5rem" }}
          >
            <HStack flex={1} minW={0} gap={2}>
              {selected.map((degree) => (
                <Tag.Root key={degree.kooditHakukohde} size={{ base: "lg", md: "xl" }} flex={1} minW={0}>
                  <Tag.Label truncate>{degree.hakukohde}</Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger aria-label={`Poista ${degree.hakukohde}`} onClick={() => onRemove(degree)} />
                  </Tag.EndElement>
                </Tag.Root>
              ))}
            </HStack>
            <ActionBar.Separator />
            <Button
              asChild={!!compareHref}
              size={{ base: "xs", md: "sm" }}
              disabled={!compareHref}
              variant="solid"
              bg={COLORS.accent}
            >
              {compareHref ? <a href={compareHref}>Vertaile</a> : <>Vertaile</>}
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
