import { Stack, HStack, Pagination, IconButton, Center, Box, NativeSelect } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import { useMemo, useState } from "react";
import type { DegreeData } from "../questionnaire/types/degree";
import degreeDataJson from "../questionnaire/questions.json";
import SchoolCard from "../questionnaire/SchoolCard";

const degreeData: DegreeData[] = degreeDataJson;
const PAGE_SIZE = 10;

type SortOption = "" | "tutkinto" | "koulu" | "hakijamäärä_eniten" | "hakijamäärä_vähiten";

export default function DegreeListPage() {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>("tutkinto");

  const sortedData = useMemo(() => {
    const data = [...degreeData];

    if (sortBy === "tutkinto") {
      return data.sort((a, b) => a.hakukohde.localeCompare(b.hakukohde, "fi", { sensitivity: "base" }));
    }

    if (sortBy === "koulu") {
      return data.sort((a, b) => a.korkeakoulu.localeCompare(b.korkeakoulu, "fi", { sensitivity: "base" }));
    }

    if (sortBy === "hakijamäärä_eniten") {
      return data.sort((a, b) => {
        const aValue = a.kaikkiHakijatLkm ?? -Infinity;
        const bValue = b.kaikkiHakijatLkm ?? -Infinity;
        return bValue - aValue;
      });
    }

    if (sortBy === "hakijamäärä_vähiten") {
      return data.sort((a, b) => {
        const aValue = a.kaikkiHakijatLkm ?? Infinity;
        const bValue = b.kaikkiHakijatLkm ?? Infinity;
        return aValue - bValue;
      });
    }

    return data;
  }, [sortBy]);

  const start = (page - 1) * PAGE_SIZE;
  const paginated = sortedData.slice(start, start + PAGE_SIZE);

  const sortingMenu = (
    <Stack>
      <Box width="fit-content">
        <NativeSelect.Root>
          <NativeSelect.Field
            value={sortBy}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => {
              setSortBy(e.target.value as SortOption);
              setPage(1);
            }}
          >
            <option value="tutkinto">Tutkinto</option>
            <option value="koulu">Koulu</option>
            <option value="hakijamäärä_eniten">Eniten hakijoita</option>
            <option value="hakijamäärä_vähiten">Vähiten hakijoita</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Box>
    </Stack>
  );

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={4} border="1px solid red">
        {sortingMenu}
        <Stack direction="column" height="1200px" overflowY="scroll" gap={4}>
          {paginated.map((d, index) => (
            <SchoolCard degree={d} key={`${d.hakukohde}, ${index}`} />
          ))}
        </Stack>

        <Pagination.Root
          count={degreeData.length}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack justify="center">
            <Pagination.Items
              render={(page) => <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>}
            />
          </HStack>
        </Pagination.Root>
      </Stack>
    </Center>
  );
}
