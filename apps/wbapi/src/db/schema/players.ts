import {
    bigint,
    boolean,
    doublePrecision,
    integer,
    pgTable,
    text,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"

export const players = pgTable("players", {
    uid: text("uid").primaryKey(),
    nick: text("nick").notNull(),
    nicklower: text("nicklower"),
    level: integer("level").notNull(),
    xp: bigint("xp", { mode: "number" }).notNull(),
    squad: text("squad").notNull(),
    killsELO: doublePrecision("killsELO").notNull(),
    gamesELO: doublePrecision("gamesELO").notNull(),
    coins: bigint("coins", { mode: "number" }),
    number_of_jumps: integer("number_of_jumps"),
    steam: boolean("steam"),
})

export const playerInsertSchema = createInsertSchema(players)
export type PlayerInsert = z.infer<typeof playerInsertSchema>

export const playerSelectSchema = createSelectSchema(players)
export type PlayerSelect = z.infer<typeof playerSelectSchema>
