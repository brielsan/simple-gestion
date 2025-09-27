import { DashboardController } from "@/controllers/dashboard-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const GET = withErrorHandling(DashboardController.getTimelineStats);
