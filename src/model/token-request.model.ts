import {pgTable, integer, varchar, timestamp} from "drizzle-orm/pg-core";



export const tokenRequest = pgTable("token_requests_table", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    address: varchar("address").notNull(),
    amount: integer("amount").notNull(),
    status: varchar("status", {length: 255}).notNull().default("successful"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})