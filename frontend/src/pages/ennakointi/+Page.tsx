import { Accordion, Box, Field, Flex, Heading, Input, Link, Stack, Text, chakra } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { numberFormat } from "@/lib/statistics";
import { COLORS } from "@/theme";
import type { EnnakointiPageData } from "@/pages/ennakointi/+data";
import { filterAndSortVajeRows, statusLabel, type SektoriFilter, type VajeSort } from "@/pages/ennakointi/lib/vaje";

const PAGE_SIZE = 10;
const BAR_H = "8";
/** Ylituotos bar — appearance-tuned viz token */
const YLITUOTOS_BAR = "var(--chakra-colors-viz-ylituotos)";
/** Full-width bar track — follows appearance via bg.muted */
const BAR_TRACK = "bg.muted";
const selectProps = {
  bg: "bg",
  borderColor: "border",
  borderRadius: "md",
  borderWidth: "1px",
  fontSize: "sm",
  px: 3,
  py: 2,
  width: "full",
} as const;

export default function EnnakointiPage() {
  const { koulutustarpeet } = useData<EnnakointiPageData>();
  const [search, setSearch] = useState("");
  const [sektori, setSektori] = useState<SektoriFilter>("kaikki");
  const [sort, setSort] = useState<VajeSort>("isoin-vaje");
  const [page, setPage] = useState(1);
  const debounced = useDebounce(search, 300);

  const rows = useMemo(
    () => filterAndSortVajeRows(koulutustarpeet.items, debounced, sektori, sort),
    [koulutustarpeet.items, debounced, sektori, sort],
  );

  const paginated = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const maxAbsVaje = Math.max(...rows.map((r) => Math.abs(r.vaje)), 1);
  const hasFilters = debounced.trim().length > 0 || sektori !== "kaikki";

  return (
    <>
      <PageIntro
        description="Katso mille aloille on ennusteen mukaan eniten pulaa valmistuneista."
        title="Ennakointi"
      />
      <PageContainer align="flex-start">
        <Stack gap={10} width="100%">
          <Accordion.Root collapsible size="sm">
            <Accordion.Item value="mita-luvut-tarkoittavat">
              <Heading as="h2" size="xs">
                <Accordion.ItemTrigger color="fg.muted" fontWeight="medium" py={2}>
                  <Text as="span" flex="1" fontSize="sm" textAlign="start">
                    Mitä luvut tarkoittavat?
                  </Text>
                  <Accordion.ItemIndicator />
                </Accordion.ItemTrigger>
              </Heading>
              <Accordion.ItemContent>
                <Accordion.ItemBody pb={3} pt={1}>
                  <Stack gap={2} fontSize="sm" lineHeight="1.5" maxW="65ch" textWrap="pretty">
                    <Text>
                      <Text as="span" fontWeight="medium">
                        Tarve:
                      </Text>{" "}
                      montako valmistunutta työelämä tarvitsee vuodessa.
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="medium">
                        Tuotos:
                      </Text>{" "}
                      montako alle 30-vuotiasta valmistuu keskimäärin vuodessa korkeakouluista (2022–2024).
                    </Text>
                    <Text>
                      <Text as="span" fontWeight="medium">
                        Vaje:
                      </Text>{" "}
                      tarve miinus tuotos.
                    </Text>
                    <Text>Positiivinen vaje = enemmän tarvetta kuin valmistuvia.</Text>
                    <Text>Negatiivinen vaje = enemmän valmistuvia kuin tarvetta.</Text>
                    <Text color="fg.muted" fontSize="xs" textWrap="pretty">
                      Tietolähde:{" "}
                      <Link
                        color="fg.accent"
                        href="https://vipunen.fi/fi-fi/ennakointi/Sivut/Ty%C3%B6voiman-koulutustarpeet.aspx"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Opetushallituksen koulutustarve-ennuste 2045
                      </Link>
                    </Text>
                  </Stack>
                </Accordion.ItemBody>
              </Accordion.ItemContent>
            </Accordion.Item>
          </Accordion.Root>

          <Stack aria-label="Koulutustarpeet" as="section" gap={6}>
            <Flex direction={{ base: "column", md: "row" }} gap={6}>
              <Field.Root flex="1" gap={1}>
                <Field.Label color="fg.muted" fontSize="xs">
                  Haku
                </Field.Label>
                <Input
                  aria-label="Haku"
                  fontSize="sm"
                  minHeight={9}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Esim. hoitotyö"
                  size="sm"
                  type="search"
                  value={search}
                />
              </Field.Root>
              <Field.Root flex="1" gap={1} maxW={{ md: "16rem" }}>
                <Field.Label color="fg.muted" fontSize="xs">
                  Sektori
                </Field.Label>
                <chakra.select
                  {...selectProps}
                  aria-label="Sektori"
                  onChange={(e) => {
                    setSektori(e.target.value as SektoriFilter);
                    setPage(1);
                  }}
                  value={sektori}
                >
                  <option value="kaikki">Kaikki korkeakoulut</option>
                  <option value="Ammattikorkeakoulu">Ammattikorkeakoulu</option>
                  <option value="Yliopisto">Yliopisto</option>
                </chakra.select>
              </Field.Root>
              <Field.Root flex="1" gap={1} maxW={{ md: "16rem" }}>
                <Field.Label color="fg.muted" fontSize="xs">
                  Järjestys
                </Field.Label>
                <chakra.select
                  {...selectProps}
                  aria-label="Järjestys"
                  onChange={(e) => {
                    setSort(e.target.value as VajeSort);
                    setPage(1);
                  }}
                  value={sort}
                >
                  <option value="isoin-vaje">Isoin pula</option>
                  <option value="pienin-vaje">Pienin pula</option>
                  <option value="a-o">A-Ö</option>
                  <option value="o-a">Ö-A</option>
                </chakra.select>
              </Field.Root>
            </Flex>

            <Text color="fg.muted" fontSize="sm" role="status">
              {rows.length === 0
                ? hasFilters
                  ? "Ei tuloksia. Tyhjennä haku tai vaihda sektoria."
                  : "Ei tuloksia."
                : `${numberFormat.format(rows.length)} alaa`}
            </Text>

            {rows.length === 0 ? null : (
              <>
                <Stack as="ul" gap={5} listStyleType="none" m={0} p={0}>
                  {paginated.map((row) => {
                    const tila = statusLabel(row.vaje);
                    const vajeText = numberFormat.format(row.vaje);
                    const barPct = (Math.abs(row.vaje) / maxAbsVaje) * 100;
                    const barColor = row.vaje < 0 ? YLITUOTOS_BAR : COLORS.accent;
                    const meterLabel = `${row.ala} (${row.sektori}): ${tila}, vaje ${vajeText}. Tarve ${numberFormat.format(row.tarve2045)}, tuotos ${numberFormat.format(row.tuotosNuoret)}.`;

                    return (
                      <Box as="li" key={`${row.sektori}-${row.koodi}`}>
                        <Stack gap={2} minW={0}>
                          <Box minW={0}>
                            <Text fontSize="md" fontWeight="medium" lineHeight="1.4" textWrap="pretty">
                              {row.ala}
                            </Text>
                            <Text color="fg.muted" fontSize="sm">
                              {row.sektori} · {tila}
                            </Text>
                          </Box>
                          <Box
                            aria-label={meterLabel}
                            aria-valuemax={maxAbsVaje}
                            aria-valuemin={0}
                            aria-valuenow={Math.abs(row.vaje)}
                            bg={BAR_TRACK}
                            borderRadius="sm"
                            h={BAR_H}
                            overflow="hidden"
                            position="relative"
                            role="meter"
                            width="100%"
                          >
                            <Box aria-hidden bg={barColor} h="100%" width={`${barPct}%`} />
                            <Flex
                              align="center"
                              aria-hidden
                              h="100%"
                              justify="flex-end"
                              left={0}
                              pointerEvents="none"
                              position="absolute"
                              px={3}
                              top={0}
                              width="100%"
                            >
                              <Text color="text" fontSize="sm" fontVariantNumeric="tabular-nums" fontWeight="semibold">
                                Vaje {vajeText}
                              </Text>
                            </Flex>
                          </Box>
                          <Text color="fg.muted" fontSize="xs" fontVariantNumeric="tabular-nums">
                            Tarve {numberFormat.format(row.tarve2045)} · tuotos {numberFormat.format(row.tuotosNuoret)}
                          </Text>
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
                <Pagination count={rows.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
              </>
            )}
          </Stack>
        </Stack>
      </PageContainer>
    </>
  );
}
