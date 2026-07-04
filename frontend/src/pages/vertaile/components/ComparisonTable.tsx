import type { ReactNode } from "react";
import { Badge, Card, HStack, Heading, Separator, Stack, Stat } from "@chakra-ui/react";
import type { StatisticsEntry } from "@/types.gen";
import { formatCount, getHakijapaine, getTier } from "@/components/hakijapaineTier";
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";

interface ComparisonTableProps {
  a: StatisticsEntry;
  b: StatisticsEntry;
}

type Trend = "up" | "down" | undefined;

const paineTrend = (value: number | null, other: number | null): Trend =>
  value == null || other == null || value === other ? undefined : value > other ? "up" : "down";

// masked values ("alle 5") are not comparable, so those get no trend arrow
const countTrend = (value: number, other: number): Trend =>
  value < 5 || other < 5 ? undefined : paineTrend(value, other);

const COUNT_ROWS = [
  ["Kaikki hakijat", "kaikkiHakijatLkm"],
  ["Ensisijaiset hakijat", "ensisijaisetHakijatLkm"],
  ["Aloituspaikat", "aloituspaikatLkm"],
] as const;

function TrendIcon({ trend }: { trend: Trend }) {
  if (!trend) return null;
  return trend === "up" ? (
    <HiOutlineArrowCircleUp color="var(--chakra-colors-green-fg)" />
  ) : (
    <HiOutlineArrowCircleDown color="var(--chakra-colors-red-fg)" />
  );
}

// each pair renders in its own flex row, so align-items: stretch keeps the two cards equal height
function PairRow({ left, right }: { left: ReactNode; right: ReactNode }) {
  return (
    <Stack direction="row" gap={3}>
      {left}
      <Separator orientation="vertical" />
      {right}
    </Stack>
  );
}

function StatCard({ label, value, trend, badge }: { label: string; value: ReactNode; trend?: Trend; badge?: ReactNode }) {
  return (
    <Card.Root size="sm" flex={1} minW={0}>
      <Card.Body>
        <Stat.Root size="sm">
          <Stat.Label fontSize="xs" color="fg.muted">
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
      bg={tier.bg}
      color={tier.color}
      fontWeight="semibold"
      alignSelf="flex-start"
      size={{ base: "xs", md: "md" }}
      mt={2}
    >
      {tier.label}
    </Badge>
  ) : null;
}

export default function ComparisonTable({ a, b }: ComparisonTableProps) {
  const paineA = getHakijapaine(a);
  const paineB = getHakijapaine(b);

  return (
    <Stack gap={4}>
      <PairRow
        left={
          <Heading as="h2" size="sm" textWrap="pretty" flex={1} minW={0}>
            {a.hakukohde}
          </Heading>
        }
        right={
          <Heading as="h2" size="sm" textWrap="pretty" flex={1} minW={0}>
            {b.hakukohde}
          </Heading>
        }
      />
      <PairRow
        left={<StatCard label="Korkeakoulu" value={a.korkeakoulu ?? "-"} />}
        right={<StatCard label="Korkeakoulu" value={b.korkeakoulu ?? "-"} />}
      />
      {COUNT_ROWS.map(([label, field]) => (
        <PairRow
          key={field}
          left={<StatCard label={label} value={formatCount(a[field])} trend={countTrend(a[field], b[field])} />}
          right={<StatCard label={label} value={formatCount(b[field])} trend={countTrend(b[field], a[field])} />}
        />
      ))}
      <PairRow
        left={
          <StatCard
            label="Hakijapaine"
            value={paineA != null ? paineA.toFixed(2) : "n/a"}
            trend={paineTrend(paineA, paineB)}
            badge={paineBadge(paineA)}
          />
        }
        right={
          <StatCard
            label="Hakijapaine"
            value={paineB != null ? paineB.toFixed(2) : "n/a"}
            trend={paineTrend(paineB, paineA)}
            badge={paineBadge(paineB)}
          />
        }
      />
    </Stack>
  );
}
