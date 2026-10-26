import { Box, Card, Link, Stack, Text } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import SearchInput from "@/components/SearchInput";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import useDebounce from "@/hooks/useDebounce";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import { slugify } from "@/lib/slug";
import type { LukioKunta } from "@/pages/lukiot/kaupungit/+data";

const PAGE_SIZE = 20;

export default function LukiotKaupungitPage() {
  const kunnat = useData<LukioKunta[]>();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const search = useDebounce(searchTerm, 200).trim();
  const filtered = useMemo(
    () =>
      search
        ? new Fuse(kunnat, { keys: ["nimi"], threshold: 0.2, ignoreLocation: true })
            .search(search)
            .map(({ item }) => item)
        : kunnat,
    [kunnat, search],
  );
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  return (
    <>
      <PageIntro
        description={`Valitse kunta ja katso lukioiden keskiarvorajat ${LUKIO_KESKIARVOT_YEAR}.`}
        title="Lukiot kunnittain"
      />
      <PageContainer align="flex-start">
        <SearchInput
          onChange={(value) => {
            setSearchTerm(value);
            setPage(1);
          }}
          placeholder="Hae kuntaa"
          value={searchTerm}
        />
        <Stack as="ul" gap={2} listStyleType="none" width="full">
          {paginated.length === 0 ? <Text as="li">Ei tuloksia haulle.</Text> : null}
          {paginated.map((kunta) => (
            <Box as="li" key={kunta.nimi}>
              <Card.Root asChild size="sm">
                <Link
                  _hover={{ textDecoration: "none" }}
                  aria-label={kunta.nimi}
                  href={`/lukiot/kaupungit/${slugify(kunta.nimi)}/`}
                >
                  <Card.Body width="full">
                    <Text fontSize="md" fontWeight="semibold">
                      {kunta.nimi}
                    </Text>
                    <Text color="fg.muted">
                      {kunta.lukioidenMaara} {kunta.lukioidenMaara === 1 ? "lukio" : "lukiota"}
                    </Text>
                  </Card.Body>
                </Link>
              </Card.Root>
            </Box>
          ))}
        </Stack>
        <Pagination count={filtered.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
      </PageContainer>
    </>
  );
}
