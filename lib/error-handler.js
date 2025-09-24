import { NextResponse } from "next/server";

export class ApiError extends Error {
  constructor(message, status = 500, code = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(error) {
  console.error("API Error:", error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        timestamp: new Date().toISOString(),
      },
      { status: error.status }
    );
  }

  if (error.code === "P2002") {
    return NextResponse.json(
      {
        error: "Resource already exists",
        code: "DUPLICATE_ENTRY",
        timestamp: new Date().toISOString(),
      },
      { status: 409 }
    );
  }

  if (error.code === "P1001") {
    return NextResponse.json(
      {
        error: "Database connection error",
        code: "DATABASE_CONNECTION_ERROR",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }

  return NextResponse.json(
    {
      error: "Internal server error",
      code: "INTERNAL_SERVER_ERROR",
      timestamp: new Date().toISOString(),
    },
    { status: 500 }
  );
}

export function withErrorHandling(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
