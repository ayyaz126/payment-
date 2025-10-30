import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";
import { redis } from "../../../config/redis"; // 👈 add this import

// Allowed shipment statuses
type ShipmentStatus = "Pending" | "In Transit" | "Delivered" | "Cancelled";

export const updateShipmentStatusService = async (
  id: number,
  status: ShipmentStatus
) => {
  const [updatedShipment] = await db
    .update(shipments)
    .set({ status })
    .where(eq(shipments.id, id))
    .returning();

  // 🧹 Invalidate related caches
  if (updatedShipment) {
    // remove dashboard cache
    await redis.del("dashboard:stats");

    // remove specific shipment cache if you cached it somewhere
    await redis.del(`shipment:${id}`);

    // optionally clear user shipments cache if implemented
    if (updatedShipment.userId) {
      await redis.del(`user:${updatedShipment.userId}:shipments`);
    }
  }

  return updatedShipment;
};
