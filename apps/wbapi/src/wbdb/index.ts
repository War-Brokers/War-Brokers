import type { Player } from "@warbrokers/types/src/player"

import { createCache } from "@/cache"
import { env } from "@/env"
import { fetchUpstream, upstreamTimeoutMs } from "@/fetch"

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

        return {
            response: await fetchWBDB("/latest_daily.txt", DAILY_FETCH_TIMEOUT),
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

export { getDailyKillsPlayerCount, getDailyKillsRange, getDailyKillsRanking } from "./dailyKills"
