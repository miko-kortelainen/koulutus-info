import { Heading, Link, Separator, Stack, Tabs, Text } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useData } from "vike-react/useData";
import Pagination from "@/components/Pagination";
import { slugifySchoolName } from "@/components/slug";
import PageContainer from "@/layout/PageContainer";
import { COLORS } from "@/theme";
import type { Programme as CutoffProgramme } from "@/types/pisterajat.gen";
import type { CutoffPageData } from "./+data";
import CutoffCard from "./components/CutoffCard";

const pageSize = 5;

export default function CutoffPage() {
  const { schoolName, programmes } = useData<CutoffPageData>();
  const [pages, setPages] = useState<Record<string, number>>({});
  const selectionMethodGroups = useMemo(() => {
    const groups = new Map<string, CutoffProgramme[]>();

    for (const programme of programmes) {
      for (const selectionMethod of programme.selectionMethods) {
        const groupedProgrammes = groups.get(selectionMethod.name) ?? [];
        groupedProgrammes.push({ ...programme, selectionMethods: [selectionMethod] });
        groups.set(selectionMethod.name, groupedProgrammes);
      }
    }

    return [...groups.entries()];
  }, [programmes]);

  const programmeList = (selectionMethodName: string, selectionMethodProgrammes: CutoffProgramme[]) => {
    const page = pages[selectionMethodName] ?? 1;
    const visibleProgrammes = selectionMethodProgrammes.slice((page - 1) * pageSize, page * pageSize);

    return (
      <Stack gap={4}>
        {visibleProgrammes.map((programme) => (
          <CutoffCard key={programme.name} programme={programme} />
        ))}
        <Pagination
          count={selectionMethodProgrammes.length}
          onPageChange={(nextPage) =>
            setPages((previousPages) => ({ ...previousPages, [selectionMethodName]: nextPage }))
          }
          page={page}
          pageSize={pageSize}
        />
      </Stack>
    );
  };

  const programmeContent =
    selectionMethodGroups.length > 1 ? (
      <Tabs.Root defaultValue={selectionMethodGroups[0][0]} size="sm">
        <Tabs.List>
          {selectionMethodGroups.map(([name]) => (
            <Tabs.Trigger
              flex={1}
              fontWeight="semibold"
              justifyContent="center"
              key={name}
              letterSpacing="wide"
              value={name}
            >
              {name}
            </Tabs.Trigger>
          ))}
          <Tabs.Indicator bg={COLORS.surfaceMuted} />
        </Tabs.List>
        {selectionMethodGroups.map(([name, methodProgrammes]) => (
          <Tabs.Content key={name} value={name}>
            {programmeList(name, methodProgrammes)}
          </Tabs.Content>
        ))}
      </Tabs.Root>
    ) : selectionMethodGroups[0] ? (
      programmeList(selectionMethodGroups[0][0], selectionMethodGroups[0][1])
    ) : null;

  return (
    <PageContainer>
      <Stack gap={1}>
        <Link
          alignSelf="flex-start"
          fontSize="sm"
          href={`/koulut/${slugifySchoolName(schoolName)}/`}
          textDecoration="underline"
          textDecorationColor={COLORS.accent}
          textDecorationStyle="dotted"
        >
          ← Takaisin koulun sivulle
        </Link>
        <Heading as="h1" size="md">
          Pisterajat: {schoolName}
        </Heading>
        <Text color="fg.muted" fontSize="sm" textWrap="pretty">
          Ohjelmakohtaiset pisterajat valintatavoittain.
        </Text>
        <Separator mt={2} />
      </Stack>

      {programmeContent}
    </PageContainer>
  );
}
