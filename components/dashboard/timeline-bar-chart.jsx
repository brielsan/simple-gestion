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

const TimelineBarChart = memo(
  ({ data, color, period = "months", onPeriodChange }) => {
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
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Timeline of your balance
              </CardDescription>
            </div>
            <div className="flex-shrink-0">
              <TimelineTabs activeTab={period} onTabChange={onPeriodChange} />
            </div>
          </div>
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
      </Card>
    );
  }
);

export default TimelineBarChart;
