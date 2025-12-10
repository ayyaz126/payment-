
import { Router } from "express";
import { protect } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/authorize.middleware";
import { getAllUsersHandler } from "../controllers/adminUsers.controller";
import {
    getAllShipmentsHandler,
    updateShipmentStatusHandler,
    deleteShipmentHandler,
  } from "../controllers/adminShipments.controller";

const router = Router();

router.use(protect, authorizeRoles(["admin"])); 

router.get("/users", getAllUsersHandler);
router.get("/", getAllShipmentsHandler);
router.patch("/:id/status", updateShipmentStatusHandler);
router.delete("/:id", deleteShipmentHandler);

export default router;

