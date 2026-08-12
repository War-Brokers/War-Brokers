import { type Player, playerSchema } from "@warbrokers/types/src/player"
import {
    bigint,
    boolean,
    doublePrecision,
    index,
    integer,
    jsonb,
    pgTable,
    text,
} from "drizzle-orm/pg-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"

export const players = pgTable(
    "players",
    {
        uid: text("uid").primaryKey(),
        nick: text("nick").notNull(),
        nicklower: text("nicklower").notNull(),
        level: integer("level").notNull(),
        xp: bigint("xp", { mode: "number" }).notNull(),
        coins: bigint("coins", { mode: "number" }),
        squad: text("squad"),
        killsELO: doublePrecision("killsELO").notNull(),
        gamesELO: doublePrecision("gamesELO").notNull(),

        wins: jsonb("wins").$type<NonNullable<Player["wins"]>>(),
        losses: jsonb("losses").$type<NonNullable<Player["losses"]>>(),
        number_of_capture_points: integer("number_of_capture_points"),
        number_of_jumps: integer("number_of_jumps"),
        scuds_launched: integer("scuds_launched"),
        total_kills: integer("total_kills"),
        kill_to_death_ratio: doublePrecision("kill_to_death_ratio"),
        kills_per_minute: doublePrecision("kills_per_minute"),
        zombie_kills: integer("zombie_kills"),
        zombie_deaths: integer("zombie_deaths"),
        zombie_time_alive: doublePrecision("zombie_time_alive"),
        zombie_time_alive_count: integer("zombie_time_alive_count"),
        zombie_wins: integer("zombie_wins"),

        self_destructs: jsonb("self_destructs").$type<NonNullable<Player["self_destructs"]>>(),
        distance_driven: jsonb("distance_driven").$type<NonNullable<Player["distance_driven"]>>(),
        distance_driven_count:
            jsonb("distance_driven_count").$type<NonNullable<Player["distance_driven_count"]>>(),
        kills_per_vehicle:
            jsonb("kills_per_vehicle").$type<NonNullable<Player["kills_per_vehicle"]>>(),

        shots_fired_unzoomed:
            jsonb("shots_fired_unzoomed").$type<NonNullable<Player["shots_fired_unzoomed"]>>(),
        shots_fired_zoomed:
            jsonb("shots_fired_zoomed").$type<NonNullable<Player["shots_fired_zoomed"]>>(),
        shots_hit_unzoomed:
            jsonb("shots_hit_unzoomed").$type<NonNullable<Player["shots_hit_unzoomed"]>>(),
        shots_hit_zoomed:
            jsonb("shots_hit_zoomed").$type<NonNullable<Player["shots_hit_zoomed"]>>(),
        damage_dealt: jsonb("damage_dealt").$type<NonNullable<Player["damage_dealt"]>>(),
        damage_received: jsonb("damage_received").$type<NonNullable<Player["damage_received"]>>(),
        most_kills_between_deaths: jsonb("most_kills_between_deaths").$type<
            NonNullable<Player["most_kills_between_deaths"]>
        >(),
        most_kills_in_round:
            jsonb("most_kills_in_round").$type<NonNullable<Player["most_kills_in_round"]>>(),
        kills_per_weapon:
            jsonb("kills_per_weapon").$type<NonNullable<Player["kills_per_weapon"]>>(),
        deaths: jsonb("deaths").$type<NonNullable<Player["deaths"]>>(),
        headshots: jsonb("headshots").$type<NonNullable<Player["headshots"]>>(),
        longest_kill: jsonb("longest_kill").$type<NonNullable<Player["longest_kill"]>>(),

        guest: boolean("guest"),
        banned: boolean("banned"),
        steam: boolean("steam"),

        time: integer("time"),
        joinTime: integer("joinTime"),
        ping_time: integer("ping_time"),
        ping_time_count: integer("ping_time_count"),
        frame_rate: doublePrecision("frame_rate"),
        frame_rate_count: integer("frame_rate_count"),
        time_alive_count: integer("time_alive_count"),
        time_alive_longest: doublePrecision("time_alive_longest"),
        time_alive: doublePrecision("time_alive"),
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

/**
 * All `jsonb` columns need to be added here.
 */
const playerJsonColumnsSchema = playerSchema.pick({
    wins: true,
    losses: true,
    self_destructs: true,
    distance_driven: true,
    distance_driven_count: true,
    kills_per_vehicle: true,
    shots_fired_unzoomed: true,
    shots_fired_zoomed: true,
    shots_hit_unzoomed: true,
    shots_hit_zoomed: true,
    damage_dealt: true,
    damage_received: true,
    most_kills_between_deaths: true,
    most_kills_in_round: true,
    kills_per_weapon: true,
    deaths: true,
    headshots: true,
    longest_kill: true,
})

export const playerInsertSchema = createInsertSchema(players).extend(playerJsonColumnsSchema.shape)
export type PlayerInsert = typeof players.$inferInsert

export const playerSelectSchema = createSelectSchema(players).extend(playerJsonColumnsSchema.shape)
export type PlayerSelect = typeof players.$inferSelect
