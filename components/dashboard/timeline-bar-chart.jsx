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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import TimelineTabs from "../ui/timeline-tabs";
import { formatTimelineDate } from "@/utils/formats";
import { memo, useMemo } from "react";
import { TrendingUp } from "lucide-react";

const TimelineBarChart = memo(
  ({ data, color, period = "months", onPeriodChange, isLoading }) => {
    const chartData = useMemo(() => {
      return data
        .map((item) => ({
          period: formatTimelineDate(
            item.month || item.week || item.day,
            period
          ),
          amount: parseFloat(item.total_amount) || 0,
          movements: parseInt(item.movement_count) || 0,
        }))
        .reverse();
    }, [data, period]);

    const chartConfig = {
      amount: {
        label: "Amount",
        color: color,
      },
    };

    return (
      <Card className="w-full">
        <CardHeader className="mb-4">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
              <CardDescription className="text-sm sm:text-base min-w-[200px]">
                Timeline of your balance
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              <TimelineTabs
                activeTab={period}
                onTabChange={onPeriodChange}
                disabled={!chartData || chartData.length === 0}
              />
            </div>
          </div>
        </CardHeader>
        {(!chartData || chartData.length === 0) && !isLoading ? (
          <CardContent className="pt-0 flex items-center justify-center min-h-[292px]">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm">No data available for analysis</p>
              <p className="text-xs text-gray-400 mt-1">
                Come back when you have saved some data
              </p>
            </div>
          </CardContent>
        ) : (
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
                  dataKey="period"
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
        )}
      </Card>
    );
  }
);

export default TimelineBarChart;
