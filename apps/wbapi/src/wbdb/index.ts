import { Readable } from "node:stream"
import type { ReadableStream as NodeReadableStream } from "node:stream/web"

import type { Player } from "@warbrokers/types/src/player"
import { parse } from "csv-parse"
import { z } from "zod"

import { createCache } from "@/cache"
import { db } from "@/db/client"
import { env } from "@/env"
import { fetchUpstream, upstreamTimeoutMs } from "@/fetch"
import { fetchPlayer } from "@/fetchPlayer"

const DAILY_CACHE_TIME = 10 * 60 * 1000 // 10 minutes in milliseconds
const DAILY_FETCH_TIMEOUT = 60 * 1000 // 1 minute in millisecond

type DailyStats = {
    response: Response
    sourceUpdatedAt: number
}

function fetchWBDB(path: string, timeoutMs = upstreamTimeoutMs) {
    return fetchUpstream(
        `${env.WB_DB_BASE}${path}`,
        {
            headers: {
                Authorization:
                    "Basic " + Buffer.from(`${env.WB_DB_ID}:${env.WB_DB_PW}`).toString("base64"),
            },
        },
        timeoutMs,
    )
}

export function fetchPlayerStats(uid: Player["uid"]) {
    return fetchWBDB(`/get_player_stats.php?uid=${uid}`)
}

async function getDailyPlayerUIDs(response: Response) {
    if (response.body === null) throw new Error("Daily stats response has no body")

    const source = Readable.fromWeb(
        // Node and fetch expose equivalent streams with incompatible library types.
        // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion
        response.body as unknown as NodeReadableStream,
    )

    const parser = source.pipe(
        parse({
            columns: (columns) => columns.map((column) => (column === "uid" ? column : undefined)),
            skip_empty_lines: true,
        }),
    )

    source.on("error", (error) => parser.destroy(error))

    const uids = new Set<string>()
    const rowSchema = z.record(z.string())

    for await (const parsed of parser) {
        const rowResult = rowSchema.safeParse(parsed)
        if (!rowResult.success) continue
        const uid = rowResult.data["uid"]
        if (uid) uids.add(uid)
    }

    return [...uids]
}

async function cacheMissingPlayers(response: Response) {
    try {
        const uids = await getDailyPlayerUIDs(response)
        const existingUIDs = new Set(await db.getKnownPlayerUIDs(uids))

        for (const uid of uids) {
            if (existingUIDs.has(uid)) continue

            try {
                const result = await fetchPlayer(uid)
                if (!result.success) {
                    console.error(
                        `[daily-stats-player-error] failed to cache player ${uid}: ${result.reason}`,
                    )
                    continue
                }

                await db.setPlayer(result.data)
                existingUIDs.add(uid)
            } catch (error) {
                console.error(`[daily-stats-player-error] failed to cache player ${uid}`, error)
            }
        }
    } catch (error) {
        console.error("[daily-stats-player-cache-error] failed to process daily stats", error)
    }
}

const dailyStatsCache = createCache(
    "daily-stats",
    async (cachedValue: DailyStats | undefined) => {
        const latestTimeResponse = await fetchWBDB("/get_latest_time.php")
        if (!latestTimeResponse.ok)
            throw new Error(
                `Latest daily time request failed with status ${latestTimeResponse.status}`,
            )

        const sourceUpdatedAt = Number((await latestTimeResponse.text()).trim())
        if (!Number.isSafeInteger(sourceUpdatedAt) || sourceUpdatedAt < 0)
            throw new Error("Latest daily time response was invalid")

        if (cachedValue !== undefined && sourceUpdatedAt <= cachedValue.sourceUpdatedAt)
            return cachedValue

        const response = await fetchWBDB("/latest_daily.txt", DAILY_FETCH_TIMEOUT)
        if (response.ok) void cacheMissingPlayers(response.clone())

        return {
            response,
            sourceUpdatedAt,
        }
    },
    {
        cacheTimeMs: DAILY_CACHE_TIME,
        allowStale: true,
        refreshWhenStale: true,
        isCacheable: ({ response }) => response.ok,
    },
)

export async function fetchDailyStats() {
    const { value } = await dailyStatsCache.get()
    return value.response.clone()
}

export async function getDailyStatsUpdatedAt() {
    const { value } = await dailyStatsCache.get()
    return value.sourceUpdatedAt
}

export { getDailyKillsPlayerCount, getDailyKillsRange, getDailyKillsRanking } from "./dailyKills"
