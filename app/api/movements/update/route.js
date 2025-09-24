import { MovementsController } from "@/controllers/movements-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const PUT = withErrorHandling(MovementsController.updateMovement);
