import { NextResponse } from "next/server";
import { mockupService } from "@/services/api/mockup-service.js";
import { getCurrentUser } from "@/lib/auth.js";

export const MockupController = {
  async toggleTestMode(request) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { testmode } = body;

      if (testmode === undefined) {
        return NextResponse.json(
          { error: "testmode parameter is required" },
          { status: 400 }
        );
      }

      const result = await mockupService.toggleTestMode(user, testmode);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in mockup controller:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
};
