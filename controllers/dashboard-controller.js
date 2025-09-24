import { NextResponse } from "next/server";
import { dashboardService } from "@/services/dashboard-service.js";
import { getCurrentUser } from "@/lib/auth.js";

export const DashboardController = {
  async getStats() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await dashboardService.getStats(user.id);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in getting stats:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
};
