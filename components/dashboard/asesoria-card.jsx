"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, RefreshCw } from "lucide-react";
import { useAdvice } from "@/hooks/use-advice";
import { formatDate } from "@/utils/formats";
import Loader from "../ui/loader";
import { adviceService } from "@/services/client/advice-service";

export default function AsesoriaCard({ disableRefresh = false }) {
  const { data, error, isLoading, mutate } = useAdvice();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshError(null);

    try {
      await adviceService.createNewAdvice();
      mutate();
    } catch (error) {
      setRefreshError(error.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isLimitReached = useMemo(
    () => (data?.remainingAdvices || 0) <= 0,
    [data]
  );

  const noData = useMemo(
    () => !isLoading && data?.advice?.includes("No data available yet"),
    [isLoading, data]
  );

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-wrap gap-2">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-sm font-medium flex items-center gap-1">
            AsesorIA <Bot className="h-4 w-4" />
          </CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            Tips of the day {data?.createdAt ? formatDate(data?.createdAt) : ""}
          </p>
        </div>
        {!isLoading && !disableRefresh && (
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              {" "}
              <span
                className={`text-xs ${
                  isLimitReached ? "text-red-500" : "text-muted-foreground"
                }`}
              >
                You have {data?.remainingAdvices || 0} advices remaining
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing || isLimitReached || disableRefresh}
                className="h-8 w-8 p-0 cursor-pointer"
                title={
                  isLimitReached
                    ? "You have reached the limit of 5 advices per day. Try again tomorrow."
                    : "Generate new advice"
                }
              >
                <RefreshCw
                  className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      {isLoading ? (
        <Loader />
      ) : (
        <CardContent>
          {refreshError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
              {refreshError}
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data?.advice}
          </p>
        </CardContent>
      )}
    </Card>
  );
}
