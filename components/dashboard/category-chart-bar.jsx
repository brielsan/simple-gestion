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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
} from "recharts";
import { memo, useMemo } from "react";
import { BarChart3 } from "lucide-react";

const CategoryBarChart = memo(({ data }) => {
  const chartData = useMemo(
    () =>
      (data || [])
        .map((item, index) => ({
          ...item,
          amount: Math.abs(Number(item.amount)),
          fill: `var(--chart-${(index % 5) + 1})`,
        }))
        ?.slice(0, 5),
    [data]
  );

  const chartConfig = {
    ...chartData.reduce((acc, item, index) => {
      acc[item.category.toLowerCase().replace(/\s+/g, "_")] = {
        label: item.category,
        color: `var(--chart-${(index % 5) + 1})`,
      };
      return acc;
    }, {}),
    amount: { label: "Amount" },
    category: { label: "Category" },
  };

  return (
    <Card className="w-full h-[450px]">
      <CardHeader className="text-center">
        <CardTitle className="text-base sm:text-lg">
          Expenses by Category {chartData.length === 5 ? "(Top 5)" : ""}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Distribution of expenses by category
        </CardDescription>
      </CardHeader>

      {!chartData || chartData.length === 0 ? (
        <CardContent className="pt-0 flex items-center justify-center min-h-[300px]">
          <div className="text-center text-gray-500">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-sm">No data available for analysis</p>
            <p className="text-xs text-gray-400 mt-1">
              Come back when you have saved some data
            </p>
          </div>
        </CardContent>
      ) : (
        <CardContent className="pt-0">
          <div className="w-full h-[1px] bg-gray-200 my-4" />

          <ChartContainer config={chartConfig} className="w-full px-2">
            <div className="sm:min-w-0 h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  layout="vertical"
                  margin={{ top: 0, bottom: 0, left: 10, right: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />

                  <YAxis
                    dataKey="category"
                    type="category"
                    tick={{ fontSize: 13 }}
                    tickFormatter={(val) =>
                      val.charAt(0).toUpperCase() + val.slice(1)
                    }
                    axisLine={true}
                    tickLine={false}
                  />

                  <XAxis
                    type="number"
                    tick={{ fontSize: 12 }}
                    axisLine={true}
                    width={"30%"}
                  />

                  <ChartTooltip
                    content={<ChartTooltipContent nameKey="category" />}
                  />

                  <Bar
                    dataKey="amount"
                    radius={4}
                    barSize={24}
                    isAnimationActive={false}
                  >
                    <LabelList
                      dataKey="amount"
                      position="right"
                      className="fill-foreground"
                      fontSize={12}
                      formatter={(value) =>
                        value > 999 ? `${(value / 1000).toFixed(1)}k` : value
                      }
                    />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartContainer>
        </CardContent>
      )}
    </Card>
  );
});

export default CategoryBarChart;
