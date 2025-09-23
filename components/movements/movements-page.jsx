"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useMovements } from "@/hooks/use-movements";
import MovementsFilters from "./movements-filters";
import MovementsList from "./movements-list";
import MovementsPagination from "./movements-pagination";
import MovementsInfo from "./movements-info";

export default function MovementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const { movements, pagination, isLoading, error, mutate } = useMovements({
    page,
    categoryId: selectedCategory,
    typeId: selectedType,
    dateFrom,
    dateTo,
  });

  const goToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= pagination.totalPages) {
      setPage(pageNum);
    }
  };

  const applyFilters = () => {
    setPage(1);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedType("all");
    setDateFrom(null);
    setDateTo(null);
    setPage(1);
    setShowFilters(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-2">Error loading data</p>
          <button
            onClick={() => mutate()}
            className="text-blue-600 hover:underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <MovementsFilters
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      <MovementsInfo
        movementsCount={movements.length}
        totalMovements={pagination.totalMovements}
        selectedCategory={selectedCategory}
        selectedType={selectedType}
        dateFrom={dateFrom}
        dateTo={dateTo}
      />

      <MovementsList movements={movements} />

      <MovementsPagination
        currentPage={page}
        totalPages={pagination.totalPages}
        hasPrevPage={pagination.hasPrevPage}
        hasNextPage={pagination.hasNextPage}
        goToPage={goToPage}
      />
    </div>
  );
}
