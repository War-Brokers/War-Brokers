import { z } from "zod"

import { getPercentile } from "@/db"
import { PlayerNotFoundTRPCError, reason2TRPCError } from "@/errors"
import { publicProcedure } from "@/trpc"
import { FailReason } from "@/types"

export default (tag: string) =>
    publicProcedure
        .meta({
            openapi: {
                method: "GET",
                path: "/players/killsEloPercentile",
                description: "Retrieves percentile of player's kills Elo",
                tags: [tag],
            },
        })
        .input(z.object({ uid: z.string() }))
        .output(z.number())
        .query(async ({ input }) => {
            const { uid } = input

            const res = await getPercentile("killsELO", uid)

            if (!res.success) {
                if (res.reason === FailReason.PlayerNotFound)
                    throw PlayerNotFoundTRPCError(uid)

                throw reason2TRPCError(res.reason)
            }

            return res.data
        })
