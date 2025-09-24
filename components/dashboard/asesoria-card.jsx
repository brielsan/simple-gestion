"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Target } from "lucide-react";
import { useAdvice } from "@/hooks/use-advice";
import { formatDate } from "@/utils/formats";

export default function AsesoriaCard({ title }) {
  const { data, error, isLoading } = useAdvice();

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-sm font-medium">AsesorIA</CardTitle>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            Tips of the day {formatDate(data?.createdAt)}
          </p>
        </div>
        <Bot className="h-4 w-4 text-purple-600" />
      </CardHeader>
      {!isLoading && (
        <CardContent>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
            {data?.advice}
          </p>{" "}
        </CardContent>
      )}
    </Card>
  );
}
