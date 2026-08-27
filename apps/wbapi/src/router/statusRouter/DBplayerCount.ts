import { z } from "zod"

import { db } from "@/index"
import { publicProcedure } from "@/trpc"
import {
    getDailyBattleRoyaleWinsPlayerCount,
    getDailyClassicModeWinsPlayerCount,
    getDailyKillsPlayerCount,
} from "@/wbdb"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/dbPlayerCount",
                description: "Gets the total number of players in WBAPI DB",
                tags: [tag],
            },
        })
        .input(
            z
                .object({
                    statistic: z.enum([
                        "timeAlive",
                        "dailyKills",
                        "dailyClassicModeWins",
                        "dailyBattleRoyaleWins",
                    ]),
                })
                .optional(),
        )
        .output(z.number())
        .query(({ input }) => {
            switch (input?.statistic) {
                case undefined:
                    return db.getDBPlayerCount()
                case "timeAlive":
                    return db.getDBPlayerCount("time_alive")
                case "dailyKills":
                    return getDailyKillsPlayerCount()
                case "dailyClassicModeWins":
                    return getDailyClassicModeWinsPlayerCount()
                case "dailyBattleRoyaleWins":
                    return getDailyBattleRoyaleWinsPlayerCount()
            }
        })
