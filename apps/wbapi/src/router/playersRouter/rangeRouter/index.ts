import { z } from "zod"

import type { StatRangeStatistic } from "@/db/getStatRange"
import { db } from "@/index"
import { createTRPCRouter, publicProcedure } from "@/trpc"
import {
    getDailyBattleRoyaleWinsRange,
    getDailyClassicModeWinsRange,
    getDailyKillsRange,
} from "@/wbdb"

export const tag = "range"

const statisticLabels = {
    dailyBattleRoyaleWins: "daily Battle Royale wins",
    dailyClassicModeWins: "daily Classic Mode wins",
    dailyKills: "daily kills",
    gamesElo: "games Elo",
    killsElo: "kills Elo",
    level: "level",
    timeAlive: "time alive",
    xp: "XP",
} as const satisfies Record<
    StatRangeStatistic | "dailyBattleRoyaleWins" | "dailyClassicModeWins" | "dailyKills",
    string
>

type RangeStatistic = keyof typeof statisticLabels

const statRange = z.object({ min: z.number(), max: z.number() })

function getRange(statistic: RangeStatistic) {
    if (statistic === "dailyBattleRoyaleWins") return getDailyBattleRoyaleWinsRange()
    if (statistic === "dailyClassicModeWins") return getDailyClassicModeWinsRange()
    if (statistic === "dailyKills") return getDailyKillsRange()
    return db.getStatRange(statistic)
}

const rangeProcedure = (statistic: RangeStatistic, tags: string[]) =>
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
        .query(async () => await getRange(statistic))

export default (parentTag: string) =>
    createTRPCRouter({
        dailyBattleRoyaleWins: rangeProcedure("dailyBattleRoyaleWins", [parentTag, tag]),
        dailyClassicModeWins: rangeProcedure("dailyClassicModeWins", [parentTag, tag]),
        dailyKills: rangeProcedure("dailyKills", [parentTag, tag]),
        gamesElo: rangeProcedure("gamesElo", [parentTag, tag]),
        killsElo: rangeProcedure("killsElo", [parentTag, tag]),
        level: rangeProcedure("level", [parentTag, tag]),
        timeAlive: rangeProcedure("timeAlive", [parentTag, tag]),
        xp: rangeProcedure("xp", [parentTag, tag]),
    })
