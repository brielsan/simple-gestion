import { prisma } from "@/db/client.js";
import exampleData from "@/lib/exampleData.json";
import { aiService } from "./ai-service.js";

export const mockupService = {
  async toggleTestMode(user, testmode) {
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { testmode: testmode },
      });

      if (testmode) {
        await prisma.movement.deleteMany({
          where: { userId: user.id },
        });

        await prisma.advice.updateMany({
          where: { userId: user.id },
          data: { deleted: true },
        });

        const types = await prisma.type.findMany();
        const categories = await prisma.category.findMany();

        const typeMap = new Map(types.map((t) => [t.name, t.id]));
        const categoryMap = new Map(categories.map((c) => [c.name, c.id]));

        const movementsToCreate = [];

        for (const item of exampleData) {
          if (
            !item?.description ||
            !item?.amount ||
            !item?.category ||
            !item?.type
          ) {
            continue;
          }

          const typeId = typeMap.get(item.type);
          const categoryId = categoryMap.get(item.category);

          if (typeId && categoryId) {
            movementsToCreate.push({
              description: item.description || "Movement without description",
              amount: parseFloat(item.amount) || 0,
              deleted: false,
              userId: user.id,
              categoryId: categoryId,
              typeId: typeId,
              date: item.date ? new Date(item.date) : new Date(),
            });
          }
        }

        const createdMovements = await prisma.movement.createMany({
          data: movementsToCreate,
          skipDuplicates: true,
        });

        await aiService.createAdvice(user, false);

        return {
          success: true,
          data: {
            message: "Test mode enabled successfully",
            movementsCreated: createdMovements.count,
            totalProcessed: exampleData.length,
            user: {
              id: user.id,
              username: user.username,
              testmode: true,
            },
          },
        };
      } else {
        await prisma.movement.deleteMany({
          where: { userId: user.id },
        });

        await prisma.advice.updateMany({
          where: { userId: user.id },
          data: { deleted: true },
        });

        return {
          success: true,
          data: {
            message: "Test mode disabled successfully",
            movementsCreated: 0,
            user: {
              id: user.id,
              username: user.username,
              testmode: false,
            },
          },
        };
      }
    } catch (error) {
      console.error("Error in mockup service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },
};
