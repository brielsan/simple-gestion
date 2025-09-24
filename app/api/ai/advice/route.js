import { AiController } from "@/controllers/ai-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const GET = withErrorHandling(AiController.getAdvice);
