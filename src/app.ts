import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/routes/auth.routes";
import paymentsRoutes from "./modules/payments/routes/payments.routes";
import shipmentsRoutes from "./modules/shipments/routes/shipments.routes";
import adminRoutes from "./modules/admin/routes/ admin.routes";
import dashboardRoutes from "./modules/dashboard/routes/ dashboard.routes";
import { generalLimiter } from "./middlewares/rateLimiter";
import { errorHandler } from "./middlewares/error.middleware";

const app = express();
app.use(helmet());
app.use(cors());

import { stripeWebhookHandler } from "./modules/payments/controllers/stripeWebhook.controller";
app.post(
  "/api/payments/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler
);

app.use(express.json());
app.use(cookieParser());
app.use(generalLimiter);

app.use("/v1/api/auth", authRoutes);
app.use("/api/payments", paymentsRoutes);
app.use("/api/shipments", shipmentsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(errorHandler);

export default app;
