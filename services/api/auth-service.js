import { getCurrentUser } from "@/lib/auth.js";
import { createUser, authenticateUser } from "./auth.js";
import { prisma } from "@/db/client.js";
import { mockupService } from "./mockup-service.js";

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
            testmode: user.testmode,
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

  async register(email, password, username, includeDemo = false) {
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

      if (includeDemo) {
        await mockupService.toggleTestMode(user, true);
      }

      return {
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            testmode: includeDemo,
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

  async getCurrentUser() {
    try {
      const user = await getCurrentUser();

      if (!user) {
        return {
          success: false,
          message: "Not authenticated",
          status: 401,
        };
      }

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          username: true,
          testmode: true,
        },
      });

      if (!dbUser) {
        return {
          success: false,
          message: "User not found",
          status: 401,
        };
      }

      return {
        success: true,
        data: dbUser,
      };
    } catch (error) {
      console.error("Error in getCurrentUser service:", error);
      return {
        success: false,
        message: "Internal server error",
        status: 500,
      };
    }
  },
};
