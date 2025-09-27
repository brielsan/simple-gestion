import { TrendingDown } from "lucide-react";
import { Button } from "./button";

export const ExpenseButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white cursor-pointer"
    >
      <TrendingDown className="h-4 w-4" />
      New Expense
    </Button>
  );
};
