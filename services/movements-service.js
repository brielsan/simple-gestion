import { prisma } from "@/db/client.js";

export const movementsService = {
  async getMovements(userId, filters) {
    try {
      const { page, limit, categoryId, typeId, dateFrom, dateTo } = filters;
      const skip = (page - 1) * limit;

      const where = {
        userId,
        deleted: false,
      };

      if (categoryId && categoryId !== "all") {
        where.categoryId = { equals: categoryId };
      }

      if (typeId && typeId !== "all") {
        where.typeId = { equals: typeId };
      }

      if (dateFrom || dateTo) {
        where.createdAt = {};
        if (dateFrom) {
          where.createdAt.gte = new Date(dateFrom);
        }
        if (dateTo) {
          const endDate = new Date(dateTo);
          endDate.setHours(23, 59, 59, 999);
          where.createdAt.lte = endDate;
        }
      }

      const [movements, totalMovements] = await Promise.all([
        prisma.movement.findMany({
          where,
          include: {
            category: true,
            type: true,
          },
          orderBy: {
            createdAt: "desc",
          },
          skip,
          take: limit,
        }),
        prisma.movement.count({ where }),
      ]);

      const totalPages = Math.ceil(totalMovements / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;

      return {
        success: true,
        data: {
          movements,
          pagination: {
            currentPage: page,
            totalPages,
            totalMovements,
            hasNextPage,
            hasPrevPage,
            limit,
          },
        },
      };
    } catch (error) {
      console.error("Error in getMovements service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async createMovement(userId, movementData) {
    try {
      const { description, amount, categoryId, typeId } = movementData;

      const movement = await prisma.movement.create({
        data: {
          description,
          amount,
          categoryId,
          typeId,
          userId,
        },
        include: {
          category: true,
          type: true,
        },
      });

      return {
        success: true,
        data: movement,
      };
    } catch (error) {
      console.error("Error in createMovement service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async updateMovement(userId, movementId, movementData) {
    try {
      const { description, amount, categoryId, typeId } = movementData;

      const existingMovement = await prisma.movement.findFirst({
        where: {
          id: movementId,
          userId,
          deleted: false,
        },
      });

      if (!existingMovement) {
        return {
          success: false,
          message: "Movement not found",
          status: 404,
        };
      }

      const movement = await prisma.movement.update({
        where: { id: movementId },
        data: {
          description,
          amount,
          categoryId,
          typeId,
        },
        include: {
          category: true,
          type: true,
        },
      });

      return {
        success: true,
        data: movement,
      };
    } catch (error) {
      console.error("Error in updateMovement service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async deleteMovement(userId, movementId) {
    try {
      const existingMovement = await prisma.movement.findFirst({
        where: {
          id: movementId,
          userId,
          deleted: false,
        },
      });

      if (!existingMovement) {
        return {
          success: false,
          message: "Movement not found",
          status: 404,
        };
      }

      await prisma.movement.update({
        where: { id: movementId },
        data: { deleted: true },
      });

      return {
        success: true,
        message: "Movement deleted successfully",
      };
    } catch (error) {
      console.error("Error in deleteMovement service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async getFilters() {
    try {
      const [categories, types] = await Promise.all([
        prisma.category.findMany({
          orderBy: { name: "asc" },
        }),
        prisma.type.findMany({
          orderBy: { name: "asc" },
        }),
      ]);

      return {
        success: true,
        data: {
          categories,
          types,
        },
      };
    } catch (error) {
      console.error("Error in getFilters service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },
};
