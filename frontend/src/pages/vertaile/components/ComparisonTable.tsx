import { Badge, Card, Heading, HStack, Stat, Table } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";
import {
  formatCount,
  formatSisaanpaasyprosentti,
  getHakijapaine,
  getSisaanpaasyprosentti,
  getTier,
  ratioFormat,
} from "@/components/hakijapaineTier";
import type { StatisticsEntry } from "@/types.gen";

interface ComparisonTableProps {
  a: StatisticsEntry;
  b: StatisticsEntry;
}

type Trend = "up" | "down" | undefined;

const valueTrend = (value: number | null, other: number | null): Trend =>
  value == null || other == null || value === other ? undefined : value > other ? "up" : "down";

// masked values ("alle 5") are not comparable, so those get no trend arrow
const countTrend = (value: number, other: number): Trend =>
  value < 5 || other < 5 ? undefined : valueTrend(value, other);

const COUNT_ROWS = [
  ["Kaikki hakijat", "kaikkiHakijatLkm"],
  ["Ensisijaiset hakijat", "ensisijaisetHakijatLkm"],
  ["Aloituspaikat", "aloituspaikatLkm"],
] as const;

function TrendIcon({ trend }: { trend: Trend }) {
  if (!trend) return null;
  return (
    <span aria-label={trend === "up" ? "Suurempi arvo" : "Pienempi arvo"} role="img">
      {trend === "up" ? (
        <HiOutlineArrowCircleUp color="var(--chakra-colors-green-fg)" />
      ) : (
        <HiOutlineArrowCircleDown color="var(--chakra-colors-red-fg)" />
      )}
    </span>
  );
}

function PairRow({ left, right, header = false }: { left: ReactNode; right: ReactNode; header?: boolean }) {
  if (header) {
    return (
      <Table.Row>
        <Table.ColumnHeader borderColor="border" borderRightWidth="1px" p={0} pr={2}>
          {left}
        </Table.ColumnHeader>
        <Table.ColumnHeader p={0} pl={2}>
          {right}
        </Table.ColumnHeader>
      </Table.Row>
    );
  }

  // A definite cell height lets the cards stretch to the tallest card in the table row.
  return (
    <Table.Row>
      <Table.Cell borderBottom={0} borderColor="border" borderRightWidth="1px" height="1px" p={0} pr={2} pt={4}>
        {left}
      </Table.Cell>
      <Table.Cell borderBottom={0} height="1px" p={0} pl={2} pt={4}>
        {right}
      </Table.Cell>
    </Table.Row>
  );
}

function StatCard({
  label,
  value,
  trend,
  badge,
}: {
  label: string;
  value: ReactNode;
  trend?: Trend;
  badge?: ReactNode;
}) {
  return (
    <Card.Root flex={1} height="full" minW={0} size="sm">
      <Card.Body>
        <Stat.Root size="sm">
          <Stat.Label color="fg.muted" fontSize="xs">
            {label}
          </Stat.Label>
          <HStack gap={1}>
            <Stat.ValueText fontSize={{ base: "sm", md: "xl" }}>{value}</Stat.ValueText>
            <TrendIcon trend={trend} />
          </HStack>
        </Stat.Root>
        {badge}
      </Card.Body>
    </Card.Root>
  );
}

function paineBadge(paine: number | null) {
  const tier = paine != null ? getTier(paine) : null;
  return tier ? (
    <Badge
      alignSelf="flex-start"
      bg={tier.bg}
      color={tier.color}
      fontWeight="semibold"
      mt={2}
      size={{ base: "xs", md: "md" }}
    >
      {tier.label}
    </Badge>
  ) : null;
}

export default function ComparisonTable({ a, b }: ComparisonTableProps) {
  const sisaanpaasyprosenttiA = getSisaanpaasyprosentti(a.valitutLkm, a.kaikkiHakijatLkm);
  const sisaanpaasyprosenttiB = getSisaanpaasyprosentti(b.valitutLkm, b.kaikkiHakijatLkm);
  const paineA = getHakijapaine(a);
  const paineB = getHakijapaine(b);

  return (
    <Table.Root aria-label="Hakukohteiden vertailu" tableLayout="fixed" variant="line">
      <Table.Header>
        <PairRow
          header
          left={
            <Heading as="h2" size="sm" textWrap="pretty">
              {a.hakukohde}
            </Heading>
          }
          right={
            <Heading as="h2" size="sm" textWrap="pretty">
              {b.hakukohde}
            </Heading>
          }
        />
      </Table.Header>
      <Table.Body>
        <PairRow
          left={<StatCard label="Korkeakoulu" value={a.korkeakoulu ?? "-"} />}
          right={<StatCard label="Korkeakoulu" value={b.korkeakoulu ?? "-"} />}
        />
        <PairRow
          left={
            <StatCard
              label="Sisäänpääsyprosentti"
              trend={valueTrend(sisaanpaasyprosenttiA, sisaanpaasyprosenttiB)}
              value={formatSisaanpaasyprosentti(a.valitutLkm, a.kaikkiHakijatLkm)}
            />
          }
          right={
            <StatCard
              label="Sisäänpääsyprosentti"
              trend={valueTrend(sisaanpaasyprosenttiB, sisaanpaasyprosenttiA)}
              value={formatSisaanpaasyprosentti(b.valitutLkm, b.kaikkiHakijatLkm)}
            />
          }
        />
        {COUNT_ROWS.map(([label, field]) => (
          <PairRow
            key={field}
            left={<StatCard label={label} trend={countTrend(a[field], b[field])} value={formatCount(a[field])} />}
            right={<StatCard label={label} trend={countTrend(b[field], a[field])} value={formatCount(b[field])} />}
          />
        ))}
        <PairRow
          left={
            <StatCard
              badge={paineBadge(paineA)}
              label="Hakijapaine"
              trend={valueTrend(paineA, paineB)}
              value={paineA != null ? ratioFormat.format(paineA) : "–"}
            />
          }
          right={
            <StatCard
              badge={paineBadge(paineB)}
              label="Hakijapaine"
              trend={valueTrend(paineB, paineA)}
              value={paineB != null ? ratioFormat.format(paineB) : "–"}
            />
          }
        />
      </Table.Body>
    </Table.Root>
  );
}
