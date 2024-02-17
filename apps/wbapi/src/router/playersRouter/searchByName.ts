import {
    responseSchema,
    searchPlayerByName,
} from "@warbrokers/fetch/src/players/searchByName"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"

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
