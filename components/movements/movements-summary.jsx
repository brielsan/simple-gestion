"use client";

import { formatMoney } from "@/utils/formats";

export default function MovementsSummary({
  totalAmount,
  totalMovements,
  hasFilters,
}) {
  return (
    <div className="flex items-center justify-between pt-3">
      <div className="flex items-center space-x-2">
        <p className="text-gray-700">
          Found {totalMovements} movements
          {hasFilters && (
            <span className="text-sm text-gray-500 italic ml-1">
              (with filters applied)
            </span>
          )}
        </p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">
          Total Balance
          {hasFilters && (
            <span className="text-xs text-gray-500 italic ml-1">
              (with filters applied)
            </span>
          )}
        </p>
        <p
          className={`text-xl font-bold ${
            totalAmount >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {formatMoney(totalAmount)}
        </p>
      </div>
    </div>
  );
}
