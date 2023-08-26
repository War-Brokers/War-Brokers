import { TRPCError } from "@trpc/server"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { firestore } from "firebase-admin"
import { info } from "firebase-functions/logger"
import { z } from "zod"

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

            info(`attempting to fetch user info. UID: ${uid}`)

            const doc = await firestore().collection("players").doc(uid).get()
            const parseResult = PlayerSchema.safeParse(doc.data())

            if (!parseResult.success)
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: `Player with UID "${uid}" was not found. Is the UID valid?`,
                })

            return parseResult.data
        })
