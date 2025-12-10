import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}
export function authorizeRoles(roles: string[] = []) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (roles.length > 0 && !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden: Required roles [${roles.join(", ")}], but got ${req.user.role}`,
      });
    }

    return next(); 
  };
}

