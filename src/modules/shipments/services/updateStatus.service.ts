import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";
import { redis } from "../../../config/redis"; 


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


  if (updatedShipment) {   
    await redis.del("dashboard:stats");
    await redis.del(`shipment:${id}`);

   
    if (updatedShipment.userId) {
      await redis.del(`user:${updatedShipment.userId}:shipments`);
    }
  }

  return updatedShipment;
};
