import { Request, Response } from "express";
import { getAllUsersService } from "../services/adminUsers.service";

export const getAllUsersHandler = async (_req: Request, res: Response) => {
  try {
    const users = await getAllUsersService();

    res.status(200).json({
      message: "All users fetched successfully",
      total: users.length,
      users,
    });
  } catch (error: any) {
    console.error(" Error fetching users:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
