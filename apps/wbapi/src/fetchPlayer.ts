import type { Player } from "@warbrokers/types/src/player"
import { playerSchema } from "@warbrokers/types/src/player"
import { z } from "zod"

import type { Result } from "@/types"
import { FailReason } from "@/types"
import { fetchPlayerStats } from "@/wbdb"

async function readPlayerResponse(uid: Player["uid"]) {
    let response: Response
    try {
        response = await fetchPlayerStats(uid)
    } catch (error) {
        console.error(`failed to get player stats of ${uid}`, error)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        } as const
    }

    let body: string
    try {
        body = await response.text()
    } catch (error) {
        console.error(`failed to read player stats of ${uid}`, error)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        } as const
    }

    return {
        success: true,
        data: { response, body },
    } as const
}

function isMissingPlayerResponse(uid: Player["uid"], response: Response, body: string) {
    return (
        response.status === 200 &&
        (body === `No data for player: ${uid}` || body === "Error! Cannot find record")
    )
}

function normalizePlayerRecord(raw: unknown) {
    const rawRecordResult = z.record(z.unknown()).safeParse(raw)
    if (!rawRecordResult.success) return raw

    const rawRecord = rawRecordResult.data

    // The upstream API serializes these some numerical stats as strings and omits
    // some values entirely. This fixes that.

    // this check works on both null and undefined values because JS
    if (rawRecord["time_alive_longest"] != null)
        rawRecord["time_alive_longest"] = Number(rawRecord["time_alive_longest"])

    for (const field of ["most_kills_in_round", "most_kills_between_deaths", "longest_kill"]) {
        if (!rawRecord[field]) continue
        if (typeof rawRecord[field] === "object" && Object.entries(rawRecord[field]).length <= 0)
            continue

        rawRecord[field] = Object.fromEntries(
            // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
            Object.entries(rawRecord[field] as Record<string, string>).map(([weapon, value]) => [
                weapon,
                Number(value),
            ]),
        )
    }

    const nick = rawRecord["nick"]
    if (!rawRecord["nicklower"] && typeof nick === "string")
        rawRecord["nicklower"] = nick.toLocaleLowerCase()

    if (rawRecord["squad"] === "") rawRecord["squad"] = null

    return rawRecord
}

function parsePlayerBody(uid: Player["uid"], responseBody: string) {
    let raw: unknown
    try {
        raw = JSON.parse(responseBody)
    } catch (error) {
        console.error(
            `/players/getPlayer?uid=${uid} failed to retrieve data from DB.
raw:
${responseBody}

error:`,
            error,
        )

        return {
            success: false,
            reason: FailReason.SchemaValidationFail,
        } as const
    }

    return {
        success: true,
        data: normalizePlayerRecord(raw),
    } as const
}

export async function fetchPlayer(uid: Player["uid"]): Promise<Result<Player>> {
    const responseResult = await readPlayerResponse(uid)
    if (!responseResult.success) return responseResult

    const { response, body } = responseResult.data
    if (!response.ok) {
        console.error(`failed to get player stats of ${uid}. DB responded: "${body}"`)
        return {
            success: false,
            reason: FailReason.WBDBConnectionFail,
        }
    }

    if (isMissingPlayerResponse(uid, response, body)) {
        return {
            success: false,
            reason: FailReason.PlayerNotFound,
        }
    }

    const rawResult = parsePlayerBody(uid, body)
    if (!rawResult.success) return rawResult

    const parseResult = playerSchema.safeParse(rawResult.data)
    if (!parseResult.success) {
        console.error(
            `/players/getPlayer?uid=${uid} failed to validate player data.
raw:
${JSON.stringify(rawResult.data, null, 2)}

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
