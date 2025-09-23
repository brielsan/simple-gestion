"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TimelineChart({ data, color }) {
  const chartData = data
    .map((item) => ({
      month: new Date(item.month).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      amount: parseFloat(item.total_amount) || 0,
      movements: parseInt(item.movement_count) || 0,
    }))
    .reverse();

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-base sm:text-lg">
          Timeline {chartData.length === 4 ? "(Last 4 months)" : ""}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Timeline of your movements
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="w-full h-[1px] bg-gray-200 my-4" />

        <ChartContainer
          config={{
            month: {
              label: "Month",
            },
            amount: {
              label: `Total Amount: `,
            },
            movements: {
              label: "Number of Movements",
            },
          }}
          className="w-full min-h-[200px] sm:h-[292px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} minTickGap={15} />
              <YAxis padding={{ top: 15 }} tick={{ fontSize: 10 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke={color}
                fill={color}
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
