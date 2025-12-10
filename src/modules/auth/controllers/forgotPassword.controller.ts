import { Request, Response, NextFunction } from "express";
import { forgotPasswordService } from "../services/frogotPassword.service"; 

export async function forgotPasswordHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email } = req.body;
    const emailSent = await forgotPasswordService(email);
    
    return res.status(200).json({
      message:
        "If an account exists with this email, you will receive an OTP shortly.",
      success: emailSent, 
    });
  } catch (error) {
    return next(error);
  }
}
