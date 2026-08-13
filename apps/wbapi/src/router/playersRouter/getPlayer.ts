import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { PlayerNotFoundTRPCError, reason2TRPCError } from "@/errors"
import { fetchPlayer } from "@/fetchPlayer"
import { db } from "@/index"
import { uid } from "@/querySchema"
import { publicProcedure } from "@/trpc"
import { FailReason } from "@/types"

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
        .input(z.object({ uid }))
        .output(playerSchema)
        .query(async ({ input }) => {
            const { uid } = input

            const res = await fetchPlayer(uid)

            if (!res.success) {
                if (res.reason === FailReason.PlayerNotFound) throw PlayerNotFoundTRPCError(uid)
                throw reason2TRPCError(res.reason)
            }

            const player = res.data

            void db.setPlayer(player).catch((error: unknown) => {
                console.error(`[db-error] failed to cache player ${player.uid}`, error)
            })

            return player
        })
