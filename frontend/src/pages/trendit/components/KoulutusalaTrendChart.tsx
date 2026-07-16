import { ChartRoot, ChartTooltip, useChart } from "@chakra-ui/charts";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { numberFormat } from "@/components/hakijapaineTier";
import type { TrendPoint } from "../+data";

interface KoulutusalaTrendChartProps {
  chartData: TrendPoint[];
  color: string;
}

export default function KoulutusalaTrendChart({ chartData, color }: KoulutusalaTrendChartProps) {
  const chart = useChart({
    data: chartData,
    series: [{ name: "total", color }],
  });

  return (
    <ChartRoot chart={chart} h="150px">
      <LineChart
        data={chart.data}
        margin={{ top: 10, right: 8, left: 16 }}
        responsive
        style={{ height: "100%", width: "100%" }}
      >
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
    </ChartRoot>
  );
}
