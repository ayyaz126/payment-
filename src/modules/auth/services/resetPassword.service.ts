// src/modules/auth/services/resetPassword.service.ts
import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { redis } from "../../../config/redis";
import { sendEmail } from "../../../utils/email";

export async function resetPasswordService(
  email: string,
  otp: string,
  newPassword: string
): Promise<boolean> {
  // 1. OTP verify from Redis
  const storedOtp = await redis.get(`reset-otp:${email}`);
  if (!storedOtp || storedOtp !== otp) {
    throw new Error("Invalid or expired OTP");
  }

  // 2. Hash new password
  if (!newPassword) throw new Error("New password is required");
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // 3. Update user password in DB
  await db.update(users).set({ password: hashedPassword }).where(eq(users.email, email));

  // 4. Delete OTP from Redis
  await redis.del(`reset-otp:${email}`);

  // 5. Send confirmation email (safe check for user existence)
  try {
    const userResult = await db.select().from(users).where(eq(users.email, email));
    const user = userResult[0]; // may be undefined if no user found

    if (user) {
      const html = `
        <h2>Password Changed Successfully</h2>
        <p>Your password has been reset successfully. If this wasn't you, please contact support immediately.</p>
      `;
      await sendEmail(user.email, "Password Changed", html);
    } else {
      console.warn(`⚠️ No user found with email: ${email} after password reset`);
    }
  } catch (err) {
    console.error("⚠️ Password reset email failed:", err);
  }

  return true;
}
