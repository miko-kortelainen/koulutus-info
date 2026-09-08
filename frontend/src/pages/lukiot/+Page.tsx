import { Accordion, Box, Checkbox, Heading, Input, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { HiCheckCircle } from "react-icons/hi";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { LukiotPageData } from "@/pages/lukiot/+data";
import LukioSchoolCard from "@/pages/lukiot/components/LukioSchoolCard";
import SortControl from "@/pages/lukiot/components/SortControl";
import useFilteredLukioSchools from "@/pages/lukiot/hooks/useFilteredLukioKeskiarvot";
import { type LukioSortOption, parseOmaKeskiarvo } from "@/pages/lukiot/lib/sortLukioKeskiarvot";
import { COLORS } from "@/theme";

const PAGE_SIZE = 10;

export default function LukiotPage() {
  const entries = useData<LukiotPageData>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [omaKeskiarvoInput, setOmaKeskiarvoInput] = useState("");
  const [showErityislinjat, setShowErityislinjat] = useState(true);
  const [sortOrder, setSortOrder] = useState<LukioSortOption>("school_asc");
  const debouncedSearch = useDebounce(searchTerm, 200);
  const debouncedKeskiarvo = useDebounce(omaKeskiarvoInput, 200);
  const omaKeskiarvo = parseOmaKeskiarvo(debouncedKeskiarvo);
  const schools = useFilteredLukioSchools(entries, debouncedSearch, omaKeskiarvo, showErityislinjat, sortOrder);
  const paginated = schools.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const controls = (
    <Stack gap={3} width="full" zIndex={10}>
      <Input
        aria-label="Oma keskiarvo"
        inputMode="decimal"
        minHeight={9}
        onChange={(event) => {
          setOmaKeskiarvoInput(event.target.value);
          setPage(1);
        }}
        placeholder="Oma keskiarvo, esim. 7,50"
        size="sm"
        value={omaKeskiarvoInput}
      />
      <SearchInput
        onChange={(value) => {
          setSearchTerm(value);
          setPage(1);
        }}
        placeholder="Hae lukiota tai linjaa"
        value={searchTerm}
      />
      <SortControl
        onChange={(value) => {
          setSortOrder(value);
          setPage(1);
        }}
        value={sortOrder}
      />
      <Checkbox.Root
        checked={showErityislinjat}
        onCheckedChange={({ checked }) => {
          setShowErityislinjat(checked === true);
          setPage(1);
        }}
        size="sm"
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>Näytä myös erityislinjat</Checkbox.Label>
      </Checkbox.Root>
    </Stack>
  );

  const schoolAccordions = (
    <Accordion.Root as="ul" collapsible listStyleType="none" multiple width="full">
      {paginated.length === 0 ? <Text as="li">Ei tuloksia haulle.</Text> : null}
      {paginated.map((school) => (
        <Accordion.Item as="li" key={school.slug} value={school.slug}>
          <Heading as="h2" size="sm">
            <Accordion.ItemTrigger py={4}>
              <Text as="span" flex="1" textAlign="start">
                {school.koulu}
              </Text>
              {school.reachable == null ? null : (
                <Box
                  aria-label={school.reachable ? "Keskiarvo riittää yleislinjalle" : "Keskiarvo ei riitä yleislinjalle"}
                  as="span"
                  color={school.reachable ? COLORS.accentFg : "fg.muted"}
                  display="inline-flex"
                  flexShrink={0}
                  fontSize="xl"
                  mr={2}
                  role="img"
                >
                  <HiCheckCircle aria-hidden />
                </Box>
              )}
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
          </Heading>
          <Accordion.ItemContent>
            <Accordion.ItemBody pb={6}>
              <LukioSchoolCard entries={school.entries} koulu={school.koulu} />
            </Accordion.ItemBody>
          </Accordion.ItemContent>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );

  return (
    <>
      <PageIntro
        description={
          <>
            Toisen asteen yhteishaun {LUKIO_KESKIARVOT_YEAR} lukioiden pisterajat.
            <br />
            Yleislinjan pisteraja vastaa lukuaineiden keskiarvoa.
            <br />
            Erityislinjojen pisteytyksessä on yleensä mukana myös lisänäyttö, pääsykoe tai painotettu arvosana.
          </>
        }
        title={`Lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}`}
      />
      <PageContainer align="flex-start">
        {controls}
        {schoolAccordions}
        <Pagination count={schools.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
      </PageContainer>
    </>
  );
}
