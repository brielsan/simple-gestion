"use client";

import React, { useState } from "react";
import { Loader2, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { useMovements } from "@/hooks/use-movements";
import { movementCrudService } from "@/services/client/movement-crud-service";
import { Button } from "@/components/ui/button";
import MovementsFilters from "./movements-filters";
import MovementsList from "./movements-list";
import MovementsPagination from "./movements-pagination";
import MovementsInfo from "./movements-info";
import MovementModal from "./movement-modal";
import { mutate as mutateGeneral } from "swr";
import { IncomeButton } from "../ui/income-button";
import { ExpenseButton } from "../ui/expense-button";

export default function MovementsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [preSelectedType, setPreSelectedType] = useState(null);

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

  const refreshData = () => {
    mutate();
    mutateGeneral("/api/dashboard/stats");
  };

  const handleCreateMovement = async (movementData) => {
    try {
      await movementCrudService.createMovement(movementData);
      refreshData();
    } catch (error) {
      console.error("Error creating movement:", error);
      alert("Error creating movement: " + error.message);
    }
  };

  const handleEditMovement = async (movementId, movementData) => {
    try {
      await movementCrudService.updateMovement(movementId, movementData);
      refreshData();
    } catch (error) {
      console.error("Error updating movement:", error);
      alert("Error updating movement: " + error.message);
    }
  };

  const handleDeleteMovement = async (movementId) => {
    try {
      if (confirm("Are you sure you want to delete this movement?")) {
        await movementCrudService.deleteMovement(movementId);
      }
      refreshData();
    } catch (error) {
      console.error("Error deleting movement:", error);
      alert("Error deleting movement: " + error.message);
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
      <div className="flex justify-between items-center flex-wrap gap-2">
        <p className="text-gray-600">
          Manage and filter all your financial movements
        </p>
        <div className="flex gap-2">
          <IncomeButton onClick={() => openCreateModal("income")} />
          <ExpenseButton onClick={() => openCreateModal("expense")} />
        </div>
      </div>

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

      <MovementsList
        movements={movements}
        onEdit={openEditModal}
        onDelete={handleDeleteMovement}
      />

      <MovementsPagination
        currentPage={page}
        totalPages={pagination.totalPages}
        hasPrevPage={pagination.hasPrevPage}
        hasNextPage={pagination.hasNextPage}
        goToPage={goToPage}
      />

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
