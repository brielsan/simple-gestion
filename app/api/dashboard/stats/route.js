import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const totalEarned = await prisma.movement.aggregate({
      where: {
        userId: user.id,
        deleted: false,
        amount: {
          gt: 0,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const totalPaid = await prisma.movement.aggregate({
      where: {
        userId: user.id,
        deleted: false,
        amount: {
          lt: 0,
        },
      },
      _sum: {
        amount: true,
      },
    });

    const categoryData = await prisma.$queryRaw`
      SELECT 
        c.name as category,
        SUM(m.amount)::numeric as amount,
        COUNT(m.id)::integer as count
      FROM movements m
      INNER JOIN categories c ON m."categoryId" = c.id
      WHERE m."userId" = ${user.id} AND m.deleted = false AND m.amount < 0
      GROUP BY c.id, c.name
      ORDER BY amount ASC
      LIMIT 10
    `;

    const monthlyStats = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        SUM(amount)::numeric as total_amount,
        COUNT(*)::integer as movement_count
      FROM movements 
      WHERE "userId" = ${user.id} AND deleted = false
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month DESC
      LIMIT 4
    `;

    const topSpendingCategory = categoryData?.[0] || null;

    return NextResponse.json({
      totalEarned: Number(totalEarned._sum.amount),
      totalPaid: Number(totalPaid._sum.amount),
      topSpendingCategory: topSpendingCategory,
      categoryStats: categoryData,
      monthlyStats: monthlyStats,
      totalMovements: await prisma.movement.count({
        where: {
          userId: user.id,
          deleted: false,
        },
      }),
    });
  } catch (error) {
    console.error("Error en dashboard stats:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
