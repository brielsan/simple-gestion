"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Edit, Trash2, ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { useParameters } from "@/hooks/use-parameters";
import { Confirm } from "@/utils/alerts";
import { formatCapitalize } from "@/utils/formats";
import toast from "react-hot-toast";

export default function MovementModal({
  onClose,
  onSave,
  movement = null,
  onEdit = null,
  onDelete = null,
  preSelectedType = null,
}) {
  const { categories, types, isLoading: parametersLoading } = useParameters();

  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    categoryId: "",
    typeId: "",
    date: new Date(),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = !!movement;
  const initializedRef = useRef(false);

  const findTypeByName = useCallback(
    (typeName) => {
      if (!types?.length || !typeName) return null;
      return types.find((t) =>
        t.name.toLowerCase().includes(typeName.toLowerCase())
      );
    },
    [types]
  );

  const selectedType = useMemo(() => {
    if (!formData.typeId || !types?.length) return null;
    return types.find((t) => t.id === formData.typeId);
  }, [formData.typeId, types]);

  const isIncome = useMemo(() => {
    return selectedType?.name?.toLowerCase().includes("income") ?? false;
  }, [selectedType]);

  const preselectedTypeId = useMemo(() => {
    if (!preSelectedType || !types?.length) return null;
    return findTypeByName(preSelectedType)?.id;
  }, [preSelectedType, findTypeByName, types]);

  useEffect(() => {
    if (initializedRef.current) return;

    if (movement) {
      const displayAmount = Math.abs(movement.amount || 0).toString();
      setFormData({
        description: movement.description || "",
        amount: displayAmount,
        categoryId: movement.categoryId || "",
        typeId: movement.typeId || "",
        date: movement.date ? new Date(movement.date) : new Date(),
      });
    } else if (preSelectedType && preselectedTypeId) {
      setFormData((prev) => ({
        ...prev,
        typeId: preselectedTypeId,
      }));
    }

    setErrors({});
    initializedRef.current = true;
  }, [movement, preSelectedType, preselectedTypeId]);

  useEffect(() => {
    if (!initializedRef.current || !preSelectedType || !preselectedTypeId)
      return;

    setFormData((prev) => {
      if (prev.typeId) return prev;
      return {
        ...prev,
        typeId: preselectedTypeId,
      };
    });
  }, [preSelectedType, preselectedTypeId]);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.amount || isNaN(parseFloat(formData.amount))) {
      newErrors.amount = "Valid amount is required";
    }

    if (!formData.categoryId) {
      newErrors.categoryId = "Category is required";
    }

    if (!formData.typeId) {
      newErrors.typeId = "Type is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!validateForm()) return;

      setIsLoading(true);

      try {
        let finalAmount = parseFloat(formData.amount);

        if (!isIncome && !isEdit) {
          finalAmount = -Math.abs(finalAmount);
        } else if (!isIncome && isEdit) {
          finalAmount = movement.amount;
        } else if (isIncome) {
          finalAmount = Math.abs(finalAmount);
        }

        const year = formData.date.getFullYear();
        const month = String(formData.date.getMonth() + 1).padStart(2, "0");
        const day = String(formData.date.getDate()).padStart(2, "0");
        const dateString = `${year}-${month}-${day}`;

        const movementData = {
          ...formData,
          amount: finalAmount,
          date: dateString,
        };

        if (isEdit) {
          await onEdit(movement.id, movementData);
          toast.success("Movement updated successfully!", {
            position: "bottom-center",
          });
        } else {
          await onSave(movementData);
          toast.success("Movement created successfully! ", {
            position: "bottom-center",
          });
        }

        onClose();
      } catch (error) {
        console.error("Error saving movement:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [isIncome, isEdit, movement, onSave, onEdit, formData]
  );

  const handleDelete = useCallback(async () => {
    if (!movement || !onDelete) return;

    if (
      await Confirm(
        "Delete Movement",
        "Are you sure you want to delete this movement?",
        "warning"
      )
    ) {
      setIsLoading(true);
      try {
        await onDelete(movement.id);
        onClose();
      } catch (error) {
        console.error("Error deleting movement:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [movement, onDelete]);

  const theme = useMemo(() => {
    if (isIncome) {
      return {
        border: "border-green-200",
        focus: "focus:border-green-500 focus:ring-green-500/20",
        button: "bg-green-600 hover:bg-green-700 text-white",
        header: "text-green-700",
      };
    } else {
      return {
        border: "border-red-200",
        focus: "focus:border-red-500 focus:ring-red-500/20",
        button: "bg-red-600 hover:bg-red-700 text-white",
        header: "text-red-700",
      };
    }
  }, [isIncome]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <Card className="relative z-50 w-full max-w-md mx-4">
        <CardHeader className="flex flex-row items-center justify-between position-relative">
          <CardTitle
            className={`flex items-center justify-center gap-2 ${theme.header} w-full pb-3`}
          >
            {isEdit ? (
              <>
                <Edit className="h-5 w-5" />
                Edit Movement
              </>
            ) : (
              <>{isIncome ? "New Income" : "New Expense"}</>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 absolute right-5"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date
                </label>
                <DatePicker
                  date={formData.date}
                  setDate={(date) =>
                    setFormData((prev) => ({
                      ...prev,
                      date: date || new Date(),
                    }))
                  }
                  placeholder="Select date"
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-700"
                >
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    max="999999999.99"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        amount: e.target.value,
                      }))
                    }
                    placeholder="0.00"
                    className={`pl-8 ${theme.border} ${theme.focus} h-[38px]`}
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-600">{errors.amount}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <Input
                id="description"
                maxLength={500}
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter movement description"
                className={`${theme.border} ${theme.focus}`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-700"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="category"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: e.target.value,
                    }))
                  }
                  className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 appearance-none bg-white ${theme.border} ${theme.focus}`}
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {formatCapitalize(category.name)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              </div>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId}</p>
              )}
            </div>
            {!preSelectedType && (
              <div className="space-y-2">
                <label
                  htmlFor="type"
                  className="block text-sm font-medium text-gray-700"
                >
                  Type
                </label>
                <div className="relative">
                  <select
                    id="type"
                    value={formData.typeId}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        typeId: e.target.value,
                      }))
                    }
                    disabled={!!preSelectedType && !movement}
                    className={`w-full px-3 py-2 pr-8 border rounded-md focus:outline-none focus:ring-2 appearance-none bg-white ${
                      theme.border
                    } ${theme.focus} ${
                      !!preSelectedType && !movement
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    <option value="">Select type</option>
                    {types.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                {errors.typeId && (
                  <p className="text-sm text-red-600">{errors.typeId}</p>
                )}
              </div>
            )}

            <div className="flex gap-2 pt-4 flex-wrap-reverse">
              {isEdit && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className={`${theme.button} flex items-center gap-2 flex-1`}
              >
                {isLoading
                  ? "Saving..."
                  : isEdit
                  ? "Update Movement"
                  : "Create Movement"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
