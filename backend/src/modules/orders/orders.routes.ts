import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  createNewOrder,
  getOrder,
  getOrders,
  patchOrderStatus,
} from "./orders.controller";
import {
  createOrderSchema,
  listOrdersQuerySchema,
  orderIdParamSchema,
  updateOrderStatusSchema,
} from "./orders.validation";

const ordersRouter = Router();

ordersRouter.use(requireAuth);
ordersRouter.get("/", validateRequest(listOrdersQuerySchema), getOrders);
ordersRouter.get("/:id", validateRequest(orderIdParamSchema), getOrder);
ordersRouter.post("/", validateRequest(createOrderSchema), createNewOrder);
ordersRouter.patch("/:id/status", validateRequest(updateOrderStatusSchema), patchOrderStatus);

export default ordersRouter;

