import { TRPCError } from "@trpc/server"
import { getPlayer } from "@warbrokers/fetch/src/player"
import { FailReason } from "@warbrokers/fetch/src/types"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import env from "@/env"
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
        .input(
            z.object({
                uid: z.string(),
            }),
        )
        .output(PlayerSchema)
        .query(async ({ input }) => {
            const { uid } = input

            const res = await getPlayer(
                {
                    id: env.wb.id.value(),
                    pw: env.wb.pw.value(),
                    ip: env.wb.ip.value(),
                },
                uid,
            )

            if (!res.success)
                switch (res.reason) {
                    case FailReason.RequestFailed:
                        throw new TRPCError({
                            code: "BAD_REQUEST",
                            message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                        })
                    case FailReason.InvalidType:
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message:
                                "Schema validation failure. Please tell the developers about it.",
                        })
                    default:
                        throw new TRPCError({
                            code: "INTERNAL_SERVER_ERROR",
                            message:
                                "An unknown error occurred. Please tell the developers about it.",
                        })
                }

            return res.data
        })
