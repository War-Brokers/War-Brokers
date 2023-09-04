import { TRPCError } from "@trpc/server"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { debug } from "firebase-functions/logger"
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

            const res = await getPlayer(uid)
            if (!res.ok)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                })

            const raw = await res.json()

            // also handles undefined values because null == undefined in JS
            if (raw["time_alive_longest"] != null)
                raw["time_alive_longest"] = Number(raw["time_alive_longest"])

            const parseResult = PlayerSchema.safeParse(raw)
            if (!parseResult.success) {
                debug(raw)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: `Failed to process data. ${parseResult.error}`,
                })
            }

            await cachePlayer(parseResult.data)
            return parseResult.data
        })
