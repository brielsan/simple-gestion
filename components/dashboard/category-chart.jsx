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
  const chartData = (data || [])
    .map((item, index) => ({
      category: item.category,
      amount: Math.abs(item.amount),
      fill: `var(--chart-${(index % 5) + 1})`,
    }))
    ?.slice(0, 10);

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
      <CardHeader className="items-center pb-0 text-center">
        <CardTitle className="text-base sm:text-lg">
          Expenses by Category {chartData.length === 10 ? "(Top 10)" : ""}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Distribution of expenses by category
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        <div className="w-full h-[1px] bg-gray-200 mt-4 mb-2" />
        <ChartContainer
          config={chartConfig}
          className="w-full max-w-full mx-auto min-h-[300px] max-h-[200px] sm:max-h-[300px]"
        >
          <PieChart>
            <Pie data={chartData} dataKey="amount" />
            <ChartTooltip
              content={<ChartTooltipContent nameKey="category" />}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="category" />}
              className="mt-1 flex flex-wrap gap-2 justify-center *:basis-1/2 sm:*:basis-1/6"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
