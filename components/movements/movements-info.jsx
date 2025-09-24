"use client";

import { Badge } from "@/components/ui/badge";
import { useParameters } from "@/contexts/parameters-context";
import { formatCapitalize } from "@/utils/formats";

export default function MovementsInfo({
  movementsCount,
  totalMovements,
  selectedCategory,
  selectedType,
  dateFrom,
  dateTo,
}) {
  const { categories, types } = useParameters();
  const hasActiveFilters =
    selectedCategory !== "all" || selectedType !== "all" || dateFrom || dateTo;

  return (
    <div className="flex items-center justify-between">
      {hasActiveFilters && (
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary">
              {formatCapitalize(
                categories.find((c) => c.id === selectedCategory)?.name
              )}
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary">
              {formatCapitalize(types.find((t) => t.id === selectedType)?.name)}
            </Badge>
          )}
          {dateFrom && (
            <Badge variant="secondary">
              From: {dateFrom.toLocaleDateString("en-US")}
            </Badge>
          )}
          {dateTo && (
            <Badge variant="secondary">
              To: {dateTo.toLocaleDateString("en-US")}
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
