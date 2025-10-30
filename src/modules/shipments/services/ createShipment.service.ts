import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { v4 as uuidv4 } from "uuid";
import { redis } from "../../../config/redis"; // 👈 add this import

export const createShipmentService = async (
  userId: string,
  origin: string,
  destination: string
) => {
  if (!origin || !destination) {
    throw new Error("Origin and destination are required");
  }

  const trackingCode = `TRK-${uuidv4()}`;

  const [shipment] = await db
    .insert(shipments)
    .values({
      userId,
      origin,
      destination,
      status: "Pending",
      trackingCode,
    })
    .returning();

  // 🧹 Clear dashboard cache after creating new shipment
  await redis.del("dashboard:stats");

  return shipment;
};

