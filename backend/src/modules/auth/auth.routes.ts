import { Router } from "express";
import { login, me } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { loginSchema } from "./auth.validation";
import { requireAuth } from "../../middlewares/auth";

const authRouter = Router();

authRouter.post("/login", validateRequest(loginSchema), login);
authRouter.get("/me", requireAuth, me);

export default authRouter;

