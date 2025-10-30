import { relations } from "drizzle-orm/relations";
import { users, shipments } from "./schema";

export const shipmentsRelations = relations(shipments, ({one}) => ({
	user: one(users, {
		fields: [shipments.userId],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	shipments: many(shipments),
}));