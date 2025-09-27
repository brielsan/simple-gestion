import bcrypt from "bcryptjs";
import { prisma } from "@/db/client.js";

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export async function createUser(email, password, username) {
  const hashedPassword = await hashPassword(password);

  return await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username,
    },
    select: {
      id: true,
      email: true,
      username: true,
      createdAt: true,
    },
  });
}

export async function findUserByEmail(email) {
  return await prisma.user.findUnique({
    where: { email },
  });
}

export async function authenticateUser(email, password) {
  const user = await findUserByEmail(email);

  if (!user) {
    return null;
  }

  const isValidPassword = await verifyPassword(password, user.password);

  if (!isValidPassword) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    username: user.username,
  };
}
