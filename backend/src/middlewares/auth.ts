import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import { StatusCodes } from "http-status-codes";
import { verifyAdminToken } from "../utils/jwt";
import { failureResponse } from "../utils/apiResponse";

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      admin?: {
        id: string;
        email: string;
        role: Role;
      };
    }
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(StatusCodes.UNAUTHORIZED).json(failureResponse("Missing or invalid authorization header"));
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const payload = verifyAdminToken(token);
    req.admin = {
      id: payload.adminId,
      email: payload.email,
      role: payload.role as Role,
    };
    next();
  } catch {
    res.status(StatusCodes.UNAUTHORIZED).json(failureResponse("Invalid or expired token"));
  }
};

export const requireRole =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.admin || !roles.includes(req.admin.role)) {
      res.status(StatusCodes.FORBIDDEN).json(failureResponse("You do not have access to this resource"));
      return;
    }
    next();
  };
