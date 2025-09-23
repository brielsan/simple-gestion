import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [categories, types] = await Promise.all([
      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
      }),
      prisma.type.findMany({
        orderBy: {
          name: "asc",
        },
      }),
    ]);

    return NextResponse.json({
      categories,
      types,
    });
  } catch (error) {
    console.error("Error obteniendo filtros:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
