import { pgTable, serial, varchar, timestamp, uuid } from "drizzle-orm/pg-core";

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  paymentId: uuid("payment_id").notNull(),
  invoiceUrl: varchar("invoice_url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
