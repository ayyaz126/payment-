import { pgTable, serial, uuid, varchar, timestamp, integer, text, unique, foreignKey, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const shipmentStatus = pgEnum("shipment_status", ['Pending', 'In Transit', 'Delivered', 'Cancelled'])


export const invoices = pgTable("invoices", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	paymentId: uuid("payment_id").notNull(),
	invoiceUrl: varchar("invoice_url").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
});

export const payments = pgTable("payments", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	amount: integer().notNull(),
	currency: varchar({ length: 3 }).default('USD').notNull(),
	status: varchar({ length: 32 }).default('pending').notNull(),
	method: varchar({ length: 32 }).notNull(),
	providerPaymentId: varchar("provider_payment_id", { length: 255 }),
	metadata: text(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
});

export const users = pgTable("users", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	password: text().notNull(),
	role: text().default('user').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const shipments = pgTable("shipments", {
	id: serial().primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	origin: varchar({ length: 255 }).notNull(),
	destination: varchar({ length: 255 }).notNull(),
	status: shipmentStatus().default('Pending').notNull(),
	trackingCode: varchar("tracking_code", { length: 50 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "shipments_user_id_users_id_fk"
		}).onDelete("cascade"),
	unique("shipments_tracking_code_unique").on(table.trackingCode),
]);
