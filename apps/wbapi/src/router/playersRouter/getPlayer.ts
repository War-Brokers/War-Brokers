import type { Player } from "@warbrokers/types/src/player"
import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { PlayerNotFoundTRPCError, reason2TRPCError } from "@/errors"
import { db, env } from "@/index"
import { uid } from "@/querySchema"
import { publicProcedure } from "@/trpc"
import type { Result } from "@/types"
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

            const res = await getPlayer(uid)

            if (!res.success) {
                if (res.reason === FailReason.WBDBConnectionFail)
                    throw PlayerNotFoundTRPCError(uid)
                throw reason2TRPCError(res.reason)
            }

            const player = res.data

            if (player.banned) {
                db.deletePlayer(player.uid)
                throw PlayerNotFoundTRPCError(uid)
            }

            db.setPlayer(player)

            return player
        })

export async function getPlayer(uid: Player["uid"]): Promise<Result<Player>> {
    const res = await fetch(
        `${env.WB_DB_BASE}/get_player_stats.php?uid=${uid}`,
        {
            headers: {
                Authorization:
                    "Basic " +
                    Buffer.from(`${env.WB_DB_ID}:${env.WB_DB_PW}`).toString(
                        "base64",
                    ),
            },
        },
    )

    if (!res.ok) {
        console.error(
            `failed to get player stats of ${uid}. DB responded: "${await res.text()}"`,
        )
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let raw: any
    const res2 = res.clone()
    try {
        raw = await res.json()
    } catch (e) {
        console.error(
            `/players/getPlayer?uid=${uid} failed to retrieve data from DB.
raw:
${await res2.text()}

error:`,
            e,
        )

        return {
            success: false,
            reason: FailReason.SchemaValidationFail,
        }
    }

    // this check works on both null and undefined values because JS
    if (raw["time_alive_longest"] != null)
        raw["time_alive_longest"] = Number(raw["time_alive_longest"])

    if (raw["nicklower"] === null)
        raw["nicklower"] = raw["nick"].toLocaleLowerCase()

    const parseResult = playerSchema.safeParse(raw)
    if (!parseResult.success) {
        console.error(
            `/players/getPlayer?uid=${uid} failed to validate player data.
raw:
${JSON.stringify(raw, null, 2)}

error:`,
            parseResult.error,
        )
        return {
            success: false,
            reason: FailReason.SchemaValidationFail,
        }
    }

    return {
        success: true,
        data: parseResult.data,
    }
}
