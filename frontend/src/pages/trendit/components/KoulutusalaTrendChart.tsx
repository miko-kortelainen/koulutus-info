import { ChartRoot, ChartTooltip, useChart } from "@chakra-ui/charts";
import { Skeleton } from "@chakra-ui/react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { numberFormat } from "@/components/hakijapaineTier";
import type { TrendPoint } from "../hooks/useKoulutusalaTrends";

interface KoulutusalaTrendChartProps {
  chartData: TrendPoint[];
  isLoading: boolean;
  color: string;
}

export default function KoulutusalaTrendChart({ chartData, isLoading, color }: KoulutusalaTrendChartProps) {
  const chart = useChart({
    data: chartData,
    series: [{ name: "total", color }],
  });

  if (isLoading) return <Skeleton borderRadius="md" height="150px" />;

  return (
    <ChartRoot chart={chart} h="150px">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={chart.data} margin={{ top: 10, right: 8, left: 16 }}>
          <CartesianGrid stroke="var(--chakra-colors-border-subtle)" strokeDasharray="3 3" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => numberFormat.format(v)} width={32} />
          <Tooltip content={<ChartTooltip />} />
          <Line
            activeDot={{ r: 6 }}
            dataKey="total"
            dot={{ r: 2, fill: chart.color(color) }}
            stroke={chart.color(color)}
            strokeWidth={2}
            type="linear"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartRoot>
  );
}
