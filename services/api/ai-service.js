import { prisma } from "@/db/client.js";

const MAX_ADVICES_PER_DAY = 10;

export const aiService = {
  async getAdvice(user) {
    try {
      const userId = user.id;
      const lastAdvice = await prisma.advice.findFirst({
        where: { userId, deleted: false },
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
            isSystemGenerated: false,
          },
        });

        return {
          success: true,
          data: {
            advice: lastAdvice.content,
            createdAt: lastAdvice.createdAt,
            remainingAdvices: Math.max(
              0,
              MAX_ADVICES_PER_DAY - todayAdvicesCount
            ),
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

  async createAdvice(user, isSystemGenerated = true) {
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
          isSystemGenerated: false,
        },
      });

      if (todayAdvicesCount >= MAX_ADVICES_PER_DAY) {
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

      if (!totalIncome._sum.amount || !totalExpenses._sum.amount) {
        return {
          success: true,
          data: {
            advice: `No data available yet
Keeping track of your income and expenses is the first step toward better financial habits. Right now, there are no transactions to analyze, so we can’t generate personalized advice yet.
Whenever you add new data, just click the “Refresh” button to update the information instantly and get your first financial insights.`,
            remainingAdvices: MAX_ADVICES_PER_DAY - todayAdvicesCount,
          },
        };
      }

      const categoryData = await prisma.$queryRaw`
        SELECT 
          c.name as category,
          SUM(m.amount)::numeric as amount,
          COUNT(m.id)::integer as count
        FROM movements m
        INNER JOIN categories c ON m."categoryId" = c.id
        WHERE m."userId" = ${userId} AND m.deleted = false AND m.amount < 0 AND m."createdAt" >= NOW() - INTERVAL '3 months'
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
        WHERE "userId" = ${userId} AND deleted = false AND "createdAt" >= NOW() - INTERVAL '3 months'
        GROUP BY DATE_TRUNC('month', "createdAt")
        ORDER BY month DESC
        LIMIT 3
      `;

      const prompt = `
You are a personal financial advisor from the "Simple gestión" website.
The username is "${user.username}".
Analyze the data provided and generate exactly 4 short, clear, and practical pieces of advice.
Each piece of advice must start with the symbol "*" and be on its own line (with line breaks).
Do not include any introduction or summary, only the 4 lines of advice (MAX 550 characters).
Today is ${new Date().toLocaleDateString()}.

User data:
- Total income: ${totalIncome._sum.amount || 0}
- Total spent: ${totalExpenses._sum.amount || 0}
- Spending distribution by category (Last 3 months): ${JSON.stringify(
        categoryData
      )}
- Last 3 months timeline: ${JSON.stringify(monthlyStats)}
- Last 30 transactions (without filter): ${JSON.stringify(recentMovements)}

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

      let advice = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!advice) {
        return {
          success: false,
          message: data?.error?.message
            ? `(Gemini Error) ${data?.error?.message}`
            : "Could not generate advice. Please try again later.",
          status: 500,
        };
      }

      const newAdvice = await prisma.advice.create({
        data: {
          userId,
          content: advice,
          isSystemGenerated,
        },
      });

      const remainingAdvices = Math.max(
        0,
        MAX_ADVICES_PER_DAY - (todayAdvicesCount + isSystemGenerated ? 0 : 1)
      );

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
