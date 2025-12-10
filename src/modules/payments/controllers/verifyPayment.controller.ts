import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";
import { db } from "../../../config/db";
import { payments } from "../../../db/schema/payments";
import { eq } from "drizzle-orm";

export const verifyPaymentHandler = async (req: Request, res: Response) => {
    try {
      const { sessionId } = req.query;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
  
      console.log("🔎 Session ID received:", sessionId);
  
      const session = await StripeService.verifyPayment(sessionId as string);
  
      console.log("✅ Stripe Session Retrieved:", session);
  
      await db
        .update(payments)
        .set({
          status: session.payment_status || "unknown",
        })
        .where(eq(payments.providerPaymentId, session.id));
  
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
        data: {
          sessionId: session.id,
          status: session.payment_status,
          amount_total: session.amount_total,
          customer_email: session.customer_details?.email,
        },
      });
    } catch (error) {
      console.error(" Verify Payment Error:", error); 
      return res.status(500).json({
        success: false,
        message: "Failed to verify payment",
      });
    }
  };
  