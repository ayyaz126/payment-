import { Request, Response } from "express";
import { StripeService } from "../services/stripe.service";

export const createPaymentHandler = async (req: Request, res: Response) => {
  try {
    const { amount, currency } = req.body;
    const userId = (req as any).user?.id; 
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const session = await StripeService.createCheckoutSession(
      userId,
      amount,
      currency || "USD"
    );

    return res.status(201).json({
      success: true,
      message: "Stripe checkout session created",
      data: {
        sessionId: session.id,
        url: session.url,
      },
    });
  } catch (error) {
    console.error(" Create Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create payment session",
    });
  }
};
