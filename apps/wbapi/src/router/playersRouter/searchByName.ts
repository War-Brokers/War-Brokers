import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { searchPlayerByName } from "@/db"
import { nick } from "@/querySchema"
import { publicProcedure } from "@/trpc"

export const responseSchema = z.array(
    z.object({
        nick: playerSchema.shape.nick,
        uid: playerSchema.shape.uid,
    }),
)

export type Response = z.infer<typeof responseSchema>

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/searchByName",
                description:
                    "Search players by their name. It is recommended that the usernames are sanitized before getting shown in a webpage.",
                tags: [tag],
            },
        })
        .input(z.object({ query: nick }))
        .output(responseSchema)
        .query(async ({ input }) => {
            const { query } = input

            return await searchPlayerByName(query)
        })
