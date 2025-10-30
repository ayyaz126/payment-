// src/modules/payments/services/stripeWebhook.service.ts
import Stripe from "stripe";
import { db } from "../../../config/db";
import { payments } from "../../../db/schema/payments";
import { users } from "../../../db/schema/users";
import { eq } from "drizzle-orm";
import { InvoiceService } from "./invoice.service"; // ✅ Import InvoiceService

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export class StripeWebhookService {
  static constructEvent(payload: Buffer, signature: string, secret: string) {
    return stripe.webhooks.constructEvent(payload, signature, secret);
  }

  static async handleEvent(event: Stripe.Event) {
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case "payment_intent.succeeded":
        await this.handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent
        );
        break;

      case "charge.refunded":
        await this.handleChargeRefunded(event.data.object as Stripe.Charge);
        break;

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }
  }

  private static async handleCheckoutSessionCompleted(
    session: Stripe.Checkout.Session
  ) {
    console.log("✅ Checkout session completed:", session.id);

    // 1️⃣ Payment update + fetch
    const [payment] = await db
      .update(payments)
      .set({ status: "paid" })
      .where(eq(payments.providerPaymentId, session.id))
      .returning();

    console.log("🔍 Payment record after update:", payment);

    if (!payment) {
      console.error("❌ Payment not found for session:", session.id);
      return;
    }

    // 2️⃣ User fetch
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payment.userId));

    console.log("🔍 User record fetched for invoice:", user);

    if (!user) {
      console.error("❌ User not found for payment:", payment.id);
      return;
    }

    try {
      // 3️⃣ Invoice generate
      console.log("📝 Calling InvoiceService.generateInvoice...");
      const filePath = await InvoiceService.generateInvoice(user, payment);

      // 4️⃣ Invoice email send
      console.log("📧 Sending invoice email...");
      await InvoiceService.sendInvoiceEmail(user, filePath);

      console.log(`✅ Invoice generated & emailed: ${filePath}`);
    } catch (err) {
      console.error("⚠️ Failed to generate/send invoice:", err);
    }
  }

  private static async handlePaymentIntentSucceeded(
    intent: Stripe.PaymentIntent
  ) {
    console.log("💰 Payment intent succeeded:", intent.id);
  }

  private static async handleChargeRefunded(charge: Stripe.Charge) {
    console.log("♻️ Payment refunded:", charge.id);

    await db
      .update(payments)
      .set({ status: "refunded" })
      .where(eq(payments.providerPaymentId, charge.payment_intent as string));
  }
}
