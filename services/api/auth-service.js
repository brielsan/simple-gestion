import { createUser, authenticateUser } from "./auth.js";
import { prisma } from "@/db/client.js";

export const authService = {
  async login(email, password) {
    try {
      const user = await authenticateUser(email, password);

      if (!user) {
        return {
          success: false,
          message: "Invalid credentials",
          status: 401,
        };
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
        },
      };
    } catch (error) {
      console.error("Error in login service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async register(email, password, username) {
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return {
          success: false,
          message: "User already exists",
          status: 409,
        };
      }

      const user = await createUser(email, password, username);

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
          },
        },
      };
    } catch (error) {
      console.error("Error in register service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },

  async logout() {
    try {
      return {
        success: true,
        data: {
          message: "Session closed successfully",
        },
      };
    } catch (error) {
      console.error("Error in logout service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },
};
