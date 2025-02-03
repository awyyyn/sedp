import { Router } from "express";
import {
	adminLoginController,
	adminForgotPasswordController,
	adminVerifyTokenController,
	adminResetPasswordController,
	adminRegisterController,
	studentRegisterController,
	studentLoginController,
	studentForgotPasswordController,
	studentVerifyTokenController,
	studentResetPasswordController,
} from "../controllers/index.js";
import { authMiddleware } from "@/middleware/auth.js";

const router = Router();

router.post("/admin-login", adminLoginController);
router.post("/admin-register", adminRegisterController);
router.post("/admin-forgot-password", adminForgotPasswordController);
router.post("/admin-verify-token", adminVerifyTokenController);
router.post(
	"/admin-reset-password",
	authMiddleware,
	adminResetPasswordController
);

router.post("/register", studentRegisterController);
router.post("/login", studentLoginController);
router.post("/forgot-password", studentForgotPasswordController);
router.post("/verify-token", studentVerifyTokenController);
router.post("/reset-password", authMiddleware, studentResetPasswordController);

export { router as authRoutes };
