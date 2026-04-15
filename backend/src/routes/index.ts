import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import dashboardRouter from "../modules/dashboard/dashboard.routes";
import ordersRouter from "../modules/orders/orders.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Backend is running",
    data: {
      service: "restaurant-admin-backend",
      timestamp: new Date().toISOString(),
    },
  });
});

router.use("/auth", authRouter);
router.use("/dashboard", dashboardRouter);
router.use("/orders", ordersRouter);

export default router;

