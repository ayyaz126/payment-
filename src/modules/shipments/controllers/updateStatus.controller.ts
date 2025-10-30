import { Request, Response } from "express";
import { updateShipmentStatusService } from "../services/updateStatus.service";

export const updateShipmentStatusHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!id) {
      res.status(400).json({ message: "Shipment ID is required" });
      return;
    }

    const shipmentId = parseInt(id, 10);
    if (isNaN(shipmentId)) {
      res.status(400).json({ message: "Invalid shipment ID" });
      return;
    }

    const updatedShipment = await updateShipmentStatusService(shipmentId, status);

    if (!updatedShipment) {
      res.status(404).json({ message: "Shipment not found" });
      return;
    }

    res.json({ shipment: updatedShipment });
  } catch (error) {
    console.error("Error updating shipment status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
