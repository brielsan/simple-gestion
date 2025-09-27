"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatMoney } from "@/utils/formats";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { memo, useMemo } from "react";
import Loader from "../ui/loader";

const AmountCard = memo(({ amount, type, Icon, color }) => {
  return (
    <div
      className={`bg-${color}-50 rounded-lg p-4 border border-${color}-200 w-[45%] min-w-[190px] flex-1`}
    >
      <div className="flex items-center space-x-2 mb-2">
        {Icon}
        <span className={`text-sm font-medium text-${color}-800`}>{type}</span>
      </div>
      <div className={`text-xl font-bold text-${color}-700`}>
        {formatMoney(amount)}
      </div>
    </div>
  );
});

const TotalBalanceCard = memo(
  ({ total, incomes, expenses, description, loading }) => {
    return (
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Financial Overview
          </CardTitle>
          <DollarSign className="h-4 w-4 text-gray-600" />
        </CardHeader>
        {loading ? (
          <Loader />
        ) : (
          <CardContent>
            <div className="mb-6">
              <div className="text-3xl font-bold text-gray-900 mb-1">
                {formatMoney(total)}
              </div>
              <p className="text-sm text-gray-600">Total Balance</p>
            </div>

            <div className="flex gap-4 flex-wrap">
              <AmountCard
                amount={incomes}
                type="Incomes"
                Icon={<TrendingUp className={`h-4 w-4 text-green-600`} />}
                color="green"
              />
              <AmountCard
                amount={expenses}
                type="Expenses"
                Icon={<TrendingDown className={`h-4 w-4 text-red-600`} />}
                color="red"
              />
            </div>

            <p className="text-xs text-muted-foreground mt-4">{description}</p>
          </CardContent>
        )}
      </Card>
    );
  }
);

export default TotalBalanceCard;
