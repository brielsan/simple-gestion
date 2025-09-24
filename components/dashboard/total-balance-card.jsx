"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/utils/formats";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function TotalBalanceCard({
  total,
  incomes,
  expenses,
  description,
}) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Financial Overview
        </CardTitle>
        <DollarSign className="h-4 w-4 text-gray-600" />
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {formatMoney(total)}
          </div>
          <p className="text-sm text-gray-600">Total Balance</p>
        </div>

        <div className="flex gap-4 flex-wrap">
          <div className="bg-green-50 rounded-lg p-4 border border-green-200 w-[45%] min-w-[150px] flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Incomes
              </span>
            </div>
            <div className="text-xl font-bold text-green-700">
              {formatMoney(incomes)}
            </div>
          </div>

          <div className="bg-red-50 rounded-lg p-4 border border-red-200 w-[45%] min-w-[150px] flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingDown className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Expenses</span>
            </div>
            <div className="text-xl font-bold text-red-700">
              {formatMoney(Math.abs(expenses))}
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">{description}</p>
      </CardContent>
    </Card>
  );
}
