import { z } from "zod";

export const revenueTrendQuerySchema = z.object({
  params: z.object({}).optional(),
  body: z.object({}).optional(),
  query: z.object({
    days: z.coerce.number().min(1).max(30).optional(),
  }),
});

export const popularItemsQuerySchema = z.object({
  params: z.object({}).optional(),
  body: z.object({}).optional(),
  query: z.object({
    foodType: z.enum(["all", "veg", "nonveg"]).optional(),
    limit: z.coerce.number().min(1).max(20).optional(),
  }),
});

