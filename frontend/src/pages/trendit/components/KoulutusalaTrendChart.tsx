import { ChartRoot, ChartTooltip, useChart } from "@chakra-ui/charts";
import { Skeleton } from "@chakra-ui/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import type { TrendPoint } from "../hooks/useKoulutusalaTrends";

const fmt = new Intl.NumberFormat("fi-FI");

interface Props {
  chartData: TrendPoint[];
  isLoading: boolean;
}

export default function KoulutusalaTrendChart({ chartData, isLoading }: Props) {
  const chart = useChart({
    data: chartData,
    series: [{ name: "total", color: "oklch(0.71 0.098 101)" }],
  });

  if (isLoading) return <Skeleton height="150px" borderRadius="md" />;

  return (
    <ChartRoot chart={chart} h="150px">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chart.data} margin={{ top: 10, right: 8, left: 16 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--chakra-colors-border-subtle)" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tickFormatter={(v) => fmt.format(v)} tick={{ fontSize: 11 }} width={32} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            type="linear"
            dataKey="total"
            stroke={chart.color("oklch(0.71 0.098 101)")}
            strokeWidth={2}
            dot={{ r: 2, fill: chart.color("oklch(0.71 0.098 101)") }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartRoot>
  );
}
