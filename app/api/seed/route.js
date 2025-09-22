import { NextResponse } from "next/server";
import { prisma } from "@/db/client";
import exampleData from "@/lib/exampleData.json";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const apikey = searchParams.get("apikey");

    if (apikey !== process.env.API_KEY) {
      return NextResponse.json({ error: "API key inválida" }, { status: 401 });
    }

    const uniqueTypes = [...new Set(exampleData.map((item) => item.type))];
    const uniqueCategories = [
      ...new Set(exampleData.map((item) => item.category)),
    ];

    const createdTypes = [];
    for (const typeName of uniqueTypes) {
      if (typeName) {
        const type = await prisma.type.upsert({
          where: { name: typeName },
          update: {},
          create: { name: typeName },
        });
        createdTypes.push(type);
      }
    }

    const createdCategories = [];
    for (const categoryName of uniqueCategories) {
      if (categoryName) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        createdCategories.push(category);
      }
    }

    return NextResponse.json({
      message: "Datos cargados exitosamente",
      types: {
        count: createdTypes.length,
        data: createdTypes,
      },
      categories: {
        count: createdCategories.length,
        data: createdCategories,
      },
    });
  } catch (error) {
    console.error("Error en seed:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
