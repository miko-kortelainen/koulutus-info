import { Box, Stack } from "@chakra-ui/react";
import { useState } from "react";
import CutoffCard from "@/components/CutoffCard";
import Pagination from "@/components/Pagination";
import type { AlaProgramme } from "@/pages/pisterajat/@ala/+data";

const PAGE_SIZE = 20;

interface SchoolProgrammeListProps {
  programmes: AlaProgramme[];
  headingLevel?: "h2" | "h3";
  showRound?: boolean;
}

export default function SchoolProgrammeList({ headingLevel, programmes, showRound = false }: SchoolProgrammeListProps) {
  const [page, setPage] = useState(1);
  const paginatedProgrammes = programmes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Stack gap={4} width="full">
      <Stack as="ul" gap={4} listStyleType="none">
        {paginatedProgrammes.map((programme) => (
          <Box as="li" key={`${programme.schoolName}\0${programme.name}`}>
            <CutoffCard
              headingLevel={headingLevel}
              programme={programme}
              schoolName={programme.schoolName}
              showRound={showRound}
            />
          </Box>
        ))}
      </Stack>
      {programmes.length > PAGE_SIZE ? (
        <Pagination count={programmes.length} onPageChange={setPage} page={page} pageSize={PAGE_SIZE} />
      ) : null}
    </Stack>
  );
}
