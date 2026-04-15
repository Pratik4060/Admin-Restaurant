import jwt from "jsonwebtoken";
import { env } from "../config/env";

type AdminTokenPayload = {
  adminId: string;
  email: string;
  role: string;
};

export const signAdminToken = (payload: AdminTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });

export const verifyAdminToken = (token: string): AdminTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AdminTokenPayload;
