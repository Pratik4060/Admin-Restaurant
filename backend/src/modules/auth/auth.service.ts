import { NOT_FOUND, UNAUTHORIZED } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import { comparePassword } from "../../utils/password";
import { signAdminToken } from "../../utils/jwt";
import { AppError } from "../../utils/appError";

type LoginPayload = {
  email: string;
  password: string;
};

export const loginAdmin = async (payload: LoginPayload) => {
  const admin = await prisma.admin.findUnique({
    where: { email: payload.email.toLowerCase() },
  });

  if (!admin) {
    throw new AppError("Admin account not found", NOT_FOUND);
  }

  const isValidPassword = await comparePassword(payload.password, admin.passwordHash);
  if (!isValidPassword) {
    throw new AppError("Invalid email or password", UNAUTHORIZED);
  }

  await prisma.admin.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const token = signAdminToken({
    adminId: admin.id,
    email: admin.email,
    role: admin.role,
  });

  return {
    token,
    admin: {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      lastLoginAt: admin.lastLoginAt,
    },
  };
};

export const getAdminProfile = async (adminId: string) => {
  const admin = await prisma.admin.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  if (!admin) {
    throw new AppError("Admin account not found", NOT_FOUND);
  }

  return admin;
};

