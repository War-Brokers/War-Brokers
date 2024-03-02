import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { FailReason, type Result } from "@/types"

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
        .input(z.object({ query: z.string() }))
        .output(responseSchema)
        .query(async ({ input }) => {
            const { query } = input

            const res = await searchPlayerByName(query)

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })

export async function searchPlayerByName(
    name: string,
): Promise<Result<Response>> {
    const res = await fetch(
        `https://stats.warbrokers.io/players/search?term=${name.toLowerCase()}`,
    )

    const schema = z.array(
        z.tuple([playerSchema.shape.nick, playerSchema.shape.uid]),
    )

    const parseResult = schema.safeParse(await res.json())
    if (!parseResult.success)
        return { success: false, reason: FailReason.SchemaValidationFail }

    const result: Response = []
    for (const data of parseResult.data) {
        result.push({
            nick: data[0],
            uid: data[1],
        })
    }

    return { success: true, data: result }
}
