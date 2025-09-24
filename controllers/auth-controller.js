import { NextResponse } from "next/server";
import { authService } from "@/services/auth-service.js";
import { validateAuthRequest } from "@/lib/validators.js";
import { cookies } from "next/headers";

export const AuthController = {
  async login(request) {
    try {
      const { email, password } = await request.json();

      const validation = validateAuthRequest({ email, password });
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.errors }, { status: 400 });
      }

      const result = await authService.login(email, password);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      const cookieStore = await cookies();
      cookieStore.set("user", JSON.stringify(result.data.user), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return NextResponse.json({
        message: "Login successful",
        user: result.data.user,
      });
    } catch (error) {
      console.error("Error in login:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async register(request) {
    try {
      const { email, password, username } = await request.json();

      const validation = validateAuthRequest({ email, password, username });
      if (!validation.isValid) {
        return NextResponse.json({ error: validation.errors }, { status: 400 });
      }

      const result = await authService.register(email, password, username);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json(result.data);
    } catch (error) {
      console.error("Error in registration:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  },

  async logout() {
    try {
      const result = await authService.logout();

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      const cookieStore = await cookies();
      cookieStore.delete("user");

      return NextResponse.json({ message: "Logout exitoso" });
    } catch (error) {
      console.error("Error en logout:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  },
};
