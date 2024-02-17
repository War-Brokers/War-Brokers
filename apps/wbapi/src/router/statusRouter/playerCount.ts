import {
    playerCount,
    responseSchema,
} from "@warbrokers/fetch/src/status/playerCount"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/playerCount",
                description: "Gets the total number of registered accounts",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            const res = await playerCount()

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })
