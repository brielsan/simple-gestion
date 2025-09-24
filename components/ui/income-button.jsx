import { TrendingUp } from "lucide-react";
import { Button } from "./button";

export const IncomeButton = ({ onClick }) => {
  return (
    <Button
      onClick={onClick}
      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
    >
      <TrendingUp className="h-4 w-4" />
      New Income
    </Button>
  );
};
