import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import { getCurrentUser } from "@/lib/auth";
import exampleData from "@/lib/exampleData.json";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // si el usuario ya tiene movimientos, no se crea el mockup
    const movements = await prisma.movement.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (movements) {
      return NextResponse.json(
        { error: "El usuario ya tiene movimientos" },
        { status: 400 }
      );
    }

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
          description: item.description || "Movimiento sin descripción",
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

    return NextResponse.json({
      message: "Mock-up cargado exitosamente",
      movementsCreated: createdMovements.count,
      totalProcessed: exampleData.length,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Error en mockup:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
