import {
    responseSchema,
    serverList,
} from "@warbrokers/fetch/src/status/serverList"
import { regionSchema } from "@warbrokers/types/src/region"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/status/serverList",
                description: `Gets a list of War Brokers game servers.

Valid inputs: USA, USA_WEST, ASIA, AUSTRALIA, EUROPE, INDIA, JAPAN, RUSSIA, USA_CLAN, USA_CLAN_WEST, AS_BATTLE_ROYALE, AU_BATTLE_ROYALE, EU_BATTLE_ROYALE, NA_BATTLE_ROYALE, NA_COMPETITIVE_TESTING`,
                tags: [tag],
            },
        })
        .input(z.object({ region: regionSchema }))
        .output(responseSchema)
        .query(async ({ input }) => {
            const { region } = input

            const res = await serverList(region)

            if (!res.success) throw reason2TRPCError(res.reason)

            return res.data
        })
