import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";


export const getAllShipmentsService = async () => {
  return await db.select().from(shipments);
};


export const updateShipmentStatusService = async (id: number, status: string) => {  
    const [updated] = await db
      .update(shipments)
      .set({ status: status as "Pending" | "In Transit" | "Delivered" | "Cancelled" })
      .where(eq(shipments.id, id))
      .returning();
  
    return updated;
  };

export const deleteShipmentService = async (id: number) => {
  const [deleted] = await db
    .delete(shipments)
    .where(eq(shipments.id, id))
    .returning();

  return deleted;
};
