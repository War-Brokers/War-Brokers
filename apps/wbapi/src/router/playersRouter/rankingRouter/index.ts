import { z } from "zod"

import { createTRPCRouter } from "@/trpc"

import dailyKills from "./dailyKills"
import dailyStatsUpdatedAt from "./dailyStatsUpdatedAt"
import gamesElo from "./gamesElo"
import killsElo from "./killsElo"
import timeAlive from "./timeAlive"
import xp from "./xp"

export const tag = "ranking"

export const rankingInput = z.object({
    limit: z.number().min(3).max(100),
    offset: z.number().nonnegative().optional(),
})

export default (parentTag: string) =>
    createTRPCRouter({
        dailyKills: dailyKills([parentTag, tag]),
        dailyStatsUpdatedAt: dailyStatsUpdatedAt([parentTag, tag]),
        killsElo: killsElo([parentTag, tag]),
        gamesElo: gamesElo([parentTag, tag]),
        timeAlive: timeAlive([parentTag, tag]),
        xp: xp([parentTag, tag]),
    })
