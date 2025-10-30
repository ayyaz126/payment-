import { redis } from "../../../config/redis";
import { verifyRefreshToken, generateAccessToken, generateRefreshToken } from "../../../utils/jwt";

 export async function refreshTokens(refreshToken: string) {
  if (!refreshToken) throw new Error("Refresh token missing");

  let decoded: any;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw new Error("Invalid refresh token");
  }
  const userId = decoded.userId;
  const storedToken = await redis.get(userId);
  if (storedToken !== refreshToken) {
    throw new Error("Refresh token revoked");
  }
  const newAccessToken = generateAccessToken({ userId, role: decoded.role });
  const newRefreshToken = generateRefreshToken({ userId, role: decoded.role });

  await redis.set(userId, newRefreshToken, { EX: 7 * 24 * 60 * 60 });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
