"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatMoney } from "@/utils/formats";

export default function MovementsList({ movements }) {
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
              className="flex items-center justify-between p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <Badge variant="outline">{movement.category.name}</Badge>
                  <Badge variant="secondary">{movement.type.name}</Badge>
                </div>
                <p className="text-sm text-gray-600">{movement.description}</p>
                <p className="text-xs text-gray-400">
                  {formatDate(movement.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`font-semibold ${
                    movement.amount >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {formatMoney(movement.amount)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
