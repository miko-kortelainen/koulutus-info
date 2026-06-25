import { ChartRoot, ChartTooltip, ChartLegend, useChart } from "@chakra-ui/charts";
import { Skeleton } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import type { TrendPoint } from "../hooks/useKoulutusalaTrends";

const COLORS = ["blue.solid", "green.solid", "orange.solid", "purple.solid", "red.solid"] as const;
const fmt = new Intl.NumberFormat("fi-FI");

interface Props {
  chartData: TrendPoint[];
  topByGrowth: string[];
  isLoading: boolean;
}

export default function KoulutusalaTrendChart({ chartData, topByGrowth, isLoading }: Props) {
  const chart = useChart({
    data: chartData,
    series: topByGrowth.map((name, i) => ({ name, color: COLORS[i] ?? "gray.solid" })),
  });

  if (isLoading) return <Skeleton height="280px" borderRadius="md" />;

  return (
    <ChartRoot chart={chart} h="280px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-border-subtle)" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => fmt.format(v)} tick={{ fontSize: 11 }} width={58} />
          <Tooltip content={<ChartTooltip />} />
          <Legend content={<ChartLegend />} />
          {chart.series.map((s) => (
            <Line
              key={s.name as string}
              type="monotone"
              dataKey={s.name as string}
              stroke={chart.color(s.color)}
              strokeWidth={2}
              dot={{ r: 4, fill: chart.color(s.color) }}
              activeDot={{ r: 6 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartRoot>
  );
}
