import { TRPCError } from "@trpc/server"
import { PlayerSchema } from "@warbrokers/types/src/player"
import fetch from "node-fetch"
import { z } from "zod"

import { publicProcedure } from "@/trpc"

const searchSchema = z.array(
    z.tuple([PlayerSchema.shape.nick, PlayerSchema.shape.uid]),
)

const apiResponseSchema = z.array(
    z.object({
        nick: PlayerSchema.shape.nick,
        uid: PlayerSchema.shape.uid,
    }),
)

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/searchByName",
                description: "Search players by their name",
                tags: [tag],
            },
        })
        .input(
            z.object({
                query: z.string(),
            }),
        )
        .output(apiResponseSchema)
        .query(async ({ input }) => {
            const { query } = input

            const raw = await fetch(
                `https://stats.warbrokers.io/players/search?term=${query}`,
            )

            const a = await raw.json()
            console.log(a, JSON.stringify(a))
            const parseResult = searchSchema.safeParse(a)
            if (!parseResult.success)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to search '${query}'`,
                })

            const result: z.infer<typeof apiResponseSchema> = []
            for (const data of parseResult.data) {
                result.push({
                    nick: data[0],
                    uid: data[1],
                })
            }

            return result
        })
