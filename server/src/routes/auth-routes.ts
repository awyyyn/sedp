import { Router } from "express";
import {
  adminLoginController,
  adminForgotPasswordController,
  adminVerifyTokenController,
  adminResetPasswordController,
  adminRegisterController,
  studentRegisterController,
  studentForgotPasswordController,
  verifyTokenController,
  studentResetPasswordController,
  userProfileController,
  loginController,
  forgotPasswordController,
} from "../controllers/index.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/admin-login", adminLoginController);
router.post("/admin-register", adminRegisterController);
router.post("/admin-forgot-password", adminForgotPasswordController);
router.post("/admin-verify-token", adminVerifyTokenController);
router.post(
  "/admin-reset-password",
  authMiddleware,
  adminResetPasswordController,
);

router.post("/register", studentRegisterController);
router.post("/reset-password", authMiddleware, studentResetPasswordController);

// General login route for both students and admins
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-token", verifyTokenController);

router.post("/me", authMiddleware, userProfileController);

export { router as authRoutes };
