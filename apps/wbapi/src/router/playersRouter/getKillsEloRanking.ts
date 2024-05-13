import { z } from "zod"

import { getKillsEloRanking } from "@/db"
import { publicProcedure } from "@/trpc"

import { rankingInput } from "."

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/getKillsEloRanking",
                tags: [tag],
            },
        })
        .input(rankingInput)
        .output(
            z.array(
                z.object({
                    uid: z.string(),
                    nick: z.string(),
                    killsELO: z.number(),
                }),
            ),
        )
        .query(async ({ input }) => {
            const { limit, offset } = input
            return await getKillsEloRanking(limit, offset || 0)
        })
