import { Request, Response } from "express";
import { refreshTokens } from "../services/refresh.service";
export async function refreshHandler(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "Refresh token missing" });
    }
    const tokens = await refreshTokens(refreshToken);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(200).json({
      message: "Token refreshed successfully",
      accessToken: tokens.accessToken,
    });
  } catch (err: any) {
    return res.status(401).json({ message: err.message || "Could not refresh token" });
  }
}
