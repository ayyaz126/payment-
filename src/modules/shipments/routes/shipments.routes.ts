import { Router } from "express";
import { createShipmentHandler } from "../controllers/createShipment.controller";
import { trackShipmentHandler } from "../controllers/trackShipment.controller";
import { updateShipmentStatusHandler } from "../controllers/updateStatus.controller";
import { getUserShipmentsHandler } from "../controllers/ getUsersShip.controller";
import { protect } from "../../../middlewares/auth.middleware"; // ✅ same as auth.routes.ts
import { authorizeRoles } from "../../../middlewares/authorize.middleware"; // ✅

const router = Router();

router.post("/create", protect, createShipmentHandler);
router.get("/track/:id", protect, trackShipmentHandler);
router.patch(
  "/update-status/:id",
  protect,
  authorizeRoles(["admin"]),
  updateShipmentStatusHandler
);

router.get("/my-shipments", protect, getUserShipmentsHandler);

export default router;
