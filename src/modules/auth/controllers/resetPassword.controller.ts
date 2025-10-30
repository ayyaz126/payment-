// src/modules/auth/controllers/resetPassword.controller.ts
import { Request, Response, NextFunction } from "express";
import { resetPasswordService } from "../services/resetPassword.service";

export async function resetPasswordHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, otp, newPassword } = req.body; // ✅ right destructuring

    await resetPasswordService(email, otp, newPassword);

    return res.status(200).json({
      message: "Password reset successful",
    });
  } catch (error) {
    return next(error);
  }
}
