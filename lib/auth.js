import { cookies } from "next/headers";
import { verifyToken } from "@/lib/jwt.js";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("auth-token");

    if (!tokenCookie) {
      return null;
    }

    const decoded = verifyToken(tokenCookie.value);

    if (!decoded) {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  return user;
}
