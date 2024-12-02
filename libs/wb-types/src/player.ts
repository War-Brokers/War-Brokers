import z from "zod"

import { gameModeIDSchema } from "./gameMode"
import { weaponIDSchema } from "./weapon"

export const playerSchema = z.object({
    // Identity
    uid: z.string(),
    // currently, nicknames could only be 2~20 characters long, but there are
    // old accounts with nickname length outside this range.
    nick: z.string(),
    nicklower: z.string().describe("Lowercase player nickname").or(z.null()),

    // Core Stats
    level: z.number().int().gte(1),
    xp: z.number().int().gte(100),
    coins: z.number().int().or(z.null()),
    squad: z.string(),
    killsELO: z.number(),
    gamesELO: z.number(),

    // In-game stuff
    wins: z.record(gameModeIDSchema, z.number().int()).or(z.null()),
    losses: z.record(gameModeIDSchema, z.number().int()).or(z.null()),
    number_of_jumps: z.number().int().or(z.null()),
    // number_of_capture_points: z.number().int().gte(0),
    // scuds_launched: z.number().int().gte(0).or(z.null()),
    // self_destructs: z.record(vehicleSchema, z.number().int()).or(z.null()),
    // total_kills: z.number().int().gte(0),
    // kill_to_death_ratio: z.number(),
    // kills_per_minute: z.number(),
    zombie_kills: z.number().int().gte(0),
    zombie_deaths: z.number().int().gte(0),
    zombie_wins: z.number().int().gte(0),

    // Vehicle Stats
    // distance_driven: z.record(vehicleSchema, z.number()).or(z.null()),
    // distance_driven_count: z
    //     .record(vehicleSchema, z.number().int())
    //     .or(z.null()),
    // kills_per_vehicle: z.record(vehicleSchema, z.number().int()).or(z.null()),

    // Weapon Stats
    // shots_fired_unzoomed: z.record(weaponIDSchema, z.number().int()),
    // shots_fired_zoomed: z.record(weaponIDSchema, z.number().int()),

    // shots_hit_unzoomed: z.record(weaponIDSchema, z.number().int()),
    // shots_hit_zoomed: z.record(weaponIDSchema, z.number().int()),

    damage_dealt: z.record(weaponIDSchema, z.number()).or(z.null()),
    // damage_received: z.record(weaponIDSchema, z.number()),

    // most_kills_between_deaths: z.record(weaponIDSchema, z.number().int()),
    // most_kills_in_round: z.record(weaponIDSchema, z.number().int()),

    // kills_per_weapon: z.record(weaponIDSchema, z.number().int()),
    // deaths: z.record(weaponIDSchema, z.number().int()),
    // headshots: z.record(weaponIDSchema, z.number().int()),
    // longest_kill: z.record(weaponIDSchema, z.number()),

    // Flags
    // guest: z.boolean().optional(),
    banned: z
        .literal(false)
        .describe(
            "Whether the user is banned or not. Doesn't seem to be used. Is always false",
        ),
    steam: z.boolean().or(z.null()).optional(),

    // Time
    time: z.number().describe("UNIX timestamp of last session"),
    // join_date: z.string().describe("YY-MM-DD formatted date or 0"),
    // last_seen: z.string().describe("YY-MM-DD formatted date or 0"),
    joinTime: z
        .number()
        .int()
        .describe("UNIX timestamp of join date & time (could be 0)"),
    // ping_time: z.number().int().or(z.null()),
    // ping_time_count: z.number().int(),
    // frame_rate: z.number(),
    // frame_rate_count: z.number().int(),
    // time_alive_count: z.number().int().gte(0).or(z.null()),
    // time_alive_longest: z.number().or(z.null()),
    // time_alive: z.number().gte(0).or(z.null()),
    // zombie_time_alive_count: z.number().int().gte(0),
    // zombie_time_alive: z.number().gte(0),
})

export type Player = z.infer<typeof playerSchema>
