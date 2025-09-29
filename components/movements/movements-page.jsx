"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useMovements } from "@/hooks/use-movements";
import { movementCrudService } from "@/services/client/movement-crud-service";
import MovementsFilters from "./movements-filters";
import MovementsPagination from "./movements-pagination";
import MovementsInfo from "./movements-info";
import MovementsSummary from "./movements-summary";
import MovementModal from "./movement-modal";
import { mutate as mutateGeneral } from "swr";
import { IncomeButton } from "../ui/income-button";
import { ExpenseButton } from "../ui/expense-button";
import dynamic from "next/dynamic";
import Loader from "../ui/loader";
import { Alert, Confirm } from "@/utils/alerts";

const MovementsList = dynamic(() => import("./movements-list"), {
  ssr: false,
  loading: () => <Loader />,
});

export default function MovementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [description, setDescription] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [preSelectedType, setPreSelectedType] = useState(null);

  const { movements, pagination, totalAmount, isLoading, error, mutate } =
    useMovements({
      page,
      categoryId: selectedCategory,
      typeId: selectedType,
      dateFrom,
      dateTo,
      description,
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
    setDescription("");
    setPage(1);
    setShowFilters(false);
  };

  const refreshData = () => {
    mutate();

    mutateGeneral("/api/dashboard/stats");
    mutateGeneral((key) => {
      if (Array.isArray(key)) {
        return key?.[0]?.startsWith("/api/dashboard/timeline");
      }
      return key?.startsWith("/api/dashboard/timeline") && key;
    });
    mutateGeneral("/api/ai/advice");
    mutateGeneral((key) => {
      if (Array.isArray(key)) {
        return key?.[0]?.startsWith("/api/movements");
      }
      return key?.startsWith("/api/movements") && key;
    });
  };

  const handleCreateMovement = async (movementData) => {
    try {
      await movementCrudService.createMovement(movementData);
      refreshData();
    } catch (error) {
      console.error("Error creating movement:", error);

      Alert("Error", "Error creating movement: " + error.message, "error");
    }
  };

  const handleEditMovement = async (movementId, movementData) => {
    try {
      await movementCrudService.updateMovement(movementId, movementData);
      refreshData();
    } catch (error) {
      console.error("Error updating movement:", error);
      Alert("Error", "Error updating movement: " + error.message, "error");
    }
  };

  const handleDeleteMovement = async (movementId) => {
    try {
      if (
        await Confirm(
          "Delete Movement",
          "Are you sure you want to delete this movement?",
          "warning"
        )
      ) {
        await movementCrudService.deleteMovement(movementId);
      }
      refreshData();
    } catch (error) {
      console.error("Error deleting movement:", error);
      Alert("Error", "Error deleting movement: " + error.message, "error");
    }
  };

  const openCreateModal = (typeName = null) => {
    setEditingMovement(null);
    setPreSelectedType(typeName);
    setShowModal(true);
  };

  const openEditModal = (movement) => {
    setEditingMovement(movement);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingMovement(null);
    setPreSelectedType(null);
  };

  const hasFilters = useMemo(() => {
    selectedCategory !== "all" ||
      selectedType !== "all" ||
      dateFrom !== null ||
      dateTo !== null ||
      (description && description.trim() !== "");
  }, [selectedCategory, selectedType, dateFrom, dateTo, description]);

  const hasPagination = useMemo(() => {
    return pagination.totalPages > 1;
  }, [pagination.totalPages]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedType, dateFrom, dateTo, description]);

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
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-gray-600">
          Manage and filter all your financial movements
        </p>
        <div className="flex gap-2 flex-wrap">
          <IncomeButton onClick={() => openCreateModal("income")} />
          <ExpenseButton onClick={() => openCreateModal("expense")} />
        </div>
      </div>

      {!(!hasFilters && !totalAmount) && (
        <MovementsFilters
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          description={description}
          setDescription={setDescription}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          applyFilters={applyFilters}
          clearFilters={clearFilters}
        />
      )}

      {!isLoading && !error && (
        <MovementsSummary
          totalAmount={totalAmount}
          totalMovements={pagination.totalMovements}
          hasFilters={hasFilters}
        />
      )}

      <MovementsInfo
        movementsCount={movements.length}
        totalMovements={pagination.totalMovements}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        dateFrom={dateFrom}
        setDateFrom={setDateFrom}
        dateTo={dateTo}
        setDateTo={setDateTo}
        description={description}
        setDescription={setDescription}
      />

      <MovementsList
        movements={movements}
        isLoading={isLoading}
        onEdit={openEditModal}
        onDelete={handleDeleteMovement}
      />

      {hasPagination && (
        <MovementsPagination
          currentPage={page}
          totalPages={pagination.totalPages}
          hasPrevPage={pagination.hasPrevPage}
          hasNextPage={pagination.hasNextPage}
          goToPage={goToPage}
        />
      )}

      <MovementModal
        isOpen={showModal}
        onClose={closeModal}
        onSave={handleCreateMovement}
        onEdit={handleEditMovement}
        onDelete={handleDeleteMovement}
        movement={editingMovement}
        preSelectedType={preSelectedType}
      />
    </div>
  );
}
