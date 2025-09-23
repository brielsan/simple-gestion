"use client";

import { Pie, PieChart } from "recharts";
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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function CategoryChart({ data }) {
  const chartData = data.map((item, index) => ({
    category: item.category,
    amount: Math.abs(item.amount),
    fill: `var(--chart-${(index % 5) + 1})`,
  }));

  const chartConfig = {
    amount: {
      label: "Amount",
    },
    category: {
      label: "Category",
    },
    value: {
      label: "Amount",
    },
    ...chartData.reduce((config, item, index) => {
      config[item.category.toLowerCase().replace(/\s+/g, "_")] = {
        label: item.category,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return config;
    }, {}),
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Distribution of expenses by category</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <div className="w-full h-[1px] bg-gray-200 mt-4" />
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="amount" />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="category" />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
