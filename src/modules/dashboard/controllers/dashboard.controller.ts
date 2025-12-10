import { Request, Response } from "express";
import { getDashboardStatsService } from "../services/dashboard.service";

export const getDashboardStatsHandler = async (_req: Request, res: Response) => {
  try {
    const stats = await getDashboardStatsService();

    res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats,
    });
  } catch (error: any) {
    console.error(" Error fetching dashboard stats:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
