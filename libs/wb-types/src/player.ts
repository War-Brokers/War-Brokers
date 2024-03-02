import z from "zod"

import { GameModeIDSchema } from "./gameMode"
import { WeaponIDSchema } from "./weapon"

export const PlayerSchema = z.object({
    // Core
    uid: z.string(),
    // currently, nicknames could only be 2~20 characters long, but there are
    // old accounts with nickname length outside this range.
    nick: z.string(),
    nicklower: z.string().describe("Lowercase player nickname"),
    level: z.number().int().gte(1),
    xp: z.number().int().gte(100),
    squad: z.string(),
    killsELO: z.number(),
    gamesELO: z.number(),

    // Miscellaneous Stats
    coins: z.number().int().or(z.null()),
    number_of_jumps: z.number().int().or(z.null()),

    // Match Results
    losses: z.record(GameModeIDSchema, z.number().int()).or(z.null()),
    zombie_deaths: z.number().int().gte(0),
    zombie_kills: z.number().int().gte(0),
    zombie_wins: z.number().int().gte(0),

    // Damages
    damage_dealt: z.record(WeaponIDSchema, z.number()).or(z.null()),

    // Flags
    banned: z
        .literal(false)
        .describe(
            "Whether the user is banned or not. Doesn't seem to be used. Is always false",
        ),
    steam: z.boolean().optional(),

    // Time
    time: z.number().describe("UNIX timestamp of last session"),
    joinTime: z
        .number()
        .int()
        .describe("UNIX timestamp of join date & time (could be 0)"),
    ping_time: z.number().int().or(z.null()),
    time_alive_count: z.number().int().gte(0).or(z.null()),
    time_alive_longest: z.number().or(z.null()),
    time_alive: z.number().gte(0).or(z.null()),
    zombie_time_alive_count: z.number().int().gte(0),
    zombie_time_alive: z.number().gte(0),
})

export type Player = z.infer<typeof PlayerSchema>
