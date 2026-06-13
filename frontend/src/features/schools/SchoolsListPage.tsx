import { Center, Stack } from "@chakra-ui/react";
import useSchoolsQuery from "./hooks/useSchoolsQuery";
import SchoolCard from "./components/SchoolCard";

export default function SchoolsListPage() {
  const query = useSchoolsQuery();

  if (query.isPending) return <div>loading</div>;
  if (query.isError) return <div>error fetching</div>;

  return (
    <Center h="100%" px={8}>
      <Stack direction="column" gap={4} width="800px" p={2}>
        <Stack direction="column" height="1200px" overflowY="scroll" gap={4} px={4}>
          {query.data.map((k) => (
            <SchoolCard key={k.nimi.fi} school={k} />
          ))}
        </Stack>
      </Stack>
    </Center>
  );
}
