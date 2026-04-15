import { z } from "zod";

export const listOrdersQuerySchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    status: z
      .enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELED"])
      .optional(),
    search: z.string().optional(),
    page: z.coerce.number().min(1).optional(),
    limit: z.coerce.number().min(1).max(50).optional(),
  }),
});

export const orderIdParamSchema = z.object({
  body: z.object({}).optional(),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const createOrderSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({}).optional(),
  body: z.object({
    tableNumber: z.string().min(1),
    customerId: z.string().uuid().optional(),
    notes: z.string().optional(),
    items: z
      .array(
        z.object({
          menuItemId: z.string().uuid(),
          quantity: z.coerce.number().int().min(1),
        }),
      )
      .min(1),
  }),
});

export const updateOrderStatusSchema = z.object({
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    status: z.enum(["PENDING", "PREPARING", "READY", "COMPLETED", "CANCELED"]),
  }),
});

