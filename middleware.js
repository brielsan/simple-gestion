import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // rutas a las que puede acceder el usuario sin estar autenticado
  const publicRoutes = [
    "/login",
    "/register",
    "/api/auth/login",
    "/api/auth/register",
    "/api/seed",
  ];

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  const userCookie = request.cookies.get("user");

  if (!userCookie) {
    // si no hay cookie de usuario (y no es una ruta publica): redirigir a login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
