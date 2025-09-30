import { prisma } from "@/db/client.js";
import { Prisma } from "@prisma/client";

export const dashboardService = {
  async getStats(userId) {
    try {
      const [totalIncome, totalExpenses, categoryData] = await Promise.all([
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
      ]);

      return {
        success: true,
        data: {
          totalIncome: totalIncome._sum.amount || 0,
          totalExpenses: Math.abs(totalExpenses._sum.amount || 0),
          categoryData,
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

  async getTimelineStats(userId, period) {
    try {
      let query;

      switch (period) {
        case "weeks":
          query = prisma.$queryRaw(Prisma.sql`
            SELECT 
              DATE_TRUNC('week', "date") as week,
              SUM(amount)::numeric as total_amount,
              COUNT(*)::integer as movement_count
            FROM movements 
            WHERE "userId" = ${userId} AND deleted = false AND "date" >= NOW() - INTERVAL '4 weeks'
            GROUP BY DATE_TRUNC('week', "date")
            ORDER BY week DESC
            LIMIT 4
          `);
          break;
        case "days":
          query = prisma.$queryRaw(Prisma.sql`
            SELECT 
              DATE_TRUNC('day', "date") as day,
              SUM(amount)::numeric as total_amount,
              COUNT(*)::integer as movement_count
            FROM movements 
            WHERE "userId" = ${userId} AND deleted = false AND "date" >= NOW() - INTERVAL '7 days'
            GROUP BY DATE_TRUNC('day', "date")
            ORDER BY day DESC
            LIMIT 7
          `);
          break;
        default: // months
          query = prisma.$queryRaw(Prisma.sql`
            SELECT 
              DATE_TRUNC('month', "date") as month,
              SUM(amount)::numeric as total_amount,
              COUNT(*)::integer as movement_count
            FROM movements 
            WHERE "userId" = ${userId} AND deleted = false AND "date" >= NOW() - INTERVAL '4 months'
            GROUP BY DATE_TRUNC('month', "date")
            ORDER BY month DESC
            LIMIT 4
          `);
      }

      const data = await query;

      console.log(data, "DATA");

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Error en getTimelineStats service:", error);
      return {
        success: false,
        message: "Error interno del servidor",
        status: 500,
      };
    }
  },
};
