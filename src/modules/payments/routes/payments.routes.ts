import express, { Router } from "express"; // 👈 express bhi import kar liya
import { createPaymentHandler } from "../controllers/createPayment.controller";
import { verifyPaymentHandler } from "../controllers/verifyPayment.controller";
import { stripeWebhookHandler } from "../controllers/stripeWebhook.controller";
import { protect } from "../../../middlewares/auth.middleware";

const router = Router();

// ✅ Protected routes
router.post("/create-payment", protect, createPaymentHandler);
router.get("/verify-payment", protect, verifyPaymentHandler);

// ✅ Webhook route (NO auth middleware here!)
router.post(
  "/webhook",
  express.raw({ type: "application/json" }), // ✅ ab error nahi aayega
  stripeWebhookHandler
);

export default router;
