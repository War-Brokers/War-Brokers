import { z } from "zod"

import { PlayerNotFoundTRPCError, reason2TRPCError } from "@/errors"
import { db } from "@/index"
import { uid } from "@/querySchema"
import { publicProcedure } from "@/trpc"
import { FailReason } from "@/types"

export default (tags: string[]) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/percentile/xp",
                description: "Retrieves percentile of player's XP",
                tags,
            },
        })
        .input(z.object({ uid }))
        .output(z.number())
        .query(async ({ input }) => {
            const { uid } = input

            const res = await db.getPercentile("xp", uid)

            if (!res.success) {
                if (res.reason === FailReason.PlayerNotFound)
                    throw PlayerNotFoundTRPCError(uid)

                console.error(
                    `/players/percentile/xp?uid=${uid} failed: ${res.reason}`,
                )
                throw reason2TRPCError(res.reason)
            }

            return res.data
        })
