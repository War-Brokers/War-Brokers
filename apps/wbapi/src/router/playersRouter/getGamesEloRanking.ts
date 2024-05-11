import { z } from "zod"

import { getGamesEloRanking } from "@/db"
import { publicProcedure } from "@/trpc"

import { rankingInput } from "."

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/getGamesEloRanking",
                tags: [tag],
            },
        })
        .input(rankingInput)
        .output(
            z.array(
                z.object({
                    uid: z.string(),
                    nick: z.string(),
                    gamesELO: z.number().nullable(),
                }),
            ),
        )
        .query(async ({ input }) => {
            const { limit, offset } = input
            return await getGamesEloRanking(limit, offset || 0)
        })
