import { NextResponse } from "next/server";
import { movementsService } from "@/services/movements-service.js";
import { getCurrentUser } from "@/lib/auth.js";

export const MovementsController = {
  async getMovements(request) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const filters = {
        page: parseInt(searchParams.get("page")) || 1,
        limit: parseInt(searchParams.get("limit")) || 20,
        categoryId: searchParams.get("categoryId"),
        typeId: searchParams.get("typeId"),
        dateFrom: searchParams.get("dateFrom"),
        dateTo: searchParams.get("dateTo"),
      };

      const result = await movementsService.getMovements(user.id, filters);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in getting movements:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async getFilters() {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const result = await movementsService.getFilters();

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in getting filters:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async createMovement(request) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const body = await request.json();
      const { description, amount, categoryId, typeId } = body;

      if (!description || !amount || !categoryId || !typeId) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const result = await movementsService.createMovement(user.id, {
        description,
        amount: parseFloat(amount),
        categoryId,
        typeId,
      });

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data, { status: 201 });
    } catch (error) {
      console.error("Error creating movement:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async updateMovement(request) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const movementId = searchParams.get("id");

      if (!movementId) {
        return NextResponse.json(
          { error: "Movement ID is required" },
          { status: 400 }
        );
      }

      const body = await request.json();
      const { description, amount, categoryId, typeId } = body;

      if (!description || !amount || !categoryId || !typeId) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      const result = await movementsService.updateMovement(
        user.id,
        movementId,
        {
          description,
          amount: parseFloat(amount),
          categoryId,
          typeId,
        }
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error updating movement:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async deleteMovement(request) {
    try {
      const user = await getCurrentUser();
      if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { searchParams } = new URL(request.url);
      const movementId = searchParams.get("id");

      if (!movementId) {
        return NextResponse.json(
          { error: "Movement ID is required" },
          { status: 400 }
        );
      }

      const result = await movementsService.deleteMovement(user.id, movementId);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json({ message: result.message });
    } catch (error) {
      console.error("Error deleting movement:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },
};
