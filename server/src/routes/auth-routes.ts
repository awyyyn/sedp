import { Router } from "express";
import {
	adminLoginController,
	adminForgotPasswordController,
	verifyTokenController,
	resetPasswordController,
} from "../controllers/index.js";
import { authMiddleware } from "@/middleware/auth.js";

const router = Router();

router.post("/admin-login", adminLoginController);
router.post("/admin-forgot-password", adminForgotPasswordController);
router.post("/admin-verify-token", verifyTokenController);
router.post("/admin-reset-password", authMiddleware, resetPasswordController);

export { router as authRoutes };
