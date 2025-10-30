import { Request, Response } from "express";
import { createShipmentService } from "../services/ createShipment.service";

// custom type for request with user
interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const createShipmentHandler = async (req: AuthRequest, res: Response) => {
  try {
    const { origin, destination } = req.body;

    if (!origin || !destination) {
      return res.status(400).json({ message: "Origin and destination are required" });
    }

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: user not found in request" });
    }

    const shipment = await createShipmentService(req.user.id, origin, destination);

    return res.status(201).json({
      message: "Shipment created successfully",
      shipment,
    });
  } catch (error) {
    console.error("Error creating shipment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
