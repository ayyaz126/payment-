import { db } from "../../../config/db";
import { users } from "../../../db/schema/users";
import { shipments } from "../../../db/schema/shipments";
import { redis } from "../../../config/redis";

export const getDashboardStatsService = async () => {
  try {
    // 1️⃣ Check cache
    const cachedData = await redis.get("dashboard:stats");
    if (cachedData) {
      console.log("📦 Returning cached dashboard stats");
      return JSON.parse(cachedData);
    }

    console.log("🧮 Fetching fresh dashboard stats...");

    // 2️⃣ Fetch from DB
    const totalUsersResult = await db.select().from(users);
    const totalUsers = totalUsersResult.length;

    const allShipments = await db.select().from(shipments);
    const totalShipments = allShipments.length;

    const pendingShipments = allShipments.filter((s) => s.status === "Pending").length;
    const deliveredShipments = allShipments.filter((s) => s.status === "Delivered").length;
    const inTransitShipments = allShipments.filter((s) => s.status === "In Transit").length;

    const stats = {
      totalUsers,
      totalShipments,
      pendingShipments,
      deliveredShipments,
      inTransitShipments,
    };

    // 3️⃣ Store in Redis (expire in 60 seconds)
    await redis.setEx("dashboard:stats", 60, JSON.stringify(stats));

    return stats;
  } catch (error) {
    console.error("❌ Dashboard service error:", error);
    throw error;
  }
};
