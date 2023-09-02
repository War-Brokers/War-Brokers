import { TRPCError } from "@trpc/server"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { info } from "firebase-functions/logger"
import { z } from "zod"

import { publicProcedure } from "@/trpc"
import cachePlayer from "@/upstash/cachePlayer"
import { getPlayer } from "@/wbFetch"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/getPlayer",
                description: "Retrieves player data",
                tags: [tag],
            },
        })
        .input(
            z.object({
                uid: z.string(),
            }),
        )
        .output(PlayerSchema)
        .query(async ({ input }) => {
            const { uid } = input

            info(`attempting to fetch user info. UID: ${uid}`)

            const res = await getPlayer(uid)
            if (!res.ok)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                })

            const parseResult = PlayerSchema.safeParse(await res.json())
            if (!parseResult.success)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to process data. ${parseResult.error}`,
                })

            cachePlayer(parseResult.data)
            return parseResult.data
        })
