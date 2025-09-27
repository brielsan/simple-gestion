import { AiController } from "@/controllers/ai-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const POST = withErrorHandling((req, res) =>
  AiController.createAdvice(req, res, false)
);
