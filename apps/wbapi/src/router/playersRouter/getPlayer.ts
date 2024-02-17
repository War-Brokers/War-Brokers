import { TRPCError } from "@trpc/server"
import { getPlayer } from "@warbrokers/fetch/src/players/getPlayer"
import { FailReason } from "@warbrokers/fetch/src/util/types"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import env from "@/env"
import { reason2TRPCError } from "@/errors"
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
                    id: env.wb.id.value(),
                    pw: env.wb.pw.value(),
                    ip: env.wb.ip_db.value(),
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
