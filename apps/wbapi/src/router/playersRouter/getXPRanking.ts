import { z } from "zod"

import { getXPRanking } from "@/db"
import { publicProcedure } from "@/trpc"

import { rankingInput } from "."

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/getXPRanking",
                tags: [tag],
            },
        })
        .input(rankingInput)
        .output(
            z.array(
                z.object({
                    uid: z.string(),
                    nick: z.string(),
                    xp: z.number(),
                    level: z.number(),
                }),
            ),
        )
        .query(async ({ input }) => {
            const { limit, offset } = input
            return await getXPRanking(limit, offset || 0)
        })
