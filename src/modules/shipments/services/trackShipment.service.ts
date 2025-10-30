import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";

export const trackShipmentService = async (id: number) => {
  const [shipment] = await db
    .select()
    .from(shipments)
    .where(eq(shipments.id, id)); // ✅ id ab number hai

  return shipment;
};
