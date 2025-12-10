import { db } from "../../../config/db";
import { shipments } from "../../../db/schema/shipments";
import { eq } from "drizzle-orm";

export const getUserShipmentsService = async (userId: string) => {
  try {
    const result = await db
      .select()
      .from(shipments)
      .where(eq(shipments.userId, userId));

    return result;
  } catch (error: any) {
    console.error("DB error while fetching user shipments:", error);
    throw new Error("Could not fetch shipments for user");
  }
};
