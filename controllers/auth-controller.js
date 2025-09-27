import { NextResponse } from "next/server";
import { authService } from "@/services/api/auth-service.js";
import { validateAuthRequest } from "@/lib/validators.js";
import { cookies } from "next/headers";
import { generateToken } from "@/lib/jwt.js";

export const AuthController = {
  async login(request) {
    try {
      const { email, password } = await request.json();

      const validation = validateAuthRequest({ email, password });
      if (!validation.isValid) {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 400 }
        );
      }

      const result = await authService.login(email, password);

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      const token = generateToken(result.data.user);

      const cookieStore = await cookies();
      cookieStore.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: "/",
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
      cookieStore.delete("auth-token");

      return NextResponse.json({ message: "Logout exitoso" });
    } catch (error) {
      console.error("Error en logout:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  },

  async me() {
    try {
      const result = await authService.getCurrentUser();

      if (!result.success) {
        return NextResponse.json(
          { error: result.message },
          { status: result.status }
        );
      }

      return NextResponse.json({ user: result.data });
    } catch (error) {
      console.error("Error getting current user:", error);
      return NextResponse.json(
        { error: "Error interno del servidor" },
        { status: 500 }
      );
    }
  },
};
