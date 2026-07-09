import { ActionBar, Button, HStack, Portal, Tag } from "@chakra-ui/react";
import { COLORS } from "@/theme";
import type { StatisticsEntry } from "@/types.gen";

interface CompareBarProps {
  selected: StatisticsEntry[];
  year: string;
  onRemove: (degree: StatisticsEntry) => void;
}

export default function CompareBar({ selected, year, onRemove }: CompareBarProps) {
  const compareHref =
    selected.length === 2
      ? `/vertaile/?a=${encodeURIComponent(selected[0].kooditHakukohde)}&b=${encodeURIComponent(selected[1].kooditHakukohde)}&vuosi=${year}`
      : undefined;

  return (
    <ActionBar.Root open={selected.length > 0}>
      <Portal>
        <ActionBar.Positioner zIndex="popover">
          <ActionBar.Content
            bg={COLORS.surfaceMuted}
            minH={{ base: "3rem", md: "5rem" }}
            w={{ base: "90%", md: "65rem" }}
          >
            <HStack flex={1} gap={2} minW={0}>
              {selected.map((degree) => (
                <Tag.Root flex={1} key={degree.kooditHakukohde} minW={0} size={{ base: "lg", md: "xl" }}>
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
              bg={COLORS.accent}
              disabled={!compareHref}
              size={{ base: "xs", md: "sm" }}
              variant="solid"
            >
              {compareHref ? <a href={compareHref}>Vertaile</a> : <>Vertaile</>}
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
