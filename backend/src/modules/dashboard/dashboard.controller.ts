import { NextFunction, Request, Response } from "express";
import { OK } from "http-status-codes";
import { successResponse } from "../../utils/apiResponse";
import {
  getActiveOffers,
  getOrderStatusBreakdown,
  getPopularItems,
  getRevenueTrend,
  getSummary,
} from "./dashboard.service";

export const summary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getSummary();
    res.status(OK).json(successResponse("Dashboard summary fetched", data));
  } catch (error) {
    next(error);
  }
};

export const revenueTrend = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const days = Number(req.query.days ?? 7);
    const data = await getRevenueTrend(days);
    res.status(OK).json(successResponse("Revenue trend fetched", data));
  } catch (error) {
    next(error);
  }
};

export const orderStatus = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getOrderStatusBreakdown();
    res.status(OK).json(successResponse("Order status breakdown fetched", data));
  } catch (error) {
    next(error);
  }
};

export const activeOffers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getActiveOffers();
    res.status(OK).json(successResponse("Active offers fetched", data));
  } catch (error) {
    next(error);
  }
};

export const popularItems = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const foodType = (req.query.foodType as "all" | "veg" | "nonveg") ?? "all";
    const limit = Number(req.query.limit ?? 8);
    const data = await getPopularItems(foodType, limit);
    res.status(OK).json(successResponse("Popular items fetched", data));
  } catch (error) {
    next(error);
  }
};

