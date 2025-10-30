
import { Request, Response } from "express";
import { getUserShipmentsService } from "../services/getusersShip.service";

export const getUserShipmentsHandler = async (req: Request, res: Response) => {
  try {
    // userId JWT se aa raha hai (auth.middleware se set hota hai)
    const userId = (req as any).user.id;

    const shipments = await getUserShipmentsService(userId);

    return res.status(200).json({
      message: "User shipments fetched successfully",
      shipments,
    });
  } catch (error: any) {
    console.error("Error fetching user shipments:", error);
    return res.status(500).json({
      message: "Failed to fetch user shipments",
      error: error.message,
    });
  }
};
