import { Box, Heading, Stack, Text } from "@chakra-ui/react";
import type { HakijaprofiiliEntity } from "@/api/dataValidation";
import {
  breakdownTotal,
  formatGenderCount,
  genderRowsForDisplay,
  hasPublishableProfili,
  publishableCounts,
  sortAgeBands,
} from "@/pages/hakijaprofiili/lib/masking";
import ProfiliBarList from "@/pages/hakijaprofiili/components/ProfiliBarList";

interface ProfiliDetailProps {
  entity: HakijaprofiiliEntity;
}

export default function ProfiliDetail({ entity }: ProfiliDetailProps) {
  const genderRows = genderRowsForDisplay(entity.sukupuoli);
  const ageRows = sortAgeBands(publishableCounts(entity.ikaryhmat));
  const sparse = !hasPublishableProfili(entity);

  return (
    <Stack gap={8}>
      <Box borderBottomWidth="2px" borderColor="accent" pb={3}>
        <Heading as="h2" size="sm">
          {entity.kohdeNimi}
        </Heading>
      </Box>

      {sparse ? (
        <Text color="fg.muted" fontSize="sm" textWrap="pretty">
          Suppeat tai peitetyt tiedot, kohteella on alle viisi hakijaa.
        </Text>
      ) : null}

      <Stack gap={3}>
        <Heading as="h3" size="sm">
          Sukupuoli
        </Heading>
        <ProfiliBarList
          ariaLabel={`Sukupuolijakauma: ${entity.kohdeNimi}`}
          formatCountLabel={formatGenderCount}
          rows={genderRows}
          total={breakdownTotal(genderRows)}
        />
      </Stack>

      <Stack gap={3}>
        <Heading as="h3" size="sm">
          Ikäryhmät
        </Heading>
        <ProfiliBarList
          ariaLabel={`Ikäryhmäjakauma: ${entity.kohdeNimi}`}
          rows={ageRows}
          total={breakdownTotal(ageRows)}
        />
      </Stack>
    </Stack>
  );
}
