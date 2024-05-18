import { z } from "zod"

import { db } from "@/index"
import { publicProcedure } from "@/trpc"

import { rankingInput } from "."

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/ranking/xp",
                tags,
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
            return await db.getXPRanking(limit, offset || 0)
        })
