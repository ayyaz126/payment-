import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { redis } from "../../../config/redis";
import { generateAccessToken, generateRefreshToken } from "../../../utils/jwt";

export async function loginUser(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email));

  if (user.length === 0) {
    return { error: "Invalid credentials", status: 401 };
  }

  const existingUser = user[0]!;

  const validPassword = await bcrypt.compare(password, existingUser.password);
  if (!validPassword) {
    return { error: "Invalid credentials", status: 401 };
  }

  const accessToken = generateAccessToken({
    userId: existingUser.id,
    role: existingUser.role,
  });
  const refreshToken = generateRefreshToken({
    userId: existingUser.id,
    role: existingUser.role,
  });

  await redis.set(existingUser.id, refreshToken, { EX: 7 * 24 * 60 * 60 });

  return { accessToken, refreshToken, user: existingUser };
}
