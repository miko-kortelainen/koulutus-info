import { Card, Heading, Separator, SimpleGrid, Stack, Stat } from "@chakra-ui/react";
import type { YoPisterajatAine } from "@/api/dataValidation";
import type { YoGrade } from "@/config/yoPisterajat";
import { slugify } from "@/lib/slug";
import { numberFormat } from "@/lib/statistics";

interface YoPisterajatTableProps {
  aineet: YoPisterajatAine[];
  arvosanat: YoGrade[];
  label: string;
}

export default function YoPisterajatTable({ aineet, arvosanat, label }: YoPisterajatTableProps) {
  return (
    <Stack aria-label={label} as="ul" gap={4} listStyleType="none" width="full">
      {aineet.map((aine) => (
        <Card.Root as="li" key={aine.nimi} size="md" width="full" zIndex={1}>
          <Card.Header pb={4}>
            <Heading
              as="h2"
              fontSize={{ base: "sm", md: "lg" }}
              fontWeight="semibold"
              id={`yo-${slugify(aine.nimi)}`}
              scrollMarginTop={6}
              tabIndex={-1}
              textWrap="pretty"
            >
              {aine.nimi}
            </Heading>
          </Card.Header>
          <Card.Body pt={0}>
            <Stack>
              <Separator />
              <SimpleGrid columns={arvosanat.length}>
                {arvosanat.map((grade, index) => (
                  <Stat.Root
                    alignItems="baseline"
                    borderColor="border"
                    borderInlineStartWidth={index === 0 ? "0" : "1px"}
                    flexDirection="row"
                    gap={1}
                    justifyContent="center"
                    key={grade}
                    minW={0}
                    pe={1}
                    ps={index === 0 ? 0 : 1}
                  >
                    <Stat.Label color="fg.muted" fontSize="sm">
                      {grade}
                    </Stat.Label>
                    <Stat.ValueText fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                      {numberFormat.format(aine.rajat[grade] as number)}
                    </Stat.ValueText>
                  </Stat.Root>
                ))}
              </SimpleGrid>
            </Stack>
          </Card.Body>
        </Card.Root>
      ))}
    </Stack>
  );
}
