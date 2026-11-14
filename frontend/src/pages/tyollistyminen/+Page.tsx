import { Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { TyollistyminenPageData } from "@/pages/tyollistyminen/+data";
import FieldTab from "@/pages/tyollistyminen/components/FieldTab";
import OccupationTab from "@/pages/tyollistyminen/components/OccupationTab";
import {
  type FieldSort,
  filterAndSortFieldRows,
  filterAndSortOccupations,
  getOccupationGroups,
  mergeFieldRows,
  type OccupationSort,
  searchOccupations,
} from "@/pages/tyollistyminen/lib/tyollistyminen";

export default function TyollistyminenPage() {
  const { tyollistyminen, koulutusalaPalkat, ammattienPalkat } = useData<TyollistyminenPageData>();
  const [fieldSearch, setFieldSearch] = useState("");
  const [fieldSort, setFieldSort] = useState<FieldSort>("a-o");
  const [fieldOccupationPage, setFieldOccupationPage] = useState(1);

  const [occupationSearch, setOccupationSearch] = useState("");
  const [occupationGroup, setOccupationGroup] = useState("kaikki");
  const [occupationSort, setOccupationSort] = useState<OccupationSort>("palkka-desc");
  const [occupationPage, setOccupationPage] = useState(1);

  const debouncedFieldSearch = useDebounce(fieldSearch, 250);
  const debouncedOccupationSearch = useDebounce(occupationSearch, 250);

  const mergedFields = useMemo(
    () => mergeFieldRows(tyollistyminen.items, koulutusalaPalkat.items, ammattienPalkat.items),
    [tyollistyminen.items, koulutusalaPalkat.items, ammattienPalkat.items],
  );

  const fieldRows = useMemo(
    () => filterAndSortFieldRows(mergedFields, debouncedFieldSearch, fieldSort),
    [mergedFields, debouncedFieldSearch, fieldSort],
  );

  const matchedOccupations = useMemo(
    () => searchOccupations(ammattienPalkat.items, debouncedFieldSearch),
    [ammattienPalkat.items, debouncedFieldSearch],
  );

  const occupationGroups = useMemo(() => getOccupationGroups(ammattienPalkat.items), [ammattienPalkat.items]);

  const filteredOccupations = useMemo(
    () => filterAndSortOccupations(ammattienPalkat.items, debouncedOccupationSearch, occupationGroup, occupationSort),
    [ammattienPalkat.items, debouncedOccupationSearch, occupationGroup, occupationSort],
  );

  const maxOccupationSalary = useMemo(
    () => Math.max(1, ...ammattienPalkat.items.filter((item) => !item.onRyhma).map((item) => item.mediaaniPalkka)),
    [ammattienPalkat.items],
  );

  return (
    <>
      <PageIntro
        description="Katso koulutusalojen työllistyminen sekä mediaanipalkat aloittain ja ammateittain."
        title="Työllistyminen ja palkat"
      />
      <PageContainer align="flex-start">
        <Tabs.Root defaultValue="koulutusalat" lazyMount size="sm" unmountOnExit width="full">
          <Tabs.List aria-label="Työllistyminen ja palkat näkymittäin">
            <Tabs.Trigger
              flex={1}
              fontWeight="semibold"
              justifyContent="center"
              letterSpacing="wide"
              value="koulutusalat"
            >
              Koulutusalat
            </Tabs.Trigger>
            <Tabs.Trigger flex={1} fontWeight="semibold" justifyContent="center" letterSpacing="wide" value="ammatit">
              Ammatit
            </Tabs.Trigger>
            <Tabs.Indicator bg="bg.muted" />
          </Tabs.List>

          <Tabs.Content pt={6} px={0} value="koulutusalat">
            <FieldTab
              fieldRows={fieldRows}
              matchedOccupations={matchedOccupations}
              maxOccupationSalary={maxOccupationSalary}
              occupationPage={fieldOccupationPage}
              onOccupationPageChange={setFieldOccupationPage}
              onSearchChange={(value) => {
                setFieldSearch(value);
                setFieldOccupationPage(1);
              }}
              onSortChange={setFieldSort}
              search={fieldSearch}
              sort={fieldSort}
            />
          </Tabs.Content>

          <Tabs.Content pt={6} px={0} value="ammatit">
            <OccupationTab
              group={occupationGroup}
              groups={occupationGroups}
              items={filteredOccupations}
              maxSalary={maxOccupationSalary}
              onGroupChange={(value) => {
                setOccupationGroup(value);
                setOccupationPage(1);
              }}
              onPageChange={setOccupationPage}
              onSearchChange={(value) => {
                setOccupationSearch(value);
                setOccupationPage(1);
              }}
              onSortChange={(value) => {
                setOccupationSort(value);
                setOccupationPage(1);
              }}
              page={occupationPage}
              search={occupationSearch}
              sort={occupationSort}
            />
          </Tabs.Content>
        </Tabs.Root>

        <Text color="fg.muted" fontSize="xs">
          Lähde: Tilastokeskus, {tyollistyminen.vuosi} · Työllisiin lasketaan päätoimiset työlliset ja työn ohessa
          opiskelevat.
        </Text>
      </PageContainer>
    </>
  );
}
