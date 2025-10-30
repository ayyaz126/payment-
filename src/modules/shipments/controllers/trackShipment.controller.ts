import { Request, Response } from "express";
import { trackShipmentService } from "../services/trackShipment.service";

export const trackShipmentHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "Shipment ID is required" });
      return;
    }

    const shipmentId = parseInt(id, 10);
    if (isNaN(shipmentId)) {
      res.status(400).json({ message: "Invalid shipment ID" });
      return;
    }

    const shipment = await trackShipmentService(shipmentId);

    if (!shipment) {
      res.status(404).json({ message: "Shipment not found" });
      return;
    }

    res.json({ shipment });
  } catch (error) {
    console.error("Error tracking shipment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

