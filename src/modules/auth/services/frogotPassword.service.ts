// src/modules/auth/services/forgotPassword.service.ts
import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";
import { eq } from "drizzle-orm";
import { sendEmail } from "../../../utils/email";
import { redis } from "../../../config/redis";

export async function forgotPasswordService(email: string): Promise<boolean> {
  // 1️⃣ Check if user exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length === 0) {
    return false; // Don't reveal user existence
  }

  const user = existingUser[0]!;

  // 2️⃣ Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // 3️⃣ Store OTP in Redis (expires in 15 mins)
  await redis.set(`reset-otp:${email}`, otp, { EX: 60 * 15 });

  // 4️⃣ Send OTP email
  const html = `
    <h2>Password Reset Request</h2>
    <p>Use the OTP below to reset your password:</p>
    <h1 style="font-size: 28px; letter-spacing: 4px; color: #2c3e50;">${otp}</h1>
    <p>This OTP will expire in <strong>15 minutes</strong>. If you didn’t request this, please ignore this email.</p>
  `;

  try {
    await sendEmail(user.email, "Your Password Reset OTP", html);
    return true;
  } catch (err) {
    console.error("❌ Failed to send reset OTP:", err);
    return false;
  }
}
