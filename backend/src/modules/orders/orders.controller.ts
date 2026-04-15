import { NextFunction, Request, Response } from "express";
import { CREATED, OK } from "http-status-codes";
import { OrderStatus } from "@prisma/client";
import { successResponse } from "../../utils/apiResponse";
import {
  createOrder,
  getOrderById,
  listOrders,
  updateOrderStatus,
} from "./orders.service";

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const status = req.query.status as OrderStatus | undefined;
    const search = req.query.search as string | undefined;
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    const data = await listOrders({
      status,
      search,
      page,
      limit,
    });

    res.status(OK).json(successResponse("Orders fetched", data));
  } catch (error) {
    next(error);
  }
};

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await getOrderById(req.params.id);
    res.status(OK).json(successResponse("Order details fetched", data));
  } catch (error) {
    next(error);
  }
};

export const createNewOrder = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await createOrder(req.body);
    res.status(CREATED).json(successResponse("Order created", data));
  } catch (error) {
    next(error);
  }
};

export const patchOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = await updateOrderStatus(req.params.id, req.body.status);
    res.status(OK).json(successResponse("Order status updated", data));
  } catch (error) {
    next(error);
  }
};
