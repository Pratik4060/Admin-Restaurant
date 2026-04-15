import { Router } from "express";
import { requireAuth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import {
  activeOffers,
  orderStatus,
  popularItems,
  revenueTrend,
  summary,
} from "./dashboard.controller";
import {
  popularItemsQuerySchema,
  revenueTrendQuerySchema,
} from "./dashboard.validation";

const dashboardRouter = Router();

dashboardRouter.use(requireAuth);
dashboardRouter.get("/summary", summary);
dashboardRouter.get("/revenue-trend", validateRequest(revenueTrendQuerySchema), revenueTrend);
dashboardRouter.get("/order-status", orderStatus);
dashboardRouter.get("/active-offers", activeOffers);
dashboardRouter.get("/popular-items", validateRequest(popularItemsQuerySchema), popularItems);

export default dashboardRouter;

