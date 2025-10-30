import { Router } from "express";
import { registerHandler } from "../controllers/register.controller";
import { loginHandler } from "../controllers/login.controller";
import { refreshHandler } from "../controllers/refresh.controller";
import { logoutHandler } from "../controllers/logout.controller";
import { validateBody } from "../../../middlewares/validate.middleware";
import { registerSchema, loginSchema } from "../dto/auth.types";
import { authLimiter } from "../../../middlewares/rateLimiter";
import { protect } from "../../../middlewares/auth.middleware";
import { authorizeRoles } from "../../../middlewares/authorize.middleware";
import { forgotPasswordHandler } from "../controllers/forgotPassword.controller";
import { resetPasswordHandler } from "../controllers/resetPassword.controller"

const router = Router();
router.post("/register", authLimiter, validateBody(registerSchema), registerHandler);
router.post("/login", authLimiter, validateBody(loginSchema), loginHandler);
router.post("/refresh", refreshHandler);
router.post("/logout", protect, logoutHandler);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

router.get("/me", protect, (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Protected route", user });
});

router.get("/admin-only", protect, authorizeRoles(["admin"]), (req, res) => {
  const user = (req as any).user;
  res.json({ message: "Welcome Admin!", user });
});

export default router;