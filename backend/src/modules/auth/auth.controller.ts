import { NextFunction, Request, Response } from "express";
import { OK } from "http-status-codes";
import { successResponse } from "../../utils/apiResponse";
import { getAdminProfile, loginAdmin } from "./auth.service";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await loginAdmin(req.body);
    res.status(OK).json(successResponse("Login successful", result));
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = await getAdminProfile(req.admin!.id);
    res.status(OK).json(successResponse("Admin profile fetched", profile));
  } catch (error) {
    next(error);
  }
};

