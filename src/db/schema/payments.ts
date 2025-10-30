import { pgTable, uuid, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull(),
  amount: integer("amount").notNull(),           // store in minor units (cents)
  currency: varchar("currency", { length: 3 }).notNull().default("USD"),
  status: varchar("status", { length: 32 }).notNull().default("pending"), // pending|succeeded|failed|refunded
  method: varchar("method", { length: 32 }).notNull(), // stripe|paypal|card_on_file
  providerPaymentId: varchar("provider_payment_id", { length: 255 }), // provider ID (Stripe session / PayPal order)
  metadata: text("metadata"),                     // JSON string for extra info (orderId, items)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

