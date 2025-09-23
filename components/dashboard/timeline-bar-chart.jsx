"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function TimelineBarChart({ data, color }) {
  const chartData = data
    .map((item) => ({
      month: new Date(item.month).toLocaleDateString("en-US", {
        month: "short",
      }),
      amount: parseFloat(item.total_amount) || 0,
      movements: parseInt(item.movement_count) || 0,
    }))
    .reverse();

  const chartConfig = {
    amount: {
      label: "Amount",
      color: color,
    },
  };

  // Calcular el porcentaje de crecimiento
  const calculateGrowth = () => {
    if (chartData.length < 2) return 0;
    const current = chartData[0].amount;
    const previous = chartData[1].amount;
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const growth = calculateGrowth();

  return (
    <Card className="w-full">
      <CardHeader className="text-center mb-4">
        <CardTitle className="text-base sm:text-lg">
          Timeline {chartData.length === 4 ? "(Last 4 months)" : ""}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Timeline of your movements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 10 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="amount" fill={color} radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={10}
                formatter={(value) => `$${value.toLocaleString()}`}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
