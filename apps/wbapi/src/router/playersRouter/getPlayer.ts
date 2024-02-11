import { TRPCError } from "@trpc/server"
import { PlayerSchema } from "@warbrokers/types/src/player"
import { debug } from "firebase-functions/logger"
import { z } from "zod"
import { generateErrorMessage } from "zod-error"

import { publicProcedure } from "@/trpc"
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

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw: any = await res.json()

            // also handles undefined values because null == undefined is true in JS
            if (raw["time_alive_longest"] != null)
                raw["time_alive_longest"] = Number(raw["time_alive_longest"])

            const parseResult = PlayerSchema.safeParse(raw)
            if (!parseResult.success) {
                debug(raw)
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    // https://github.com/andrewvo89/zod-error?tab=readme-ov-file#generateerrormessageissues-zzodissue-options-errormessageoptions-string
                    message: `Failed to process data. ${generateErrorMessage(
                        parseResult.error.issues,
                        {
                            delimiter: { error: " 🔥 " },
                            transform: ({ errorMessage, index }) =>
                                `Error #${index + 1}: ${errorMessage}`,
                        },
                    )}`,
                })
            }

            return parseResult.data
        })
