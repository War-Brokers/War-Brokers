import { z } from "zod"

import type { StatRangeStatistic } from "@/db/getStatRange"
import { db } from "@/index"
import { createTRPCRouter, publicProcedure } from "@/trpc"

export const tag = "range"

const statisticLabels = {
    gamesElo: "games Elo",
    killsElo: "kills Elo",
    level: "level",
    timeAlive: "time alive",
    xp: "XP",
} as const satisfies Record<StatRangeStatistic, string>

const statRange = z.object({ min: z.number(), max: z.number() })

const rangeProcedure = (statistic: StatRangeStatistic, tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: `/players/range/${statistic}`,
                description: `Gets the range of player's ${statisticLabels[statistic]}`,
                tags,
            },
        })
        .input(z.undefined())
        .output(statRange)
        .query(async () => await db.getStatRange(statistic))

export default (parentTag: string) =>
    createTRPCRouter({
        gamesElo: rangeProcedure("gamesElo", [parentTag, tag]),
        killsElo: rangeProcedure("killsElo", [parentTag, tag]),
        level: rangeProcedure("level", [parentTag, tag]),
        timeAlive: rangeProcedure("timeAlive", [parentTag, tag]),
        xp: rangeProcedure("xp", [parentTag, tag]),
    })
