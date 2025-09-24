import { prisma } from "@/db/client.js";

export const dashboardService = {
  async getStats(userId) {
    try {
      const [totalIncome, totalExpenses, categoryData, monthlyStats] =
        await Promise.all([
          prisma.movement.aggregate({
            where: {
              userId,
              deleted: false,
              amount: { gt: 0 },
            },
            _sum: { amount: true },
          }),

          prisma.movement.aggregate({
            where: {
              userId,
              deleted: false,
              amount: { lt: 0 },
            },
            _sum: { amount: true },
          }),

          prisma.$queryRaw`
            SELECT 
              c.name as category,
              SUM(m.amount)::NUMERIC as amount,
              COUNT(m.id)::INTEGER as count
            FROM movements m
            INNER JOIN categories c ON m."categoryId" = c.id
            WHERE m."userId" = ${userId} AND m.deleted = false AND m.amount < 0
            GROUP BY c.id, c.name
            ORDER BY amount ASC
            LIMIT 10
          `,

          prisma.$queryRaw`
            SELECT 
              DATE_TRUNC('month', "createdAt") as month,
              SUM(amount)::numeric as total_amount,
              COUNT(*)::integer as movement_count
            FROM movements 
            WHERE "userId" = ${userId} AND deleted = false
            GROUP BY DATE_TRUNC('month', "createdAt")
            ORDER BY month DESC
            LIMIT 4
          `,
        ]);

      return {
        success: true,
        data: {
          totalIncome: totalIncome._sum.amount || 0,
          totalExpenses: Math.abs(totalExpenses._sum.amount || 0),
          categoryData,
          monthlyStats,
        },
      };
    } catch (error) {
      console.error("Error en getStats service:", error);
      return {
        success: false,
        message: "Error interno del servidor",
        status: 500,
      };
    }
  },
};
