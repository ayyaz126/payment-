import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";

// 🔹 Get all shipments
export const getAllShipmentsService = async () => {
  return await db.select().from(shipments);
};

// 🔹 Update shipment status
export const updateShipmentStatusService = async (id: number, status: string) => {
    // type assert because we know it will match enum
    const [updated] = await db
      .update(shipments)
      .set({ status: status as "Pending" | "In Transit" | "Delivered" | "Cancelled" })
      .where(eq(shipments.id, id))
      .returning();
  
    return updated;
  };

// 🔹 Delete shipment
export const deleteShipmentService = async (id: number) => {
  const [deleted] = await db
    .delete(shipments)
    .where(eq(shipments.id, id))
    .returning();

  return deleted;
};
