import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const movements = await prisma.movement.findMany({
      where: {
        userId: user.id,
        deleted: false,
      },
      include: {
        category: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    const totalMovements = await prisma.movement.count({
      where: {
        userId: user.id,
        deleted: false,
      },
    });

    const totalPages = Math.ceil(totalMovements / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    return NextResponse.json({
      movements,
      pagination: {
        currentPage: page,
        totalPages,
        totalMovements,
        hasNextPage,
        hasPrevPage,
        limit,
      },
    });
  } catch (error) {
    console.error("Error en dashboard movements:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
