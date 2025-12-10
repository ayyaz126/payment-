import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

interface TokenPayload {
  userId: string;
  role: string;
  iat: number;
  exp: number;
}

export function protect(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;
    console.log("🔹 Authorization Header:", authHeader);

    if (!authHeader) {
      res.status(401).json({ message: "Missing Authorization header" });
      return;
    }

    const [scheme, token] = authHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
      res.status(401).json({
        message: "Invalid authorization format. Use 'Bearer <token>'",
      });
      return;
    }

    const decoded = verifyAccessToken(token) as TokenPayload;
    if (!decoded) {
      res.status(401).json({ message: "Token verification failed" });
      return;
    }

    console.log("Decoded Token Payload:", decoded);

    (req as any).user = {
      id: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error: any) {
    console.error(" Token verification error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
}
