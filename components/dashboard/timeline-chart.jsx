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
import TimelineTabs from "../ui/timeline-tabs";
import { formatTimelineDate } from "@/utils/formats";
import { memo, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp } from "lucide-react";

const TimelineChart = memo(
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

    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex justify-between items-start sm:items-center gap-4 flex-wrap">
            <div className="flex-1">
              <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
              <CardDescription className="text-sm sm:text-base md:hidden lg:block">
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

        {!chartData || chartData.length === 0 ? (
          <CardContent className="pt-0 flex items-center justify-center min-h-[299px]">
            <div className="text-center text-gray-500">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p className="text-sm">No data available for analysis</p>
              <p className="text-xs text-gray-400 mt-1">
                Come back when you have saved some data
              </p>
            </div>
          </CardContent>
        ) : (
          <CardContent className="pt-0">
            <div className="w-full h-[1px] bg-gray-200 my-4" />

            <ChartContainer
              config={{
                period: {
                  label: "Period",
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
                  <XAxis
                    dataKey="period"
                    tick={{ fontSize: 10 }}
                    minTickGap={15}
                  />
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
        )}
      </Card>
    );
  }
);

export default TimelineChart;
