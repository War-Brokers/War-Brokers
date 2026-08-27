import { z } from "zod"

import { publicProcedure } from "@/trpc"
import { getDailyClassicModeWinsRanking } from "@/wbdb"

import { rankingInput } from "."

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/ranking/dailyClassicModeWins",
                tags,
            },
        })
        .input(rankingInput)
        .output(
            z.array(
                z.object({
                    uid: z.string(),
                    nick: z.string(),
                    squad: z.string().nullable(),
                    dailyClassicModeWins: z.number().int().positive(),
                }),
            ),
        )
        .query(({ input }) => getDailyClassicModeWinsRanking(input.limit, input.offset ?? 0))
