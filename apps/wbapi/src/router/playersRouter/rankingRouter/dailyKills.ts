import { z } from "zod"

import { publicProcedure } from "@/trpc"
import { getDailyKillsRanking } from "@/wbdb"

import { rankingInput } from "."

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/ranking/dailyKills",
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
                    dailyKills: z.number().int().positive(),
                }),
            ),
        )
        .query(({ input }) => getDailyKillsRanking(input.limit, input.offset ?? 0))
