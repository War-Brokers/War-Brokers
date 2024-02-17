import {
    responseSchema,
    twitchStreamCount,
} from "@warbrokers/fetch/src/status/twitchStreamCount"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/twitchStreams",
                description:
                    "Gets a list of all available War Brokers twitch streams",
                tags: [tag],
            },
        })
        .input(z.undefined())
        .output(responseSchema)
        .query(async () => {
            const res = await twitchStreamCount()

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })
