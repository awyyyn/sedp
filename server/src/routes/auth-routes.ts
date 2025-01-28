import { Router } from "express";
import {
	adminLoginController,
	adminRegisterController,
} from "../controllers/index.js";

const router = Router();

router.post("/admin-login", adminLoginController);
router.post("/admin-register", adminRegisterController);
router.post("/login", adminLoginController);
router.post("/register", adminRegisterController);

export { router as authRoutes };
