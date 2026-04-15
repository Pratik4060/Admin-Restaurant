import { NextFunction, Request, Response } from "express";
import { ZodSchema } from "zod";
import { BAD_REQUEST } from "http-status-codes";
import { failureResponse } from "../utils/apiResponse";

export const validateRequest =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!parsed.success) {
      res.status(BAD_REQUEST).json(
        failureResponse("Validation failed", parsed.error.flatten()),
      );
      return;
    }

    next();
  };

