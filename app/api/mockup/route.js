import { MockupController } from "@/controllers/mockup-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const POST = withErrorHandling(MockupController.toggleTestMode);
