import { useData } from "vike-react/useData";
import { LUKIO_KESKIARVOT_YEAR } from "@/config/lukioKeskiarvot";
import PageContainer from "@/layout/PageContainer";
import PageIntro from "@/layout/PageIntro";
import type { LukioSchoolPageData } from "@/pages/lukiot/@slug/+data";
import LukioSchoolCard from "@/pages/lukiot/components/LukioSchoolCard";

export default function LukioSchoolPage() {
  const { schoolName, entries } = useData<LukioSchoolPageData>();
  const kunta = entries[0]?.kunta;

  return (
    <>
      <PageIntro
        description={
          <>
            {schoolName}
            {kunta ? ` (${kunta})` : ""} – yhteishaun keskiarvorajat ja pisterajat {LUKIO_KESKIARVOT_YEAR}.
            <br />
            Yleislinjan pisteraja vastaa lukuaineiden keskiarvoa.
            <br />
            Erityislinjojen pisteytyksessä on yleensä mukana myös lisänäyttö, pääsykoe tai painotettu arvosana.
          </>
        }
        title={`${schoolName} keskiarvot ${LUKIO_KESKIARVOT_YEAR}`}
      />
      <PageContainer align="flex-start">
        <LukioSchoolCard entries={entries} koulu={schoolName} />
      </PageContainer>
    </>
  );
}
