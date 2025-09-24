"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/utils/formats";

export default function CardDashboard({
  title,
  amount,
  description,
  icon: Icon,
  color = "text-gray-600",
  incomes,
  expenses,
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${color}`} />
      </CardHeader>
      <CardContent>
        {incomes !== undefined && expenses !== undefined ? (
          <div className="space-y-3">
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-gray-600">Incomes</div>
              <div className="text-xl font-bold text-green-600">
                {formatMoney(incomes)}
              </div>
            </div>
            <div className="flex flex-col space-y-1">
              <div className="text-sm text-gray-600">Expenses</div>
              <div className="text-xl font-bold text-red-600">
                {formatMoney(expenses)}
              </div>
            </div>
          </div>
        ) : (
          <div className={`text-2xl font-bold ${color}`}>
            {formatMoney(amount)}
          </div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
