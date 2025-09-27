import { NextResponse } from "next/server";
import { aiService } from "@/services/api/ai-service.js";
import { getCurrentUser } from "@/lib/auth.js";

export const AiController = {
  async getAdvice() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await aiService.getAdvice(user);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in getting advice:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async createAdvice(req, res, isSystemGenerated = false) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await aiService.createAdvice(user, isSystemGenerated);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in creating advice:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
};
