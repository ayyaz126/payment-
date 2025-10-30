// src/modules/payments/controllers/stripeWebhook.controller.ts
import { Request, Response } from "express";
import { StripeWebhookService } from "../services/stripeWebhook.service";
import Stripe from "stripe";

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  try {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      console.error("❌ Missing webhook signature or secret");
      return res.status(400).json({ message: "Webhook signature missing" });
    }

    let event: Stripe.Event;

    try {
      // ✅ Construct event with signature verification
      event = StripeWebhookService.constructEvent(
        req.body, // raw body is required (make sure you are using express.raw())
        sig as string,
        webhookSecret
      );
    } catch (err: any) {
      console.error("⚠️ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // ✅ Pass event to service for handling all cases
    await StripeWebhookService.handleEvent(event);

    return res.json({ received: true });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(500).json({ message: "Webhook processing failed" });
  }
};
