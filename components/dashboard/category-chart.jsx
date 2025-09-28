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
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { memo, useMemo } from "react";
import { BarChart3 } from "lucide-react";

const CategoryChart = memo(({ data, isLoading }) => {
  const chartData = useMemo(
    () =>
      (data || [])
        .map((item, index) => ({
          category: item.category,
          amount: Math.abs(Number(item.amount)),
          fill: `var(--chart-${(index % 5) + 1})`,
        }))
        ?.slice(0, 10),
    [data]
  );

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
        <CardTitle className="text-base sm:text-lg md:p-1.5 lg:p-0">
          Expenses by Category {chartData.length >= 10 ? "(Top 10)" : ""}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base md:hidden lg:block">
          Distribution of expenses by category
        </CardDescription>
      </CardHeader>

      {(!chartData || chartData.length === 0) && !isLoading ? (
        <CardContent className="flex-1 pb-0 flex items-center justify-center min-h-[300px]">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">No data available for analysis</p>
            <p className="text-xs text-gray-400 mt-1">
              Come back when you have saved some data
            </p>
          </div>
        </CardContent>
      ) : (
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
      )}
    </Card>
  );
});

export default CategoryChart;
