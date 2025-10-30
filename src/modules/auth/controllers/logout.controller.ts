import { Request, Response, NextFunction } from "express";
import { redis } from "../../../config/redis";

export async function logoutHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      try {
        const userId = (req as any).user?.id;
        if (userId) {
          await redis.del(userId);
        }
      } catch (redisErr) {
        console.error("Redis deletion error:", redisErr);
      }
    }
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return next(error);
  }
}
