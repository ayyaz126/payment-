// src/db/schema/shipments.ts
import { pgTable, serial, varchar, uuid, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

// Shipment status enum
export const shipmentStatus = pgEnum("shipment_status", [
  "Pending",
  "In Transit",
  "Delivered",
  "Cancelled",
]);

export const shipments = pgTable("shipments", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  origin: varchar("origin", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  status: shipmentStatus("status").default("Pending").notNull(),
  trackingCode: varchar("tracking_code", { length: 50 }).unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
