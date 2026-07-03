import type { ReactNode } from "react";
import { Badge, Card, HStack, Heading, Separator, Stack, Stat, VStack } from "@chakra-ui/react";
import type { StatisticsEntry } from "@/types.gen";
import { getTier } from "@/components/hakijapaineTier";
import { HiOutlineArrowCircleDown, HiOutlineArrowCircleUp } from "react-icons/hi";

interface ComparisonTableProps {
  a: StatisticsEntry;
  b: StatisticsEntry;
}

type Trend = "up" | "down" | undefined;

const formatCount = (n: number) => (n < 5 ? "alle 5" : String(n));

const hakijapaine = (e: StatisticsEntry) => (e.aloituspaikatLkm ? e.ensisijaisetHakijatLkm / e.aloituspaikatLkm : null);

const paineTrend = (value: number | null, other: number | null): Trend =>
  value == null || other == null || value === other ? undefined : value > other ? "up" : "down";

// masked values ("alle 5") are not comparable, so those get no trend arrow
const countTrend = (value: number, other: number): Trend =>
  value < 5 || other < 5 ? undefined : paineTrend(value, other);

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

function StatCard({ label, value, trend }: { label: string; value: ReactNode; trend?: Trend }) {
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
      </Card.Body>
    </Card.Root>
  );
}

function PressureCard({ paine, trend }: { paine: number | null; trend: Trend }) {
  const tier = paine != null ? getTier(paine) : null;
  return (
    <Card.Root size="sm" flex={1} minW={0}>
      <Card.Body>
        <VStack alignItems="start">
          <Stat.Root size="sm">
            <Stat.Label fontSize="xs" color="fg.muted">
              Hakijapaine
            </Stat.Label>
            <HStack gap={1}>
              <Stat.ValueText fontSize={{ base: "sm", md: "xl" }}>
                {paine != null ? paine.toFixed(2) : "n/a"}
              </Stat.ValueText>
              <TrendIcon trend={trend} />
            </HStack>
          </Stat.Root>
          {tier ? (
            <Badge
              bg={tier.bg}
              color={tier.color}
              fontWeight="semibold"
              alignSelf="flex-start"
              size={{ base: "xs", md: "md" }}
            >
              {tier.label}
            </Badge>
          ) : null}
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}

export default function ComparisonTable({ a, b }: ComparisonTableProps) {
  const paineA = hakijapaine(a);
  const paineB = hakijapaine(b);

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
      <PairRow
        left={
          <StatCard
            label="Kaikki hakijat"
            value={formatCount(a.kaikkiHakijatLkm)}
            trend={countTrend(a.kaikkiHakijatLkm, b.kaikkiHakijatLkm)}
          />
        }
        right={
          <StatCard
            label="Kaikki hakijat"
            value={formatCount(b.kaikkiHakijatLkm)}
            trend={countTrend(b.kaikkiHakijatLkm, a.kaikkiHakijatLkm)}
          />
        }
      />
      <PairRow
        left={
          <StatCard
            label="Ensisijaiset hakijat"
            value={formatCount(a.ensisijaisetHakijatLkm)}
            trend={countTrend(a.ensisijaisetHakijatLkm, b.ensisijaisetHakijatLkm)}
          />
        }
        right={
          <StatCard
            label="Ensisijaiset hakijat"
            value={formatCount(b.ensisijaisetHakijatLkm)}
            trend={countTrend(b.ensisijaisetHakijatLkm, a.ensisijaisetHakijatLkm)}
          />
        }
      />
      <PairRow
        left={
          <StatCard
            label="Aloituspaikat"
            value={formatCount(a.aloituspaikatLkm)}
            trend={countTrend(a.aloituspaikatLkm, b.aloituspaikatLkm)}
          />
        }
        right={
          <StatCard
            label="Aloituspaikat"
            value={formatCount(b.aloituspaikatLkm)}
            trend={countTrend(b.aloituspaikatLkm, a.aloituspaikatLkm)}
          />
        }
      />
      <PairRow
        left={<PressureCard paine={paineA} trend={paineTrend(paineA, paineB)} />}
        right={<PressureCard paine={paineB} trend={paineTrend(paineB, paineA)} />}
      />
    </Stack>
  );
}
