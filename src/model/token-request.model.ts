import {pgTable, integer, varchar, timestamp} from "drizzle-orm/pg-core";





export const tokenRequest = pgTable("token_requests", {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    address: varchar("address").notNull(),
    chain: varchar("chain", {}).notNull(),
    network: varchar("network", {}).notNull(),
    amount: integer("amount").notNull(),
    status: varchar("status", {length: 255}).notNull().default("successful"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
})
