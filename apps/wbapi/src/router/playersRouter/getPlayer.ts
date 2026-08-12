import type { Player } from "@warbrokers/types/src/player"
import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import { env } from "@/env"
import { PlayerNotFoundTRPCError, reason2TRPCError } from "@/errors"
import { fetchUpstream } from "@/fetch"
import { db } from "@/index"
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
                if (res.reason === FailReason.PlayerNotFound) throw PlayerNotFoundTRPCError(uid)
                throw reason2TRPCError(res.reason)
            }

            const player = res.data

            void db.setPlayer(player).catch((error: unknown) => {
                console.error(`[db-error] failed to cache player ${player.uid}`, error)
            })

            return player
        })

export async function getPlayer(uid: Player["uid"]): Promise<Result<Player>> {
    let res: Response
    try {
        res = await fetchUpstream(`${env.WB_DB_BASE}/get_player_stats.php?uid=${uid}`, {
            headers: {
                Authorization:
                    "Basic " + Buffer.from(`${env.WB_DB_ID}:${env.WB_DB_PW}`).toString("base64"),
            },
        })
    } catch (error) {
        console.error(`failed to get player stats of ${uid}`, error)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        }
    }

    let responseBody: string
    try {
        responseBody = await res.text()
    } catch (error) {
        console.error(`failed to read player stats of ${uid}`, error)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        }
    }

    if (!res.ok) {
        console.error(`failed to get player stats of ${uid}. DB responded: "${responseBody}"`)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        }
    }

    if (res.status === 200 && responseBody === `No data for player: ${uid}`) {
        return {
            success: false,
            reason: FailReason.PlayerNotFound,
        }
    }

    let raw: unknown
    try {
        raw = JSON.parse(responseBody)
    } catch (e) {
        console.error(
            `/players/getPlayer?uid=${uid} failed to retrieve data from DB.
raw:
${responseBody}

error:`,
            e,
        )

        return {
            success: false,
            reason: FailReason.SchemaValidationFail,
        }
    }

    const rawRecordResult = z.record(z.unknown()).safeParse(raw)
    if (rawRecordResult.success) {
        const rawRecord = rawRecordResult.data

        // The upstream API serializes these some numerical stats as strings and omits
        // some values entirely. This fixes that.

        // this check works on both null and undefined values because JS
        if (rawRecord["time_alive_longest"] != null)
            rawRecord["time_alive_longest"] = Number(rawRecord["time_alive_longest"])

        for (const field of ["most_kills_in_round", "most_kills_between_deaths", "longest_kill"]) {
            if (!rawRecord[field]) continue
            if (
                typeof rawRecord[field] === "object" &&
                Object.entries(rawRecord[field]).length <= 0
            )
                continue

            rawRecord[field] = Object.fromEntries(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
                Object.entries(rawRecord[field] as Record<string, string>).map(
                    ([weapon, value]) => [weapon, Number(value)],
                ),
            )
        }

        const nick = rawRecord["nick"]
        if (!rawRecord["nicklower"] && typeof nick === "string")
            rawRecord["nicklower"] = nick.toLocaleLowerCase()

        if (rawRecord["squad"] === "") rawRecord["squad"] = null

        raw = rawRecord
    }

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
