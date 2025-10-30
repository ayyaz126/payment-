import Stripe from "stripe";
import { payments } from "../../../db/schema/payments";
import { db } from "../../../config/db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string); // ✅ apiVersion removed

export class StripeService {
  static async createCheckoutSession(userId: string, amount: number, currency = "USD") {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: "Test Product" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "http://localhost:3000/payment/cancel",
    });

    await db.insert(payments).values({
      userId,
      amount,
      currency,
      status: "pending",
      method: "stripe",
      providerPaymentId: session.id,
      metadata: JSON.stringify({ type: "checkout_session" }),
    });

    return session;
  }

  static async verifyPayment(sessionId: string) {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  }
}
