import { authController, validateTokenController } from "@app/controllers";
import { Router } from "express";

const router = Router();

router.post("/auth", authController);
router.post("/validate-token", validateTokenController);

export default router;
