import { z } from "zod"

import { publicProcedure } from "@/trpc"
import { getDailyBattleRoyaleWinsRanking } from "@/wbdb"

import { rankingInput } from "."

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/ranking/dailyBattleRoyaleWins",
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
                    dailyBattleRoyaleWins: z.number().int().positive(),
                }),
            ),
        )
        .query(({ input }) => getDailyBattleRoyaleWinsRanking(input.limit, input.offset ?? 0))
