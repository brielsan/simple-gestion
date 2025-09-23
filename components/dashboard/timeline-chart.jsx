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
    <Card>
      <CardHeader>
        <CardTitle>Timeline</CardTitle>
        <CardDescription>Timeline of your movements</CardDescription>
      </CardHeader>
      <CardContent>
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
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis padding={{ top: 15 }} />
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
