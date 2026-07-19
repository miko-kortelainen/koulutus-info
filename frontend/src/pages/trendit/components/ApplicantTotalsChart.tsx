import { ChartRoot, ChartTooltip, useChart } from "@chakra-ui/charts";
import { Box, VisuallyHidden } from "@chakra-ui/react";
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts";
import { numberFormat } from "@/components/hakijapaineTier";
import type { TrendPoint } from "../+data";

interface ApplicantTotalsChartProps {
  chartData: TrendPoint[];
  color: string;
  title: string;
}

export default function ApplicantTotalsChart({ chartData, color, title }: ApplicantTotalsChartProps) {
  const chart = useChart({
    data: chartData,
    series: [{ name: "total", color }],
  });

  return (
    <Box aria-label={title} as="figure">
      <ChartRoot chart={chart} h="150px">
        <LineChart
          aria-label={title}
          data={chart.data}
          margin={{ top: 10, right: 8, left: 16 }}
          responsive
          role="img"
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
      <VisuallyHidden as="figcaption">
        {title}: {chartData.map(({ year, total }) => `${year} ${numberFormat.format(total)}`).join(", ")}
      </VisuallyHidden>
    </Box>
  );
}
