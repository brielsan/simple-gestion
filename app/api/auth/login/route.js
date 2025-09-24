import { AuthController } from "@/controllers/auth-controller.js";
import { withErrorHandling } from "@/lib/error-handler.js";

export const POST = withErrorHandling(AuthController.login);
