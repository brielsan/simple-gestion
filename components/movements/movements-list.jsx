"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { formatCapitalize, formatDate, formatMoney } from "@/utils/formats";

export default function MovementsList({
  movements,
  isLoading,
  onEdit,
  onDelete,
}) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (movements.length === 0) {
    return (
      <Card>
        <CardContent className="p-0">
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg mb-2">No movements found</p>
            <p className="text-sm">
              Try adjusting your filters to see more results
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="space-y-0">
          {movements.map((movement) => (
            <div
              key={movement.id}
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors flex-wrap"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline">
                    {formatCapitalize(movement.category.name)}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={
                      "text-white " +
                      (movement.type.name === "income"
                        ? "bg-green-600"
                        : "bg-red-600")
                    }
                  >
                    {formatCapitalize(movement.type.name)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{movement.description}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(movement.date)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <p
                    className={`font-semibold ${
                      movement.amount >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {formatMoney(movement.amount)}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit && onEdit(movement)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete && onDelete(movement.id)}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
