import { TRPCError } from "@trpc/server"
import { getPlayer } from "@warbrokers/fetch/src/players/getPlayer"
import { FailReason } from "@warbrokers/fetch/src/util/types"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { reason2TRPCError } from "@/errors"
import { env } from "@/index"
import { publicProcedure } from "@/trpc"

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
        .input(z.object({ uid: z.string() }))
        .output(PlayerSchema)
        .query(async ({ input }) => {
            const { uid } = input

            const res = await getPlayer(
                {
                    id: env.WB_DB_ID,
                    pw: env.WB_DB_PW,
                    base: env.WB_DB_BASE,
                },
                uid,
            )

            if (!res.success) {
                if (res.reason === FailReason.DBConnectionFail)
                    throw new TRPCError({
                        code: "BAD_REQUEST",
                        message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                    })

                throw reason2TRPCError(res.reason)
            }

            return res.data
        })
