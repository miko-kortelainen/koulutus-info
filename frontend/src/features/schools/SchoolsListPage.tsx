import { ButtonGroup, Center, HStack, IconButton, Pagination, Stack } from "@chakra-ui/react";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "./components/SchoolCard";
import { useState } from "react";

const PAGE_SIZE = 10;

export default function SchoolsListPage() {
  const [page, setPage] = useState(1);
  const query = useSchoolsQuery();

  if (query.isPending) return <div>loading</div>;
  if (query.isError) return <div>error fetching</div>;

  const toteutukset = query.data.flatMap((k) => k.toteutukset);
  const paginated = toteutukset.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={2}>
        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {paginated.map((t, index) => (
            <SchoolCard key={`${t.toteutusOid} ${t.toteutusNimi} ${index}`} toteutus={t} />
          ))}
        </Stack>

        <Pagination.Root
          count={toteutukset.length}
          pageSize={PAGE_SIZE}
          page={page}
          onPageChange={(e) => setPage(e.page)}
        >
          <HStack justify="center">
            <ButtonGroup variant="ghost">
              <Pagination.Items
                render={(page) => (
                  <IconButton variant={{ base: "ghost", _selected: "outline" }}>{page.value}</IconButton>
                )}
              />
            </ButtonGroup>
          </HStack>
        </Pagination.Root>
      </Stack>
    </Center>
  );
}
