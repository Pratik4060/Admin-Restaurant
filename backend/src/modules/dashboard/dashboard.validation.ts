import { z } from "zod";

export const revenueTrendQuerySchema = z.object({
  params: z.object({}).optional(),
  body: z.object({}).optional(),
  query: z.object({
    // Frontend supports weekly/monthly/yearly.
    // Keep an upper bound to avoid accidental huge loads.
    days: z.coerce.number().min(1).max(365).optional(),
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

