// src/modules/dashboard/routes/dashboard.routes.ts
import { Router } from "express";
import { getDashboardStatsHandler } from "../controllers/dashboard.controller";
import { protect } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/authorize.middleware";

const router = Router();

// 🔒 Only admin can access
router.get("/stats", protect, authorizeRoles(["admin"]), getDashboardStatsHandler);

export default router;
