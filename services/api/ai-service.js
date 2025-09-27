import { prisma } from "@/db/client.js";

export const aiService = {
  async getAdvice(user) {
    try {
      const userId = user.id;
      const lastAdvice = await prisma.advice.findFirst({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      if (lastAdvice) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const todayAdvicesCount = await prisma.advice.count({
          where: {
            userId,
            createdAt: {
              gte: today,
              lt: tomorrow,
            },
          },
        });

        return {
          success: true,
          data: {
            advice: lastAdvice.content,
            createdAt: lastAdvice.createdAt,
            remainingAdvices: Math.max(0, 5 - todayAdvicesCount),
          },
        };
      }

      const createResult = await this.createAdvice(user);
      return createResult;
    } catch (error) {
      console.error("Error in getAdvice service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async createAdvice(user) {
    const userId = user.id;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayAdvicesCount = await prisma.advice.count({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (todayAdvicesCount >= 5) {
        return {
          success: false,
          message:
            "You have reached the limit of 5 advices per day. Try again tomorrow.",
          status: 429,
        };
      }
      const totalIncome = await prisma.movement.aggregate({
        where: { userId, deleted: false, amount: { gt: 0 } },
        _sum: { amount: true },
      });

      const totalExpenses = await prisma.movement.aggregate({
        where: { userId, deleted: false, amount: { lt: 0 } },
        _sum: { amount: true },
      });

      const categoryData = await prisma.$queryRaw`
        SELECT 
          c.name as category,
          SUM(m.amount)::numeric as amount,
          COUNT(m.id)::integer as count
        FROM movements m
        INNER JOIN categories c ON m."categoryId" = c.id
        WHERE m."userId" = ${userId} AND m.deleted = false AND m.amount < 0
        GROUP BY c.id, c.name
        ORDER BY amount ASC
      `;

      const recentMovements = await prisma.movement.findMany({
        where: { userId, deleted: false },
        orderBy: { createdAt: "desc" },
        take: 30,
        select: { description: true, amount: true, createdAt: true },
      });

      const monthlyStats = await prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', "createdAt") as month,
          SUM(amount)::numeric as total_amount,
          COUNT(*)::integer as movement_count
        FROM movements 
        WHERE "userId" = ${userId} AND deleted = false
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 3
      `;

      const prompt = `
You are a personal financial advisor from the "Simple gestión" website.
The username is "${user.username}".
Analyze the data provided and generate exactly 4 short, clear, and practical pieces of advice.
Each piece of advice must start with the symbol "*" and be on its own line (with line breaks).
Do not include any introduction or summary, only the 4 lines of advice.

User data:
- Total income: ${totalIncome._sum.amount || 0}
- Total spent: ${totalExpenses._sum.amount || 0}
- Spending distribution by category: ${JSON.stringify(categoryData)}
- Last 3 months timeline: ${JSON.stringify(monthlyStats)}
- Last 30 transactions: ${JSON.stringify(recentMovements)}

`;

      const response = await fetch(process.env.GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": process.env.GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      });

      const data = await response.json();
      const advice =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate advice.";

      const newAdvice = await prisma.advice.create({
        data: {
          userId,
          content: advice,
          isSystemGenerated: true,
        },
      });

      const remainingAdvices = Math.max(0, 5 - (todayAdvicesCount + 1));

      return {
        success: true,
        data: {
          advice: newAdvice.content,
          createdAt: newAdvice.createdAt,
          remainingAdvices,
        },
      };
    } catch (error) {
      console.error("Error in createAdvice service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },
};
