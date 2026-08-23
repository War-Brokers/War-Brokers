import type { LogPlayerDistribution, PlayerDistribution } from "@/db/distribution"
import { db } from "@/index"

export const cacheUpdateIntervalHours = 24

type CachedValue<T> = {
    value: T
    updatedAt: string
}

function createDistributionCache<T>(name: string, load: () => Promise<T>) {
    let cachedValue: CachedValue<T> | undefined
    let refreshPromise: Promise<CachedValue<T>> | undefined
    let started = false

    async function refresh() {
        if (refreshPromise) return await refreshPromise

        refreshPromise = load()
            .then((value) => {
                cachedValue = { value, updatedAt: new Date().toISOString() }
                return cachedValue
            })
            .finally(() => {
                refreshPromise = undefined
            })

        return await refreshPromise
    }

    function scheduleRefreshAfter(delay: number) {
        const timer = setTimeout(runRefreshCycle, delay)
        timer.unref()
    }

    function runRefreshCycle() {
        void refresh().then(
            () => {
                scheduleRefreshAfter(cacheUpdateIntervalHours * 60 * 60 * 1000)
            },
            (error: unknown) => {
                console.error(`[${name}-refresh-error]`, error)
                scheduleRefreshAfter(60 * 1000) // 1 minute
            },
        )
    }

    function start() {
        if (started) return
        started = true
        runRefreshCycle()
    }

    async function get() {
        if (cachedValue) return cachedValue
        if (refreshPromise) return await refreshPromise

        // startDistributionCache is called on server startup so this should mostly be unreachable
        throw new Error(`${name} cache is unavailable`)
    }

    return { get, start }
}

const distributionCache = createDistributionCache<PlayerDistribution>(
    "player-distribution",
    async () => {
        const [gamesElo, killsElo, level, timeAlive, xp] = await Promise.all([
            db.getGamesEloDistribution(),
            db.getKillsEloDistribution(),
            db.getLevelDistribution(),
            db.getTimeAliveDistribution(),
            db.getXPDistribution(),
        ])

        return { gamesElo, killsElo, level, timeAlive, xp }
    },
)

const logDistributionCache = createDistributionCache<LogPlayerDistribution>(
    "player-log-distribution",
    async () => {
        const [level, timeAlive, xp] = await Promise.all([
            db.getLogLevelDistribution(),
            db.getLogTimeAliveDistribution(),
            db.getLogXPDistribution(),
        ])

        return { level, timeAlive, xp }
    },
)

export function startDistributionCache() {
    distributionCache.start()
    logDistributionCache.start()
}

export async function getCachedDistribution() {
    const { value, updatedAt } = await distributionCache.get()

    return { ...value, updatedAt }
}

export async function getCachedLogDistribution() {
    const { value, updatedAt } = await logDistributionCache.get()

    return { ...value, updatedAt }
}
