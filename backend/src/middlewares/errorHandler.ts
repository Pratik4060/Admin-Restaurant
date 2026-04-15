import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from "http-status-codes";
import { AppError } from "../utils/appError";
import { failureResponse } from "../utils/apiResponse";

export const errorHandler = (
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json(failureResponse(error.message, error.details));
    return;
  }

  const message = error instanceof Error ? error.message : "Something went wrong";
  res.status(INTERNAL_SERVER_ERROR).json(failureResponse(message));
};

