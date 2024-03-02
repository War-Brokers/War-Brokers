import { TRPCError } from "@trpc/server"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { getPercentile, RedisKey } from "@/redis"
import { publicProcedure } from "@/trpc"
import { FailReason } from "@/types"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/gamesEloPercentile",
                description: "Retrieves percentile of player's games Elo",
                tags: [tag],
            },
        })
        .input(z.object({ uid: z.string() }))
        .output(z.number())
        .query(async ({ input }) => {
            const { uid } = input

            const res = await getPercentile(RedisKey.GAMES_ELO, uid)

            if (!res.success) {
                if (res.reason === FailReason.RedisConnectionFail)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                    })

                throw reason2TRPCError(res.reason)
            }

            return res.data
        })
