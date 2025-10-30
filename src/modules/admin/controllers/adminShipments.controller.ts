import { Request, Response } from "express";
import {
  getAllShipmentsService,
  updateShipmentStatusService,
  deleteShipmentService,
} from "../services/ adminShipments.service";

// 🔹 Get all shipments
export const getAllShipmentsHandler = async (_req: Request, res: Response) => {
  try {
    const shipments = await getAllShipmentsService();
    res.status(200).json({
      message: "All shipments fetched successfully",
      total: shipments.length,
      shipments,
    });
  } catch (error: any) {
    console.error("❌ Error fetching shipments:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateShipmentStatusHandler = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
  
      if (!id) {
        return res.status(400).json({ message: "Shipment ID is required" });
      }
  
      const shipmentId = parseInt(id, 10);
  
      if (!status) {
        return res.status(400).json({ message: "Shipment status is required" });
      }
  
      const updated = await updateShipmentStatusService(shipmentId, status);
  
      if (!updated) {
        return res.status(404).json({ message: "Shipment not found" });
      }
  
      return res.status(200).json({
        message: "Shipment status updated successfully",
        shipment: updated,
      });
    } catch (error: any) {
      console.error("❌ Error updating shipment status:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };


  export const deleteShipmentHandler = async (req: Request, res: Response) => {
    try {
      const idParam = req.params.id;
  
      if (!idParam) {
        return res.status(400).json({ message: "Shipment ID is required" });
      }
  
      const shipmentId = parseInt(idParam, 10);
  
      const deleted = await deleteShipmentService(shipmentId);
  
      if (!deleted) {
        return res.status(404).json({ message: "Shipment not found" });
      }
  
      return res.status(200).json({ message: "Shipment deleted successfully" });
    } catch (error: any) {
      console.error("❌ Error deleting shipment:", error.message);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
