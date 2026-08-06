import {
    bigint,
    boolean,
    doublePrecision,
    index,
    integer,
    pgTable,
    text,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import type { z } from "zod"

export const players = pgTable(
    "players",
    {
        uid: text("uid").primaryKey(),
        nick: text("nick").notNull(),
        nicklower: text("nicklower").notNull(),
        level: integer("level").notNull(),
        xp: bigint("xp", { mode: "number" }).notNull(),
        squad: text("squad"),
        killsELO: doublePrecision("killsELO").notNull(),
        gamesELO: doublePrecision("gamesELO").notNull(),
        coins: bigint("coins", { mode: "number" }),
        number_of_jumps: integer("number_of_jumps"),
        steam: boolean("steam"),
    },
    (table) => [
        index("nicklower_idx").using("gin", table.nicklower.asc().op("gin_trgm_ops")),
        index("level_idx").using("btree", table.level.asc()),
        index("xp_idx").using("btree", table.xp.asc()),
        index("squad_idx").using("hash", table.squad),
        index("killsELO_idx").using("btree", table.killsELO.asc()),
        index("gamesELO_idx").using("btree", table.gamesELO.asc()),
    ],
)

export const playerInsertSchema = createInsertSchema(players)
export type PlayerInsert = z.infer<typeof playerInsertSchema>

export const playerSelectSchema = createSelectSchema(players)
export type PlayerSelect = z.infer<typeof playerSelectSchema>
