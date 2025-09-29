"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParameters } from "@/hooks/use-parameters";
import { formatCapitalize } from "@/utils/formats";
import { X } from "lucide-react";
import { useMemo } from "react";

export default function MovementsInfo({
  selectedCategory,
  setSelectedCategory,
  selectedType,
  setSelectedType,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  description,
  setDescription,
}) {
  const { categories, types } = useParameters();
  const hasActiveFilters = useMemo(() => {
    selectedCategory !== "all" ||
      selectedType !== "all" ||
      dateFrom ||
      dateTo ||
      (description && description.trim() !== "");
  }, [selectedCategory, selectedType, dateFrom, dateTo, description]);

  return (
    <div className="flex items-center justify-between">
      {hasActiveFilters && (
        <div className="flex items-center space-x-2 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedCategory !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {formatCapitalize(
                  categories.find((c) => c.id === selectedCategory)?.name
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setSelectedCategory("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {selectedType !== "all" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>
                {formatCapitalize(
                  types.find((t) => t.id === selectedType)?.name
                )}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setSelectedType("all")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {dateFrom && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>From: {dateFrom.toLocaleDateString("en-US")}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setDateFrom(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {dateTo && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>To: {dateTo.toLocaleDateString("en-US")}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setDateTo(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {description && description.trim() !== "" && (
            <Badge variant="secondary" className="flex items-center space-x-1">
              <span>Search: "{description}"</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => setDescription("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
