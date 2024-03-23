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
    nicklower: text("nicklower").notNull(),
    level: integer("level"),
    xp: bigint("xp", { mode: "number" }),
    squad: text("squad").notNull(),
    killsELO: doublePrecision("killsELO"),
    gamesELO: doublePrecision("gamesELO"),
    coins: bigint("coins", { mode: "number" }),
    number_of_jumps: integer("number_of_jumps"),
    steam: boolean("steam"),
})

export const playerInsertSchema = createInsertSchema(players)
export type PlayerInsert = z.infer<typeof playerInsertSchema>

export const playerSelectSchema = createSelectSchema(players)
export type PlayerSelect = z.infer<typeof playerSelectSchema>
