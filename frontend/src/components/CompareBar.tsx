import { ActionBar, Button, HStack, Portal, Tag } from "@chakra-ui/react";
import { statisticsRoundShortLabel, type YearOption } from "@/config/yearOptions";
import type { StatisticsEntry } from "@/types.gen";

export interface CompareSelection {
  degree: StatisticsEntry;
  year: YearOption;
}

interface CompareBarProps {
  selected: CompareSelection[];
  onRemove: (selection: CompareSelection) => void;
}

export default function CompareBar({ selected, onRemove }: CompareBarProps) {
  const compareHref =
    selected.length === 2
      ? `/vertaile/?a=${encodeURIComponent(selected[0].degree.kooditHakukohde)}&b=${encodeURIComponent(selected[1].degree.kooditHakukohde)}&vuosi=${selected[0].year}&vuosi_b=${selected[1].year}`
      : undefined;

  return (
    <ActionBar.Root open={selected.length > 0}>
      <Portal>
        <ActionBar.Positioner zIndex="popover">
          <ActionBar.Content
            bg="bg.muted"
            minH={{ base: "3rem", md: "5rem" }}
            w={{ base: "90%", md: "65rem" }}
          >
            <HStack flex={1} gap={2} minW={0}>
              {selected.map((selection) => (
                <Tag.Root
                  flex={1}
                  key={`${selection.year}-${selection.degree.kooditHakukohde}`}
                  minW={0}
                  size={{ base: "lg", md: "xl" }}
                >
                  <Tag.Label truncate>
                    {selection.degree.hakukohde} ({statisticsRoundShortLabel(selection.year)})
                  </Tag.Label>
                  <Tag.EndElement>
                    <Tag.CloseTrigger
                      aria-label={`Poista ${selection.degree.hakukohde}, ${statisticsRoundShortLabel(selection.year)}`}
                      onClick={() => onRemove(selection)}
                    />
                  </Tag.EndElement>
                </Tag.Root>
              ))}
            </HStack>
            <ActionBar.Separator />
            <Button
              asChild={!!compareHref}
              bg="accent"
              color="onAccent"
              disabled={!compareHref}
              size={{ base: "xs", md: "sm" }}
              variant="solid"
            >
              {compareHref ? (
                <a href={compareHref} onClick={() => window.sa_event?.("compare_degrees")}>
                  Vertaile
                </a>
              ) : (
                <>Vertaile</>
              )}
            </Button>
          </ActionBar.Content>
        </ActionBar.Positioner>
      </Portal>
    </ActionBar.Root>
  );
}
