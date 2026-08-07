import { Box, Button, Stack, Text } from "@chakra-ui/react";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";

interface EntityListProps {
  entities: HakijaprofiiliEntity[];
  selectedName: string | null;
  onSelect: (name: string) => void;
  busy?: boolean;
}

export default function EntityList({ entities, selectedName, onSelect, busy }: EntityListProps) {
  if (entities.length === 0) {
    return (
      <Text color="fg.muted" fontSize="sm" textWrap="pretty">
        Ei tuloksia. Tyhjennä haku tai vaihda kohteen tyyppiä.
      </Text>
    );
  }

  return (
    <Box
      aria-busy={busy || undefined}
      aria-label="Kohteet"
      as="nav"
      borderColor="bg.muted"
      borderRadius="md"
      borderWidth="1px"
      maxH={{ base: "16rem", lg: "min(70vh, 40rem)" }}
      overflowY="auto"
      p={1}
    >
      <Stack as="ul" gap={1} listStyleType="none" m={0} p={0}>
        {entities.map((entity) => {
          const selected = entity.kohdeNimi === selectedName;
          return (
            <Box as="li" key={`${entity.kohdeTyyppi}:${entity.kohdeNimi}`}>
              <Button
                _focusVisible={{ outline: "2px solid", outlineColor: "fg.accent", outlineOffset: "2px" }}
                aria-current={selected ? "true" : undefined}
                borderColor={selected ? "accent" : "transparent"}
                borderWidth={selected ? "2px" : "1px"}
                fontWeight={selected ? "semibold" : "normal"}
                height="auto"
                justifyContent="flex-start"
                minH={9}
                onClick={() => onSelect(entity.kohdeNimi)}
                py={2}
                size="sm"
                textAlign="left"
                variant="ghost"
                whiteSpace="normal"
                width="100%"
              >
                {entity.kohdeNimi}
              </Button>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
