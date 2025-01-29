import { Router } from "express";
import {
	adminLoginController,
	adminForgotPasswordController,
} from "../controllers/index.js";

const router = Router();

router.post("/admin-login", adminLoginController);
router.post("/admin-forgot-password", adminForgotPasswordController);

export { router as authRoutes };
