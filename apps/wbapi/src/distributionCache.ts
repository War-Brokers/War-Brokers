import { createCache } from "@/cache"
import type { LogPlayerDistribution, PlayerDistribution } from "@/db/distribution"
import { db } from "@/index"

export const cacheUpdateIntervalHours = 24
const cacheUpdateIntervalMs = cacheUpdateIntervalHours * 60 * 60 * 1000

const distributionCache = createCache<PlayerDistribution>(
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
    {
        cacheTimeMs: cacheUpdateIntervalMs,
        refreshIntervalMs: cacheUpdateIntervalMs,
        allowStale: true,
    },
)

const logDistributionCache = createCache<LogPlayerDistribution>(
    "player-log-distribution",
    async () => {
        const [level, timeAlive, xp] = await Promise.all([
            db.getLogLevelDistribution(),
            db.getLogTimeAliveDistribution(),
            db.getLogXPDistribution(),
        ])

        return { level, timeAlive, xp }
    },
    {
        cacheTimeMs: cacheUpdateIntervalMs,
        refreshIntervalMs: cacheUpdateIntervalMs,
        allowStale: true,
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
